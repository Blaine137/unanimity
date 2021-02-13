import React, { useEffect } from 'react';
import { IconButton, makeStyles, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Message from './Message/Message';

let prevScrollPosition;

/**
* Parent container component that handles logic for displaying messages in order with the senders name.
* Dose not handle logic for Emojis. The Message component calls a component that handles Emojis.
* This component passes the senders name and message to the Message component for styling. Then displays them.
*/
const UserMessages = (props) => {
  const useStyles = makeStyles(theme => ({
    messagesContainer: {
      height: 'calc(100vh - 7rem)',
      width: 'calc(100% - 6rem)',
      position: 'relative',
      backgroundColor: theme.palette.primary.light,
      padding: '2rem',
      margin: '1rem',
      borderRadius: '15px',
    },
    messageScroll: {
      /** margin top is spacing for the sidebar opener on mobile */
      marginTop: '2rem',
      height: '90%',
      overflowY: 'scroll',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      overflow: '-moz-scrollbars-none',
      '&::-webkit-scrollbar': { display: 'none' },
    },
    menu: {
      float: 'left',
      svg: { fontSize: '2rem' },
    },
    options: {
      float: 'right',
      svg: { fontSize: '2rem' },
    },
    [theme.breakpoints.up('md')]: {
      container: {
        height: 'calc(100vh - 8rem)',
        width: 'calc(100% - 8rem)',
        margin: '2rem',
        borderRadius: '15px',
      },
    },
    [theme.breakpoints.up('lg')]: {
      /** remove spacing from mobile sidebar opener */
      messageScroll: {
        marginTop: '0',
      },
    },
  }));
  const classes = useStyles();

  let messageKey = 1;
  /** message to be displayed when their is no chatroom selected */
  // eslint-disable-next-line prefer-const
  let displayedMessages = [<Message key={messageKey} isMessageSender="true" senderName="" currentMessage=":backhand_index_pointing_left: Please select a chatroom. :left_speech_bubble:" />];

  // Auto scrolls down the div. Dose it on every reload of the component
  useEffect(() => {
    const messengerMainContainer = document.getElementById('scrolldown');
    // if they are all the way at the top or all the way at the bottom auto scroll down.
    if (messengerMainContainer.scrollTop === 0 || (messengerMainContainer.offsetHeight + messengerMainContainer.scrollTop) === prevScrollPosition) {
      prevScrollPosition = messengerMainContainer.scrollHeight;
      messengerMainContainer.scrollTop = messengerMainContainer.scrollHeight;
    } else {
      // keep up with the prev height so that if they scroll all the way down it will be recognized and trigger auto scroll
      prevScrollPosition = messengerMainContainer.scrollHeight;
    }
  });

  // sets displayedMessages to an array of the Message component where the index are the order the messages were sent.
  const orderMessagesForDisplay = (userMessagesObject, username) => {
    const userMessagesArray = [];
    // creates array where indexes are userMessagesObject[0](message sent number) and the value is userMessagesObject[1](the message itself)
    for (const [key, value] of Object.entries(userMessagesObject)) { userMessagesArray[key] = value; }
    let isMessageSender = false;
    if (username === props.authUsername) {
      isMessageSender = true;
    }
    userMessagesArray.forEach((message, index) => {
      if (message !== null) {
        messageKey++;
        displayedMessages[index] = (<Message isMessageSender={isMessageSender} senderName={username} currentMessage={message} key={messageKey} />);
      }
    });
  };

  // get the username for all the users in the current chatroom and calls orderMessagesForDisplay passing the userMessages and username
  const getUserNamesForMessages = () => {
    // if a chatroom has been selected
    if (props.currentChatRoom) {
      const chatRoomUsersAndMessages = Object.entries(props.currentChatRoom);
      chatRoomUsersAndMessages.forEach((UsernameAndMessages) => {
        // chatRoomUser[0] is the user id or nextmsgNum. if its a user show their messages
        if (UsernameAndMessages[0] !== 'nextMsgNum') {
          let username = 'nobody';
          // the next user will either be the auth user or the recipient. check to see if its the auth user
          if (UsernameAndMessages[0].substr(1) === props.authUID) {
            username = props.authUsername;
          } else {
            username = props.recipientName;
          }
          const UserMessagesObject = UsernameAndMessages[1];
          orderMessagesForDisplay(UserMessagesObject, username);
        }
      });
    }
  };

  /*
  * Changes the sidebar opener between a x and a burger( the three lines ).
  * Dose not cause the sidebar to open and close. Sidebar open and close is handled in messenger.js
  */
  const toggleSidebarButtonStyles = () => {
    if (props.isSidebarOpen) {
      /** Make the burger button a X */
      return (
        <IconButton
          tabIndex="0"
          onClick={() => props.toggleSidebar()}
          aria-label="Close sidebar"
          size="small"
          className={classes.menu}
        >
          <CloseIcon color="primary" />
        </IconButton>
      );
    }
    /** Sidebar is closed show the burger (three lines) to open it. */
    return (
      <IconButton
        tabIndex="0"
        onClick={() => props.toggleSidebar()}
        aria-label="Open sidebar"
        size="small"
        className={classes.menu}
      >
        <MenuIcon color="primary" />
      </IconButton>
    );
  };

  getUserNamesForMessages();
  // eslint-disable-next-line prefer-const
  let burger = toggleSidebarButtonStyles();
  return (
    <div className={classes.messagesContainer}>
      {/** sidebar opener */}
      <Hidden lgUp>
        {burger}
      </Hidden>
      {/** id is used for auto scroll down */}
      <div className={classes.messageScroll} id="scrolldown">
        {displayedMessages}
        {props.children}
      </div>
    </div>
  );
};

export default UserMessages;
