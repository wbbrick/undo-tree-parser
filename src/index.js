import { readFile } from 'fs';
import { processData } from './parser';
import yargs from 'yargs';

let args = yargs
		.usage('$0 [args]')
		.options({
			'e': {
				alias: 'editor',
				demand: false,
				default: 'emacs',
				choices: ['emacs', 'vim'],
				describe: 'The editor type to parse',
				type: 'string'
			}
		})
		.help('help')
		.argv;

let options = {
	
};

readFile( args._[0], ( err, output ) => err ? err : processData( output, options ) );
