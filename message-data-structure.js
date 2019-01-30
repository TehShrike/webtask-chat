module.exports = ({ number: lastMessageNumber, messages }, { number, from, message }) => {
	if (typeof number !== `number` || typeof from !== `string` || typeof message !== `string`) {
		throw new Error(`Must supply "number" as a number, "from" as a string, and "message" as a string`)
	}

	if (number > lastMessageNumber + 1 || number < (lastMessageNumber - messages.length)) {
		return makeDataStructureFit({
			number: lastMessageNumber,
			messages,
		})
	}

	if (number === lastMessageNumber + 1) {
		return makeDataStructureFit({
			number,
			messages: [
				...messages,
				{ from, message },
			],
		})
	}

	if (number === lastMessageNumber - messages.length) {
		return makeDataStructureFit({
			number: lastMessageNumber,
			messages: [
				{ from, message },
				...messages,
			],
		})
	}

	const offsetFromTheExpectedNumber = lastMessageNumber - number + 1
	const sliceIndex = messages.length - offsetFromTheExpectedNumber

	return makeDataStructureFit({
		number: lastMessageNumber,
		messages: [
			...messages.slice(0, sliceIndex),
			{ from, message },
			...messages.slice(sliceIndex),
		],
	})
}

const MAX_BYTES = module.exports.MAX_BYTES = 350 * 1024

const makeDataStructureFit = data => {
	// If you want to try to improve server-side performance, start here
	while (Buffer.byteLength(JSON.stringify(data)) >= MAX_BYTES) {
		data.messages.shift()
	}

	return data
}
