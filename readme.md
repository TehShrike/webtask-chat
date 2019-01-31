A simple disposable chat room built with [Webtask](https://webtask.io/).

# Install and deploy

To deploy your own room:

```sh
git clone git@github.com:TehShrike/webtask-chat.git
cd webtask-chat
npm i
npm run first-run
```

The `first-run` script will

- initialize your Webtask profile
- deploy the endpoint
- copy the endpoint URL to your clipboard
- open the chat client in your browser

To chat with someone "privately", send them [the link to the client](https://svelte.technology/repl?version=2.16.0&gist=46b4fc00c52c196129c1ba42a5df0fb1) and your webtask endpoint URL.

To destroy the endpoint and wipe any chat history, run

```sh
npm run destroy
```

# License

[WTFPL](https://wtfpl2.com)
