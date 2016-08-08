import { processData } from './parser';

export default function parse( data, options ) {
    options.editor = options.editor || 'emacs';
    options.format = options.format || 'unix';
    try {
        return processData( data, options );
    } catch( e ) {
        throw e;
    }
}
