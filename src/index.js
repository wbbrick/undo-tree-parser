import { readFile } from 'fs';
import { processData } from './parser';
import yargs from 'yargs';

var args = yargs
    .usage('$0 <cmd> [args]')
    .help('help')
    .argv;

readFile( args._[0], ( err, output ) => err ? err : processData( output ) );
