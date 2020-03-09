import React, { Fragment } from 'react';
import Message from './Message/Message';
const chatroom = ( props ) => {
    let displayedMessages = [];
    let currentMessageUsername = "nobody";
   //takes in current chatroom object of arrays and get uset by id function.
   //display messages should be an array of message objects.
   //for each message in the chatRoom object call message componet and send message componet props of props.currentMessageUsername props.currentMessage
   //use getUsernamebyID to get name. the array in chatRoom obect r abrevuated by u and followed by userID
    return(
        <Fragment>
            {displayedMessages}
        </Fragment>
    );
}
export default chatroom;