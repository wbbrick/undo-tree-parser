import { parse } from 'sexpr-plus';
import { unix } from 'moment';

export function emacsDateConverter( date ) {
	let high = date[0], low = date[1];
	return unix( high * Math.pow(2, 16) + low ).toString();
}

export function isNaN(value) {
	return typeof(value) === 'number' && value != +value;
}

export function processNode( node ) {
	if( node.type === 'list' ) {
		return node.content.map( processNode );
	} else {
		return {
			'type': node.type,
			'content': node.content
		};
	}
}

export function findTimestamps( memo, it ) {
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
export function processData( data ) {
	let rawString = data.toString();
	let rawExpr = rawString.slice( rawString.indexOf( '\n' ) + 1 );
	let expr = parse( rawExpr );
	let processedList = expr.map( processNode );
	let timeStamps = expr.reduce( findTimestamps, [] );
	return timeStamps.map( emacsDateConverter );
}
