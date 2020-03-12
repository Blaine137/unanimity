import React from 'react';
import Message from './Message/Message';
import styles from './Chatroom.module.css';
import axios from '../../../axios';

const chatroom = ( props ) => {
    let displayedMessages = [];
    let displayedMessagesArray = [];
    let currentMessageUsername = "nobody";
    let messages = null;
    let username = "nobody";

   //takes in current chatroom object of arrays and get uset by id function.
   let chatRoomUsers = Object.entries( props.currentChatRoom );
   
   chatRoomUsers.forEach( ( user ) => {

       //user[0] is property name such as u + userID or nextMsgNum
       //if it is the messages and not the message counter
        if( user[ 0 ] != "nextMsgNum" ) {
            //getuserID
            let userID = user[ 0 ];

            //getUsername by Id
            //userID includes u
            axios.get('users/' + userID + "/userName.json").then(
                ( e ) => {
                
                    username = e.data;
                   
                }
            )

            //foreach user looping through the messages
            user[ 1 ].forEach( ( msg, index) => {
            
                //if msg is not null set display message of that msg index to a message component 
                if( msg != null ) {

                displayedMessages[index] = ( <Message currentMessageUsername={username} currentMessage={ msg } ></Message> );

                }

            });//foreach looping though messages
        
        }//if it is the messages and not the message counter

   });//foreach user

    return(
        <div className = { styles.container } >
            { displayedMessages }
        </div>
    );
}
export default chatroom;