const toClipboard = require(`to-clipboard`)
const getStream = require(`get-stream`)

async function main() {
	const input = await getStream(process.stdin)

	const match = input.match(/^URL:\s+([^\s]+webtask-chat)/m)

	if (match) {
		toClipboard(match[1])
		console.log(`Copied the endpoint URL to your clipboard!`)
	}
}

main().catch(err => {
	process.nextTick(() => {
		throw err
	})
})
