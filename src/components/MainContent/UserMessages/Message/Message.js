import React from 'react';
import DOMPurify from 'dompurify';
import Emoji from 'react-emoji-render';
import { Typography, makeStyles, Grid } from '@material-ui/core';

/*
User interface component that sanitizes the message and senders name and displays it.
This component calls and Emoji component that will convert any :emojiName: syntax to emojis. Example :smile:
*/
const message = (props) => {
  const useStyles = makeStyles(theme => ({
    messageText: {
      display: 'inline-block',
      padding: '.5rem 1rem',
      lineHeight: '2rem',
      borderRadius: '15px',
      maxWidth: 'calc(100% - 2rem)',
      wordWrap: 'break-word',
      margin: '.25rem 0 1rem 0',
    },
    senderContainer: {
      textAlign: 'left',
    },
    senderMessage: {
      backgroundColor: theme.palette.background.default,
    },
    receiverContainer: {
      textAlign: 'right',
    },
    receiverMessage: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.primary.light,
    },
    receiverTitle: {
      textAlign: 'right',
    },
  }));
  const classes = useStyles();

  let messageContainer = null;
  let messageColor = null;
  let messageAlignment = null;
  let messageTitle = null;
  /** Sets styles for message based on if it is the sender or receiver message */
  if (props.isMessageSender) {
    messageContainer = classes.receiverContainer;
    messageColor = classes.receiverMessage;
    messageTitle = classes.receiverTitle;
    messageAlignment = 'flex-end';
  } else {
    messageContainer = classes.senderContainer;
    messageAlignment = 'flex-start';
    messageColor = classes.senderMessage;
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
    <Grid container justify={messageAlignment}>
      <Grid item xs={10} className={messageContainer}>
        <Typography className={messageTitle} variant="subtitle2" style={{ textTransform: 'capitalize' }}>{sanitizedName}</Typography>
        <Emoji className={`${messageColor} ${classes.messageText}`} text={sanitizedMessage} />
      </Grid>
    </Grid>
  );
};

export default message;
