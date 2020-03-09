import React from 'react';
import Message from '../Message/Message';
import styles from './Messages.module.css';

const messages = ( props ) => {
    let messages = null;
    if(props.userMessages){
        //convert object to array for looping
        let chatRooms = Object.entries( props.userMessages ); 
        
        chatRooms.forEach( (chatRoom) => {  
               
            if(chatRoom[0] === props.currentChatRoom){
                //messages equals messages for the selected(active) chatroom
                 messages = chatRoom[1];
            }
        
        }); 
    }
   

    return(

        <div className = { styles.messagesContainer } >
            
            <Message userMessages = { messages }  />
           
        </div>

    );


};

export default messages;