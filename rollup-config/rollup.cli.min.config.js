import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
	entry: 'src/cli.js',
	format: 'cjs',
	plugins: [
		babel(),
        uglify()
	],
	dest: 'bin/cli.js'
};
