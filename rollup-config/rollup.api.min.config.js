import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
	entry: 'src/index.js',
	format: 'umd',
	plugins: [
		babel(),
        uglify()
	],
    moduleName: 'UndoTreeParser',
	dest: 'bin/index.js'
};
