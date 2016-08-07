import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'src/index.js',
	format: 'cjs',
	plugins: [
		// nodeResolve({
		// 	jsnext: true,
		// 	main: true
		// }),
		// commonjs({
		// 	extensions: [ '.js', '.json' ]
		// }),
		babel()
	],
	dest: 'bin/index.js'
};
