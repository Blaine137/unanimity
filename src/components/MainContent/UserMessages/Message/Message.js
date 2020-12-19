import React from 'react';
import styles from './Message.module.scss';
import DOMPurify from 'dompurify';
import Emoji from "react-emoji-render";

/*
User interface component that sanitizes the message and senders name and displays it.
This component calls and Emoji component that will convert any :emojiName: syntax to emojis. Example :smile:
*/
const message = props => {
    var messageStyle = null;
    if(props.isMessageSender) {
        messageStyle = styles.senderMessage;
    } else {
        messageStyle = styles.recieverMessage;
    }

    let sanitizedMessage = props.currentMessage;
    //only allows letters, numbers and ! ? $ & . : , - ( )
    sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$&.:,\-\(\)]/g,'');
    sanitizedMessage = DOMPurify.sanitize(sanitizedMessage);
    let sanitizedName = props.senderName;
    //only allows letters, numbers and ! ? $
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