const { addMessage, getNewMessages } = require(`./message-data-structure.js`)
const getStream = require(`get-stream`)

const niceStorage = contextStorage => ({
	get: () => new Promise((resolve, reject) => contextStorage.get(
		(err, data) => err ? reject(err) : resolve(data)
	)),
	set: data => new Promise((resolve, reject) => contextStorage.set(data,
		err => err ? reject(err) : resolve()
	)),
})

const getChatlog = niceStorage => niceStorage.get().then(chatlog => chatlog || { number: 0, messages: [] })
const retryOnConflict = async fn => {
	try {
		return await fn()
	} catch (err) {
		if (err.code === 409) {
			return await retryOnConflict(fn)
		}

		throw err
	}
}

const methods = {
	GET: async context => {
		const storage = niceStorage(context.storage)

		const lastSeenNumber = parseInt(context.query.number, 10) || 0
		const chatlog = await getChatlog(storage)

		return getNewMessages(chatlog, lastSeenNumber)
	},
	POST: async context => {
		// really should return 400 instead of 500 if the message or from are too long
		const storage = niceStorage(context.storage)

		const newStructure = await retryOnConflict(async() => {
			const chatlog = await getChatlog(storage)

			const newStructure = addMessage(chatlog, context.body)
			await storage.set(newStructure)

			return newStructure
		})

		const lastSeenNumber = parseInt(context.body.number, 10) || 0
		return getNewMessages(newStructure, lastSeenNumber)
	},
}

module.exports = async(context, req, res) => {
	if (methods[req.method]) {
		const headers = {
			'Content-Type': `application/json`,
		}

		const bodyString = await getStream(req, { encoding: `utf8` })

		if (bodyString) {
			try {
				context.body = JSON.parse(bodyString)
			} catch (err) {
				context.body = {}
			}
		}

		methods[req.method](context).then(response => {
			res.writeHead(200, headers)
			res.end(JSON.stringify(response))
		}, err => {
			console.error(err)
			res.writeHead(500, headers)
			res.end(JSON.stringify({
				error: true,
				body: err.message || err,
			}))
		})
	} else {
		res.writeHead(405)
		res.end()
	}
}
