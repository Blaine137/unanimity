import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';
import Emoji from "react-emoji-render";

const message = props => {
    var messageStyle = null;
    if(props.isSender) {
        messageStyle = styles.senderMessage;
    } else {
        messageStyle = styles.recieverMessage;
    }

    let sanitizedMessage = props.currentMessage;
    sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$&:,\-\(\)]/g,'');
    sanitizedMessage = DOMPurify.sanitize(sanitizedMessage);
    let sanitizedName = props.senderName;
    sanitizedName = sanitizedName.replace(/[^\w\s!?$]/g, '');
    sanitizedName = DOMPurify.sanitize(sanitizedName);
    
    return (
        <div className={ styles.messageContainer }>
            <h3 className={ styles.userName }>{ sanitizedName }</h3>
            <Emoji className={`${messageStyle} ${styles.message}`} text={sanitizedMessage} />
        </div>
    );
};

export default message;