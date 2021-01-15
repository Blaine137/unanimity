import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import styles from './MessageInput.module.scss';

let lastMessageSentTime = null;

/*
Child component of MainContent. Is a textarea where users enter their message to send.
Throttles message send rate to prevent spam.
*/
const MessageInput = (props) => {
  const [userMessage, setUserMessage] = useState('');

  return (
    <div className={styles.inputContainer}>
      <textarea
        aria-label="Type a messages and press enter on the keyboard to send a message. You can also send emojis with :smile:."
        spellCheck="true"
        maxLength="1999"
        placeholder="Enter your message. Use our emojis by :smile:"
        className={styles.input}
        onChange={(e) => {
          setUserMessage(DOMPurify.sanitize(e.target.value));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
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
                e.target.value = '';
              } else {
                props.showHideCustomAlert(' Please wait two seconds before sending another message! ');
              }
            } else {
              props.showHideCustomAlert(' Please select a chatroom before sending a message! ');
            }
          }
        }}
      />
    </div>
  );
};

export default MessageInput;
