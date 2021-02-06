import React, { useEffect, useState } from 'react';
import { IconButton, makeStyles, Hidden } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Message from './Message/Message';
import HeaderOptionMenu from '../ChatroomHeader/HeaderOptionMenu/HeaderOptionMenu';

let prevScrollPosition;

/*
Parent container component that handles logic for displaying messages in order with the senders name.
Dose not handle logic for Emojis. The Message component calls a component that handles Emojis.
This component passes the senders name and message to the Message component for styling. Then displays them.
*/
const UserMessages = (props) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(true);
  const [optionsMenuElements, setOptionsMenuElements] = useState(null);

  const useStyles = makeStyles(theme => ({
    container: {
      overflowY: 'scroll',
      height: 'calc(100vh - 6rem)',
      position: 'relative',
      textAlign: 'center',
      msOverflowStyle: 'none',
      overflow: '-moz-scrollbars-none',
      width: '75vw',
      boxSizing: 'content-box',
      '&::-webkit-scrollbar': { display: 'none' },
      backgroundColor: theme.palette.primary.light,
      padding: '1rem',
      margin: '2rem',
      borderRadius: '15px',
    },
    menu: {
      float: 'left',
      svg: { fontSize: '2rem' },
    },
    options: {
      float: 'right',
      svg: { fontSize: '2rem' },
    },
  }));
  const classes = useStyles();

  // eslint-disable-next-line prefer-const
  let displayedMessages = [<p key="-10">Please select a chatroom.</p>];
  let messageKey = 1;
  // auto scrolls down the div. dose it on every reload of the component
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

  // shows & hides the options menu. triggered by the three dots in the top right of the header
  const toggleOptionsMenu = () => {
    if (isOptionsMenuOpen === true) {
      setOptionsMenuElements(
        <HeaderOptionMenu
          setOptionsMenuElements={setOptionsMenuElements}
          setAreSettingsShowing={props.setAreSettingsShowing}
          intentionalAndForcedUserLogout={props.intentionalAndForcedUserLogout}
        />,
      );
    } else {
      setOptionsMenuElements(null);
    }
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

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
        changes the sidebar opener between a x and a burger( the three lines )
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
  const toggleSidebarButtonStyles = () => {
    if (props.isSidebarOpen) {
      // make the burger button a X
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
    // sidebar is closed show the burger (three lines) to open it.
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
    <div className={classes.container} id="scrolldown">
      <IconButton
        tabIndex="0"
        className={classes.options}
        onClick={() => toggleOptionsMenu()}
        aria-label="Open options menu button"
        aria-haspopup="true"
        size="small"
      >
        <MoreVertIcon color="primary" />
      </IconButton>
      <Hidden lgUp>
        {burger}
      </Hidden>
      { displayedMessages}
      { props.children}
      { optionsMenuElements}
    </div>
  );
};

export default UserMessages;
