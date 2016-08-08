import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/cli.js',
	format: 'cjs',
	plugins: [
		babel()
	],
	dest: 'bin/cli.js',
    banner: '#!/usr/bin/env node'
};
