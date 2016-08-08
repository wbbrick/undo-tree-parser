import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',
	format: 'umd',
	plugins: [
		babel()
	],
    moduleName: 'UndoTreeParser',
	dest: 'bin/index.js'
};
