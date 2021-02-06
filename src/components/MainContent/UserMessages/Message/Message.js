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
    messageContainer: {
      maxWidth: '95vw',
      textAlign: 'left',
      margin: '.25rem 0',
    },
    messageText: {
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
    receiverMessage: {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.primary.light,
    },
    receiverTitle: {
      textAlign: 'right',
    },
  }));
  const classes = useStyles();

  let messageColor = null;
  let messageAlignment = null;
  let messageTitle = null;
  /** Sets styles for message based on if it is the sender or receiver message */
  if (props.isMessageSender) {
    messageColor = classes.receiverMessage;
    messageTitle = classes.receiverTitle;
    messageAlignment = 'flex-end';
  } else {
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
      <Grid item className={classes.messageContainer}>
        <Typography className={messageTitle} variant="subtitle2" style={{ textTransform: 'capitalize' }}>{sanitizedName}</Typography>
        <Emoji className={`${messageColor} ${classes.messageText}`} text={sanitizedMessage} />
      </Grid>
    </Grid>
  );
};

export default message;
