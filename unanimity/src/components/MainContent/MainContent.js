import React, { Fragment } from 'react';
import Header from './Header/Header';
import ChatRoom from './Chatroom/Chatroom';
import Input from './Input/Input';
const mainContent = (props) => {
    return(
       <Fragment>
            <Header currentChatRoomName={ props.currentChatRoomName } />
            <ChatRoom currentChatRoom={ props.currentChatRoom } getUsernameByID={ props.getUsernameByID } />
            <Input newMessage={ props.newMessage } /> 
       </Fragment>
    );
}
export default mainContent;