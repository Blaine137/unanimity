import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import SendIcon from '@material-ui/icons/Send';
import {
  makeStyles, Button, Grid, Hidden, TextareaAutosize, FormControl, FormHelperText,
} from '@material-ui/core';

let lastMessageSentTime = null;

/**
* Is a textarea where users enter their message to send.
* Throttles message send rate to prevent spam.
*/
const MessageInput = (props) => {
  const [userMessage, setUserMessage] = useState('');
  const [isUserMessageError, setIsUserMessageError] = useState(false);
  const [userMessageErrorText, setUserMessageErrorText] = useState('');

  const useStyles = makeStyles(theme => ({
    inputContainer: {
      width: 'calc(100% - 3rem)',
      padding: '.5rem',
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      borderRadius: '15px',
      backgroundColor: theme.palette.background.default,
    },
    input: {
      border: `1px solid ${theme.palette.text.secondary}`,
      /** border radius set to 4px to match material UI inputs. */
      borderRadius: '4px',
      width: 'calc(100% - 2rem)',
      height: '1rem',
      padding: '1rem',
      fontSize: '1rem',
      resize: 'none',
      '&::placeholder': {
        textTransform: 'capitalize',
      },
      '&:hover': { cursor: 'pointer' },
      '&:focus': {
        outline: 'none',
        borderColor: theme.palette.text.primary,
        '&::placeholder': {
          color: 'transparent',
        },
      },
    },
    sendButton: {
      width: '100%',
      height: '3rem',
    },
    [theme.breakpoints.up('md')]: {
      inputContainer: {
        width: 'calc(100% - 5rem)',
        padding: '.5rem 1rem',
        position: 'absolute',
        bottom: '2rem',
        left: '2.9rem',
      },
    },
  }));
  const classes = useStyles();

  const validateAndSendMessage = input => {
    if (props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
      // if user has not sent a message yet, don't throttle message send rate.
      if (lastMessageSentTime === null) {
        lastMessageSentTime = Date.now();
        lastMessageSentTime -= 50000;
      }
      const currentTime = Date.now();
      if (currentTime >= (lastMessageSentTime + 2000)) {
        lastMessageSentTime = currentTime;
        props.newMessage(userMessage);
        // makes the input box empty once newMessage gets the input
        // eslint-disable-next-line no-param-reassign
        input.target.value = '';
        setIsUserMessageError(false);
        setUserMessageErrorText('');
      } else {
        setIsUserMessageError(true);
        setUserMessageErrorText('Please wait two seconds before sending another message!');
      }
    } else {
      setIsUserMessageError(true);
      setUserMessageErrorText('Please select a chatroom before sending a message!');
    }
  };

  return (
    <Grid spacing={1} container justify="center" alignItems="center" className={classes.inputContainer}>
      <Grid item xs={10} sm={10} md={11}>
        <FormControl fullWidth margin="dense" error={isUserMessageError}>
          <TextareaAutosize
            aria-label="Type a messages and press enter on the keyboard to send a message. You can also send emojis with :smile:."
            spellCheck="true"
            maxLength="1999"
            rows="1"
            placeholder={props.currentChatRoomName === 'Unanimity' ? 'Try sending :SMILE:' : `Message ${props.currentChatRoomName}`}
            className={classes.input}
            id="input"
            onChange={(e) => {
              setUserMessage(DOMPurify.sanitize(e.target.value));
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                validateAndSendMessage(e);
              }
            }}
            aria-describedby="userMessageError"
          />
          <FormHelperText id="userMessageError">{userMessageErrorText}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={2} sm={2} md={1}>
        <Button
          className={classes.sendButton}
          aria-label="Send new message"
          type="submit"
          value="Send"
          color="secondary"
          variant="contained"
          onClick={e => {
            // eslint-disable-next-line prefer-const
            let messageInput = document.getElementById('input');
            messageInput.value = '';
            validateAndSendMessage(e);
          }}
          disableElevation
        >
          <Hidden mdDown>SEND</Hidden>
          <SendIcon style={{ height: '1rem' }} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default MessageInput;
