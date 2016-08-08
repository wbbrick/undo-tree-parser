import { readFile, writeFile } from 'fs';
import { processData } from './parser';
import yargs from 'yargs';

let args = yargs
		.usage('Usage: $0 <filename> [options]')
		.example(
			'$0 test.undo -e emacs -f unix -o myTimes.json',
			'Read timestamps the emacs-formatted persistent undo file "test.undo" and output a ' +
				'json array of timestamps to myTimes.json'
		)
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
		.options({
			'f': {
				alias: 'format',
				demand: false,
				default: 'unix',
				describe: 'The datetime format (as specified by moment.js)',
				type: 'string'
			}
		})
		.options({
			'o': {
				alias: 'output',
				demand: false,
				default: 'process.stdout',
				describe: 'The output file',
				type: 'string'
			}
		})
		.alias( 'h', 'help' )
		.help('help')
		.argv;

let options = {
	'editor': args.editor,
	'format': args.format
};

function processFile( err, data ) {
	if( err ) {
		throw err;
	}
    let output = processData( data, options );
    if( !args.output || args.output === "process.stdout" ) {
        console.log( output );
    } else {
        writeFile( args.output, output );
    }
}

if( !args._[0] ) {
    throw new Error( 'Filename not specified.' );
}

try {
	readFile( args._[0], processFile );
} catch ( e ) {
	throw e;
}
