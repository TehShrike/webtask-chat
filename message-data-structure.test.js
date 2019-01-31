const test = require(`zora`)
const { addMessage, getNewMessages } = require(`./message-data-structure.js`)

test(`Adds a new message to the end of an empty data structure`, t => {
	const messages = addMessage({
		number: 0,
		messages: [],
	}, {
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

test(`Adds a new message to the end of an data structure with 1 message`, t => {
	const messages = addMessage({
		number: 4,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	}, {
		from: `you`,
		message: `blarp`,
	})

	t.deepEqual(messages, {
		number: 5,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `blarp`,
		}],
	})
})

test(`maxMessageHistory`, t => {
	const messages = addMessage({
		number: 4,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `blarp`,
		}],
	}, {
		from: `you`,
		message: `BLARP`,
	}, { maxMessageHistory: 2 })

	t.deepEqual(messages, {
		number: 5,
		messages: [{
			from: `you`,
			message: `blarp`,
		}, {
			from: `you`,
			message: `BLARP`,
		}],
	})
})

test(`Get 1 latest changes with a chatlog of 2 messages`, t => {
	const chatlog = {
		number: 2,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `blarp`,
		}],
	}

	const lastSeen = 1
	t.deepEqual(getNewMessages(chatlog, lastSeen), {
		number: 2,
		messages: [{
			from: `you`,
			message: `blarp`,
		}],
	})
})

test(`Get 1 latest changes with a chatlog of 1 messages`, t => {
	const chatlog = {
		number: 1,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	}

	const lastSeen = 0
	t.deepEqual(getNewMessages(chatlog, lastSeen), {
		number: 1,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	})
})

test(`Get 0 latest changes with a chatlog of 1 messages`, t => {
	const chatlog = {
		number: 1,
		messages: [{
			from: `me`,
			message: `wat`,
		}],
	}

	const lastSeen = 1
	t.deepEqual(getNewMessages(chatlog, lastSeen), {
		number: 1,
		messages: [],
	})
})


test(`Return every message in the chatlog if the user hasn't seen any messages in a while`, t => {
	const chatlog = {
		number: 10,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `blarp`,
		}],
	}

	const lastSeen = 1
	t.deepEqual(getNewMessages(chatlog, lastSeen), {
		number: 10,
		messages: [{
			from: `me`,
			message: `wat`,
		}, {
			from: `you`,
			message: `blarp`,
		}],
	})
})



test(`addMessage throws without the required message properties`, t => {
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
			message: `b`,
		})
	})

	t.throws(() => {
		addMessage(initialMessages, {
			from: `b`,
		})
	})
})
