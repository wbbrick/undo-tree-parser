var fs = require('fs');
var parse = require('sexpr-plus').parse;
var moment = require('moment');

(function (){
	'use strict';

	function emacsDateConverter( date ) {
		let high = date[0], low = date[1];
		return moment.unix( high * Math.pow(2, 16) + low ).toString();
	}

	function isNaN(value) {
		return typeof(value) === 'number' && value != +value;
	}

	function processNode( node ) {
		if( node.type === 'list' ) {
			return node.content.map( processNode );
		} else {
			return {
				'type': node.type,
				'content': node.content
			};
		}
	}

	function findTimestamps( memo, it ) {
		if( it.type === 'list' ) {

			//remove true values as sometimes they prepend timestamps and mess up our count
			let content = it.content.filter( ( item ) => item.content !== 't' );

			//condition for a timestamp
			let isTimestamp =
					content.length === 4
					&& content.reduce( ( memo, n ) => memo && !isNaN( parseInt( n.content, 0 ) ), true );

			if( isTimestamp ) {
				return memo.concat( [content.map( ( item ) => parseInt( item.content, 0 ) )] );
			} else {
				return memo.concat( content.reduce( findTimestamps, [] ) );
			}
		}
		return memo;
	}

		function processData( err, output ) {
			let rawString = output.toString();
			let rawExpr = rawString.slice( rawString.indexOf( '\n' ) + 1 );
			let expr = parse( rawExpr );
			let processedList = expr.map( processNode );
			let timeStamps = expr.reduce( findTimestamps, [] );
			console.dir( timeStamps.map( emacsDateConverter ) );

		}

		fs.readFile( 'test.undo', processData );

	}());
