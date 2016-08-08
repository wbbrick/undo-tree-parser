(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('sexpr-plus'), require('moment')) :
	typeof define === 'function' && define.amd ? define(['sexpr-plus', 'moment'], factory) :
	(global.UndoTreeParser = factory(global.sexprPlus,global.moment));
}(this, function (sexprPlus,moment) { 'use strict';

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

	function parse$1(data, options) {
	    options.editor = options.editor || 'emacs';
	    options.format = options.format || 'unix';
	    try {
	        return processData(data, options);
	    } catch (e) {
	        throw e;
	    }
	}

	return parse$1;

}));