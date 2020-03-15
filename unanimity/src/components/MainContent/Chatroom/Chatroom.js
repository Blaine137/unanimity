import React from 'react';
import Message from './Message/Message';
import styles from './Chatroom.module.scss';

const Chatroom = ( props ) => {
  
    let displayedMessages = [ "Please select a chatroom." ];

   if(props.currentChatRoom){
       //takes in current chatroom object of arrays and get uset by id function.
        let chatRoomUsers = Object.entries( props.currentChatRoom );
            
        chatRoomUsers.forEach( ( nextuser ) => {
                                                        
            //foreach user looping through the messages
            if( nextuser[ 0 ] !== "nextMsgNum" ) {

                let nextUser = Object.values(nextuser[ 1 ]);
                nextUser.forEach( ( msg, index) => {
                
                    //if msg is not null set display message of that msg index to a message component 
                    if( msg !== null ) { 

                        displayedMessages[ index ] = ( <Message  currentMessage = { msg } key = { index } ></Message> );
                        
                    }

                }); //foreach looping though messages

            } //end if props.currentChatroom

        }); //end of chatRoomUsers forEach

   }
    return(

        <div className = { styles.container } >
            { displayedMessages }
        </div>

    );
    
}
export default Chatroom;