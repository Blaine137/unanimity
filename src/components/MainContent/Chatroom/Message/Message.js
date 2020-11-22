import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';

const message = props => {
    var messageStyle = null;
    if(props.isSender) {
        messageStyle = styles.senderMessage;
    } else {
        messageStyle = styles.recieverMessage;
    }

    let sanitizedMessage = props.currentMessage;
    sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g, '');
    sanitizedMessage = DOMPurify.sanitize(sanitizedMessage);
    let sanitizedName = props.senderName;
    sanitizedName = sanitizedName.replace(/[^\w\s!?$]/g, '');
    sanitizedName = DOMPurify.sanitize(sanitizedName);
    
    return (
        <div className={ styles.messageContainer }>
            <h3 className={ styles.userName }>{ sanitizedName }</h3>
            <p className={`${messageStyle} ${styles.message}`}>{ sanitizedMessage }</p>  
        </div>
    );
};

export default message;