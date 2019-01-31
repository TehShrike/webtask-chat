const MAX_FROM_BYTES = 20
const MAX_MESSAGE_BYTES = 500
const MAX_MESSAGE_HISTORY = 20

module.exports = {
	addMessage({ number: lastMessageNumber, messages }, { from, message }, { maxMessageHistory = MAX_MESSAGE_HISTORY } = {}) {
		if (typeof from !== `string` || typeof message !== `string`) {
			throw new Error(`Must supply "from" as a string, and "message" as a string`)
		} else if (Buffer.byteLength(from) > MAX_FROM_BYTES) {
			throw new Error(`Name is too long`)
		} else if (Buffer.byteLength(message) > MAX_MESSAGE_BYTES) {
			throw new Error(`Message is too long`)
		}

		return {
			number: lastMessageNumber + 1,
			messages: [
				...(messages.slice(-(maxMessageHistory - 1))),
				{ from, message },
			],
		}
	},
	getNewMessages({ number, messages }, lastSeen) {
		const unseenMessageCount = number - lastSeen

		return {
			number,
			messages: unseenMessageCount === 0
				? []
				: messages.slice(-unseenMessageCount),
		}
	},
}
