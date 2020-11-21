import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';

const message = props => {
    var messageStyle = null;
    if(props.isSender) {
        messageStyle = styles.senderName;
    } else {
        messageStyle = styles.recieverName;
    }

    let sanitizedMessage = props.currentMessage;
    sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g, '');
    sanitizedMessage = DOMPurify.sanitize(sanitizedMessage);
    let sanitizedName = props.senderName;
    sanitizedName = sanitizedName.replace(/[^\w\s!?$]/g, '');
    sanitizedName = DOMPurify.sanitize(sanitizedName);
    return (
        <div className={ `${ styles.message } ${ messageStyle }` }>
            <h3 className={ styles.userName }> { sanitizedName } </h3>
            <p>{ sanitizedMessage }</p>  
        </div>
    );
};

export default message;