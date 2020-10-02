import React, {useEffect} from 'react';
import Message from './Message/Message';
import styles from './Chatroom.module.scss';
//used for auto scroll to bottom of the messages
let prevHeight;

const Chatroom = props => {
    //auto scrolls down the div. dose it on every reload of the component
    useEffect(() => {
        let handle = document.getElementById( 'scrolldown' );
        //if they are all the way at the top or all the way at the bottom auto scroll down.
        if( handle.scrollTop === 0 || (handle.offsetHeight + handle.scrollTop)  === prevHeight ) {  
            prevHeight = handle.scrollHeight;
            handle.scrollTop = handle.scrollHeight;
        } else {
            //keep up with the prev height so that if they scroll all the way down it will be recognized and trigger auto scroll
            prevHeight = handle.scrollHeight;
        }
    });
    
    //sets displayedMessages to an array of Message components where the index are the order the messages were sent.
    let setUserMessages = (userMessagesObject, username) => {
        let userMessagesArray = [];
        //converts from a object to an array. Where the array indexes are userMessagesObject[0] and the value is userMessagesObject[1]
        for(let [key, value] of Object.entries(userMessagesObject)) { userMessagesArray[key]=value; };
        //for every message add it to displayedMessages as a Message Component. keeping the same index
        userMessagesArray.forEach((msg, index) => {   
            if(msg !== null) { 
                displayedMessages[index]=(<Message  senderName={ username } currentMessage={ msg } key={ index } ></Message>);        
            }
        });
    }
    
    //get the username for all the users in the current chatroom and calls setUserMessages passing the userMessages and username
    let getUserName = () => {
         //if a chatroom has been selected
        if( props.currentChatRoom ){
            let chatRoomUsers = Object.entries( props.currentChatRoom ); 
            chatRoomUsers.forEach( ( chatRoomUser ) => {                                       
                //chatRoomUser[0] is the user id or nextmsgNum. if its a user show their messages
                if(chatRoomUser[0] !== "nextMsgNum") {      
                    let username = "nobody";
                    //the next user will either be the auth user or the recipient. check to see if its the auth user
                    if(chatRoomUser[ 0 ].substr(1) === props.authUID) {           
                        username = props.authUsername;
                    } else {
                        username = props.recipientName;
                    }
                    setUserMessages(chatRoomUser[1], username);
                }
            });   
        }
    }
    
    let displayedMessages=[<p className={ styles.introMsg } key="-10"> Please select a chatroom. </p>];
    getUserName();
    return(
        <div className={ styles.container } id='scrolldown'>
            { displayedMessages } 
        </div>
    );  
}

export default Chatroom;