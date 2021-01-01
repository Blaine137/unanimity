import React, { useEffect } from 'react';
import Message from './Message/Message';
import styles from './UserMessages.module.scss';
let prevScrollPosition;

/*
Parent container component that handles logic for displaying messages in order with the senders name.
Dose not handle logic for Emojis. The Message component calls a component that handles Emojis.
This component passes the senders name and message to the Message component for styling. Then displays them.
*/
const UserMessages = props => {
    //auto scrolls down the div. dose it on every reload of the component
    useEffect(() => {
        let messengerMainContainer = document.getElementById( 'scrolldown' );
        //if they are all the way at the top or all the way at the bottom auto scroll down.
        if( messengerMainContainer.scrollTop === 0 || (messengerMainContainer.offsetHeight + messengerMainContainer.scrollTop) === prevScrollPosition ) {  
            prevScrollPosition = messengerMainContainer.scrollHeight;
            messengerMainContainer.scrollTop = messengerMainContainer.scrollHeight;
        } else {
            //keep up with the prev height so that if they scroll all the way down it will be recognized and trigger auto scroll
            prevScrollPosition = messengerMainContainer.scrollHeight;
        }
    });
    
    //sets displayedMessages to an array of Message components where the index are the order the messages were sent.
    let orderMessagesForDisplay = (userMessagesObject, username) => {
        let userMessagesArray = [];
        //creates array where indexes are userMessagesObject[0](message sent number) and the value is userMessagesObject[1](the message itself)
        for(let [key, value] of Object.entries(userMessagesObject)) { userMessagesArray[key]=value; };
        let isMessageSender = false;
        if(username === props.authUsername) {
            isMessageSender = true;
        }
        userMessagesArray.forEach((message, index) => {   
            if(message !== null) { 
                displayedMessages[index] = (<Message isMessageSender={ isMessageSender } senderName={ username } currentMessage={ message } key={ index }></Message>);        
            }
        });
    }
    
    //get the username for all the users in the current chatroom and calls orderMessagesForDisplay passing the userMessages and username
    let getUserNamesForMessages = () => {
        //if a chatroom has been selected
        if(props.currentChatRoom) {
            let chatRoomUsersAndMessages = Object.entries(props.currentChatRoom); 
            chatRoomUsersAndMessages.forEach((UsernameAndMessages) => {                                       
                //chatRoomUser[0] is the user id or nextmsgNum. if its a user show their messages
                if(UsernameAndMessages[0] !== "nextMsgNum") {      
                    let username = "nobody";
                    //the next user will either be the auth user or the recipient. check to see if its the auth user
                    if(UsernameAndMessages[0].substr(1) === props.authUID) {           
                        username = props.authUsername;
                    } else {
                        username = props.recipientName;
                    }
                    let UserMessagesObject = UsernameAndMessages[1];
                    orderMessagesForDisplay(UserMessagesObject, username);
                }
            });   
        }
    }
    
    let displayedMessages=[<p key="-10">Please select a chatroom.</p>];
    getUserNamesForMessages();
    return(
        <div className={ styles.container } id='scrolldown'>
            { displayedMessages } 
        </div>
    );  
}

export default UserMessages;