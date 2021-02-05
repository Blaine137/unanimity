import React from 'react';
import DOMPurify from 'dompurify';
import Emoji from 'react-emoji-render';
import { Typography, makeStyles } from '@material-ui/core';

/*
User interface component that sanitizes the message and senders name and displays it.
This component calls and Emoji component that will convert any :emojiName: syntax to emojis. Example :smile:
*/
const message = (props) => {
  const useStyles = makeStyles(theme => ({
    messageContainer: {
      display: 'block',
      maxWidth: '100vw',
      textAlign: 'left',
      padding: '1.5rem 1rem',
      margin: '.25rem 0 .25rem 0',
    },
    userName: {
      margin: '0',
      padding: '0 0 .25rem 0',
      textTransform: 'capitalize',
    },
    message: {
      display: 'inline-block',
      padding: '.5rem 1rem',
      lineHeight: '2rem',
      borderRadius: '15px',
      maxWidth: '80vw',
      wordWrap: 'break-word',
      margin: '0',
    },
    senderMessage: {
      backgroundColor: theme.palette.background.default,
    },
    recieverMessage: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.primary.light,
      float: 'right',
    },
  }));
  const classes = useStyles();

  let messageStyle = null;
  let userNameStyles = null;
  if (props.isMessageSender) {
    messageStyle = classes.recieverMessage;
    userNameStyles = classes.receiverTitle;
  } else {
    userNameStyles = null;
    messageStyle = classes.senderMessage;
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
    <div className={classes.messageContainer}>
      <Typography variant="subtitle2" className={classes.userName}>{sanitizedName}</Typography>
      <Emoji className={`${messageStyle} ${classes.message}`} text={sanitizedMessage} />
    </div>
  );
};

export default message;
