import { processData } from './parser';

export default function parse( data, { editor='emacs', format='unix' } ) {
    try {
        return processData( data, { editor, format } );
    } catch( e ) {
        throw e;
    }
}
