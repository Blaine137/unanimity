import React from 'react';
import DOMPurify from 'dompurify';
import Emoji from 'react-emoji-render';
import { Typography } from '@material-ui/core';
import styles from './Message.module.scss';

/*
User interface component that sanitizes the message and senders name and displays it.
This component calls and Emoji component that will convert any :emojiName: syntax to emojis. Example :smile:
*/
const message = (props) => {
  let messageStyle = null;
  if (props.isMessageSender) {
    messageStyle = styles.recieverMessage;
  } else {
    messageStyle = styles.senderMessage;
  }

  let sanitizedMessage = props.currentMessage;
  // only allows letters, numbers and ! ? $ & . : , - ( )
  sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$&.:,\-()]/g, '');
  sanitizedMessage = DOMPurify.sanitize(sanitizedMessage);
  let sanitizedName = props.senderName;
  // only allows letters, numbers and ! ? $
  sanitizedName = sanitizedName.replace(/[^\w\s!?$]/g, '');
  sanitizedName = DOMPurify.sanitize(sanitizedName);

  return (
    <div className={styles.messageContainer}>
      <Typography variant="h5" className={styles.userName}>{ sanitizedName }</Typography>
      <Emoji className={`${messageStyle} ${styles.message}`} text={sanitizedMessage} />
    </div>
  );
};

export default message;
