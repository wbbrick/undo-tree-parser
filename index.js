var fs = require('fs');
var parse = require('sexpr-plus').parse;


function isNaN(value) {
    return typeof(value) === 'number' && value != +value;
}

function processNode( node ){
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

		//condition for a timestamp
		if( it.content.length === 4
			&& it.content.reduce( ( memo, n ) => memo && !isNaN( parseInt( n.content, 0 ) ), true )
		  ) {
			  return memo.concat( [it.content] );
		  } else {
			  return memo.concat( it.content.reduce( findTimestamps, [] ) );
		  }
	}
	return memo;
}

function processData( err, output ) {
	'use strict';
	let rawString = output.toString();
	let rawExpr = rawString.slice( rawString.indexOf( '\n' ) + 1 );
	let expr = parse( rawExpr );
	let processedList = expr.map( processNode );
	let timeStamps = expr.reduce( findTimestamps, [] );
	console.dir( JSON.stringify( timeStamps ) );

}

fs.readFile( 'test.undo', processData );
