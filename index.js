const pify = require(`pify`)
const addMessage = require(`./message-data-structure.js`)

// TODO: return message number ids with each message?

const methods = {
	GET: async context => {
		const storage = pify(context.storage)

		const requestNumber = parseInt(context.query.number, 10)
		const { number = 0, messages = [] } = storage.get()

		if (requestNumber < number) {
			const unseenMessages = number - requestNumber
			return {
				number,
				messages: messages.slice(-unseenMessages),
			}
		} else if (requestNumber === number) {
			return {
				number,
				messages: [],
			}
		}

		return storage.get()
	},
	POST: async context => {
		// make sure the from/message arent more than 300 characters
		const storage = pify(context.storage)
		const newStructure = addMessage(storage, context.body)
		await storage.set(newStructure)

		// TODO: maybe be a bit more efficient about this?  Only return things where the number is different than you'd expect?
		return newStructure
	},
}

module.exports = (context, req, res) => {
	if (methods[req.method]) {
		const headers = {
			'Content-Type': `application/json`,
		}

		methods[req.method](context).then(response => {
			res.writeHead(200, headers)
			res.end(JSON.stringify(response))
		}, err => {
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
