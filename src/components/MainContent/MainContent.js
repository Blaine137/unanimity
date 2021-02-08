import React, { useState } from 'react';
import UserMessages from './UserMessages/UserMessages';
import AccountSettings from './AccountSettings/AccountSettings';
import MessageInput from './MessageInput/MessageInput';

/*
* Parent component for Header, ChatRoom, Input, and AccountSettings.
*/
const MainContent = (props) => {
  /** default to the chatroom */
  let body = (
    <UserMessages
      currentChatRoom={props.currentChatRoom}
      recipientName={props.currentChatRoomName}
      authUsername={props.authUsername}
      authUID={props.authUID}
      toggleSidebar={props.toggleSidebar}
      isSidebarOpen={props.isSidebarOpen}
      intentionalAndForcedUserLogout={props.intentionalAndForcedUserLogout}
      setAreSettingsShowing={props.setAreSettingsShowing}
      areSettingsShowing={props.areSettingsShowing}
    >
      <MessageInput newMessage={props.newMessage} currentChatRoomName={props.currentChatRoomName} showHideCustomAlert={props.showHideCustomAlert} />
    </UserMessages>
  );

  /** sets body to account settings if user has opened the settings. */
  const showSettingsMenu = () => {
    if (props.areSettingsShowing) {
      body = (
        <AccountSettings
          authUID={props.authUID}
          setAreSettingsShowing={props.setAreSettingsShowing}
          authUsername={props.authUsername}
          showHideCustomAlert={props.showHideCustomAlert}
        />
      );
    }
  };

  showSettingsMenu();
  return (
    <>
      {body}
    </>
  );
};

export default MainContent;
