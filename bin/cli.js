#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var sexprPlus = require('sexpr-plus');
var moment = require('moment');
var yargs = _interopDefault(require('yargs'));

function emacsDateConverter(date) {
	var high = date[0],
	    low = date[1];
	return moment.unix(high * Math.pow(2, 16) + low).toString();
}

function isNaN(value) {
	return typeof value === 'number' && value != +value;
}

function processNode(node) {
	if (node.type === 'list') {
		return node.content.map(processNode);
	} else {
		return {
			'type': node.type,
			'content': node.content
		};
	}
}

function findTimestamps(memo, it) {
	if (it.type === 'list') {

		//remove true values as sometimes they prepend timestamps and mess up our count
		var content = it.content.filter(function (item) {
			return item.content !== 't';
		});

		//condition for a timestamp
		var isTimestamp = content.length === 4 && content.reduce(function (memo, n) {
			return memo && !isNaN(parseInt(n.content, 0));
		}, true);

		if (isTimestamp) {
			return memo.concat([content.map(function (item) {
				return parseInt(item.content, 0);
			})]);
		} else {
			return memo.concat(content.reduce(findTimestamps, []));
		}
	}
	return memo;
}
function processData(data) {
	var rawString = data.toString();
	var rawExpr = rawString.slice(rawString.indexOf('\n') + 1);
	var expr = sexprPlus.parse(rawExpr);
	var processedList = expr.map(processNode);
	var timeStamps = expr.reduce(findTimestamps, []);
	return timeStamps.map(emacsDateConverter);
}

var args = yargs.usage('Usage: $0 <filename> [options]').example('$0 test.undo -e emacs -f unix -o myTimes.json', 'Read timestamps the emacs-formatted persistent undo file "test.undo" and output a ' + 'json array of timestamps to myTimes.json').options({
	'e': {
		alias: 'editor',
		demand: false,
		default: 'emacs',
		choices: ['emacs', 'vim'],
		describe: 'The editor type to parse',
		type: 'string'
	}
}).options({
	'f': {
		alias: 'format',
		demand: false,
		default: 'unix',
		describe: 'The datetime format (as specified by moment.js)',
		type: 'string'
	}
}).options({
	'o': {
		alias: 'output',
		demand: false,
		default: 'process.stdout',
		describe: 'The output file',
		type: 'string'
	}
}).alias('h', 'help').help('help').argv;

var options = {
	'editor': args.editor,
	'format': args.format,
	'output': args.output
};

function processFile(err, output) {
	if (err) {
		throw err;
	} else {
		processData(output, options);
	}
}

try {
	fs.readFile(args._[0], processFile);
} catch (e) {
	throw e;
}