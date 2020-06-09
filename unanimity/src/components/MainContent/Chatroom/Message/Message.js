import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';

const message = ( props ) => {

    //the message coming in should be sanitized already but just in case. we sanitize it.
    let sanitizedMessage = props.currentMessage;
    sanitizedMessage = sanitizedMessage.replace( /[^\w\s!?$]/g,'' );
    sanitizedMessage = DOMPurify.sanitize( sanitizedMessage );

    let sanitizedName = props.senderName;
    sanitizedName = sanitizedName.replace( /[^\w\s!?$]/g,'' );
    sanitizedName = DOMPurify.sanitize( sanitizedName );

    return(

        <div className = { styles.message } >
            <h3 className = { styles.senderName }  > { sanitizedName } </h3>
            <p> { sanitizedMessage } </p>
            
        </div>

    );

}
export default message;