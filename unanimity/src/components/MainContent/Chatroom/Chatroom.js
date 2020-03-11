import React from 'react';
import Message from './Message/Message';
const chatroom = ( props ) => {
    let displayedMessages = [];
    let displayedMessagesArray = [];
    let currentMessageUsername = "nobody";
    let messages = null;
   //takes in current chatroom object of arrays and get uset by id function.
   let chatRoom = props.currentChatRoom;
   console.log(chatRoom)
   //display messages should be an array of message objects.
   //for each message in the chatRoom object call message componet and send message componet props of props.currentMessageUsername props.currentMessage
   //use getUsernamebyID to get name. the array in chatRoom obect r abrevuated by u and followed by userID
    return(
        <div>
            {displayedMessages}
        </div>
    );
}
export default chatroom;