var fs = require('fs');
var parse = require('sexpr-plus').parse;
var moment = require('moment');
var parser = require('./parser').processData;
var yargs = require('yargs');

var args = yargs
    .usage('$0 <cmd> [args]')
    .help('help')
    .argv;

fs.readFile( args._[0], ( err, output ) => err ? err : parser( output ) );
