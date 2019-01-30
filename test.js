const test = require(`zora`)
const addMessage = require(`./message-data-structure.js`)
const { MAX_BYTES } = addMessage

test(`Adds a new message to the end of an empty data structure`, t => {
	const messages = addMessage({
		number: 0,
		messages: [],
	}, {
		number: 1,
		from: `me`,
		message: `wat`,
	})

	t.deepEqual(messages, {
		number: 1,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	})
})

test(`Adds a new message to the end of an data structure with one message`, t => {
	const initialMessages = {
		number: 1,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	}

	const outputMessages = addMessage(initialMessages, {
		number: 2,
		from: `me`,
		message: `Talking to myself`,
	})

	const expected = {
		number: 2,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `me`,
			message: `Talking to myself`,
		}],
	}

	t.deepEqual(outputMessages, expected)
})

test(`Inserts a slow message into the correct place`, t => {
	const initialMessages = {
		number: 2,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	const newMessage = {
		number: 2,
		from: `me`,
		message: `I haven't seen any message from you yet`,
	}

	const expected = {
		number: 2,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `me`,
			message: `I haven't seen any message from you yet`,
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	t.deepEqual(addMessage(initialMessages, newMessage), expected)
})

test(`Don't insert a message if its number is too old`, t => {
	const initialMessages = {
		number: 4,
		messages: [{
			from: `me`,
			message: `wat`,
			// number: 3
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	const newMessage = {
		number: 1,
		from: `me`,
		message: `meh`,
	}

	const expected = initialMessages

	t.deepEqual(addMessage(initialMessages, newMessage), expected, `No change`)
})

test(`Insert a slow message at the back of the data structure if appropriate`, t => {
	const initialMessages = {
		number: 4,
		messages: [{
			from: `me`,
			message: `wat`,
			// number: 3
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	const newMessage = {
		number: 2,
		from: `me`,
		message: `meh`,
	}

	const expected = {
		number: 4,
		messages: [{
			from: `me`,
			message: `meh`,
		}, {
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	t.deepEqual(addMessage(initialMessages, newMessage), expected)
})

test(`Throws without the required message properties`, t => {
	const initialMessages = {
		number: 4,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `wut`,
		}],
	}

	t.throws(() => {
		addMessage(initialMessages, {
			from: `a`,
			message: `b`,
		})
	})

	t.throws(() => {
		addMessage(initialMessages, {
			number: `a`,
			from: `a`,
			message: `b`,
		})
	})

	t.throws(() => {
		addMessage(initialMessages, {
			number: 1,
			message: `b`,
		})
	})

	t.throws(() => {
		addMessage(initialMessages, {
			number: 1,
			from: `b`,
		})
	})
})

const largeishMessage = {
	from: `Humprey Bogart Billy Bob McKenzie III`,
	message: `This is about the longest message I can imagine anyone sending.  It's pretty long, but it will be displayed in a pretty tiny chunk of a window, so you know, I think it's reasonable to impose some limits.  It looks like we're closing in on three hundred characters, so I think that's where I'll stop.`,
} // 360 bytes JSON

test(`Drop old messages until the data structure fits in 350KB`, t => {
	const tooManyMessages = {
		number: 10,
		messages: new Array(1000).fill(largeishMessage),
	}

	t.ok(Buffer.byteLength(JSON.stringify(tooManyMessages)) > MAX_BYTES, `The initial message object is too large`)

	const newMessageStructure = addMessage(tooManyMessages, {
		number: 11,
		from: `me`,
		message: `yarp`,
	})

	const structureBytes = Buffer.byteLength(JSON.stringify(newMessageStructure))
	t.ok(structureBytes < MAX_BYTES, `${ structureBytes } should be less than than ${ MAX_BYTES }`)

	const { messages } = newMessageStructure
	t.ok(messages.length <= 1000)
	t.equal(newMessageStructure.number, 11)
	t.deepEqual(messages[messages.length - 1], {
		from: `me`,
		message: `yarp`,
	})
})
