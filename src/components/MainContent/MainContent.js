import React, {useState, Fragment } from 'react';
import ChatroomHeader from './ChatroomHeader/ChatroomHeader';
import UserMessages from './UserMessages/UserMessages';
import AccountSettings from './AccountSettings/AccountSettings';
import MessageInput from './MessageInput/MessageInput';

/*
Parent component for Header, ChatRoom, Input, and AccountSettings.
*/
const MainContent = props => {
    const [areSettingsShowing, setAreSettingsShowing,] = useState(false);
    //default to the chatroom
    let body = <UserMessages 
                    currentChatRoom={ props.currentChatRoom } 
                    recipientName={ props.currentChatRoomName } 
                    authUsername={ props.authUsername} 
                    authUID={ props.authUID }
                />;
    let newMessageInput = <MessageInput newMessage={ props.newMessage } currentChatRoomName={ props.currentChatRoomName } showHideCustomAlert={ props.showHideCustomAlert }/>;

    //sets body to account settings if user has opened the settings and sets input to null.
    const showSettingsMenu = () => {
        if(areSettingsShowing) {
            body = <AccountSettings 
                        authUID={ props.authUID } 
                        setAreSettingsShowing={setAreSettingsShowing} 
                        authUsername={props.authUsername}
                        showHideCustomAlert={ props.showHideCustomAlert }                     
                    />;
                    newMessageInput = null;
        }
    }

    showSettingsMenu();
    return(
       <Fragment>
            <ChatroomHeader 
                currentChatRoomName={ props.currentChatRoomName }
                toggleSidebar={ props.toggleSidebar }
                isSidebarOpen={ props.isSidebarOpen }
                intentionalAndForcedUserLogout={ props.intentionalAndForcedUserLogout }
                authUID={ props.authUID }
                authUsername={ props.authUsername }
                setAreSettingsShowing={setAreSettingsShowing}
                areSettingsShowing={areSettingsShowing}
            />
            {body}
            {newMessageInput}
       </Fragment>
    );
};

export default MainContent;