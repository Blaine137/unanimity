import React, { Fragment } from 'react';
import Header from './Header/Header';
import ChatRoom from './Chatroom/Chatroom';
import Input from './Input/Input';


const mainContent = ( props ) => {
    
    return(

       <Fragment>

            <Header currentChatRoomName = { props.currentChatRoomName } toggleSidebar = { props.toggleSidebar } showSidebar = { props.showSidebar } />
            <ChatRoom currentChatRoom = { props.currentChatRoom } />
            <Input newMessage = { props.newMessage } currentChatRoomName = { props.currentChatRoomName }/> 
            
       </Fragment>

    );
}
export default mainContent;