import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';

const message = ( props ) => {

    //the message coming in should be sanitized already but just in case. we sanitize it.
    let sanitizedMessage = props.currentMessage;
    sanitizedMessage = sanitizedMessage.replace( /[^\w\s!?$]/g,'' );
    sanitizedMessage = DOMPurify.sanitize( sanitizedMessage );

    return(

        <div className = { styles.message } >

            <p> { sanitizedMessage } </p>
            
        </div>

    );

}
export default message;