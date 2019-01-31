import commonjs from 'rollup-plugin-commonjs'

export default {
	input: `webtask-entry-point.js`,
	output: {
		file: `bundle.js`,
		format: `cjs`,
	},
	plugins: [
		commonjs(),
	],
	external: [ `get-stream` ],
}
