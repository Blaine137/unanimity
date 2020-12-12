import React, {useState, Fragment } from 'react';
import Header from './Header/Header';
import ChatRoom from './Chatroom/Chatroom';
import AccountSettings from './AccountSettings/AccountSettings';
import Input from './Input/Input';

const MainContent = props => {
    const [showSettings, setShowSettings] = useState(false);

    const showSettingsMenu = () => {
        if(showSettings) {
            return <AccountSettings 
                        setShowSettings={setShowSettings} 
                        authUID={ props.authUID } 
                        showSettings={showSettings} 
                        authUsername={props.authUsername}
                        setShowNotification={ props.showAlert }
                        
                    />;
        }
    }

    let body;
    let input;
    if(showSettings){
        body = showSettingsMenu();
        input = null;
    }else{
        body = <ChatRoom 
                currentChatRoom={ props.currentChatRoom } 
                recipientName={ props.currentChatRoomName } 
                authUsername={ props.authUsername} 
                authUID={ props.authUID }/>;

        input = <Input newMessage={ props.newMessage } currentChatRoomName={ props.currentChatRoomName } showAlert={ props.showAlert }/>;
    }

    return(
       <Fragment>
            <Header 
                    currentChatRoomName={ props.currentChatRoomName }
                    toggleSidebar={ props.toggleSidebar }
                    showSidebar={ props.showSidebar }
                    logout={ props.setAuth }
                    authUID={ props.authUID }
                    authUsername={ props.authUsername }
                    setShowSettings={setShowSettings}
                    showSettings={showSettings}/>
            {body}
            {input}
       </Fragment>
    );
};

export default MainContent;