import React, { Component } from 'react';
import Line from '../Line/Line';
import styles from './Message.module.css';

class Message extends Component {

    render( ) {
        let i = 0;
        let displayedMessages = "Please select a chat Room.";
        let currentMessage = [];
        let orderedCombinedMessagesObject = {};
        let orderedCombinedMessagesArray = [];
        if( this.props.userMessages ) {

          
                //copy the object so that we can manipulate data without changing orignial value
            let messagesNoIDCopy = Object.assign( {}, this.props.userMessages );

                //delete id so we only have the messages
            delete messagesNoIDCopy.userID;

                //convert to array for looping
            let messagesArrayNoIDCopy = Object.entries( messagesNoIDCopy );

            
                //loop though all messages and display them with appropiate information
            messagesArrayNoIDCopy.forEach( ( user ) => {
                
                    //user[1] (messages) convert to a object.
                currentMessage.push( Object.assign( {}, user[ 1 ] ) );

                    //loop through object properties 
                currentMessage.forEach( ( msgs ) => {
              
                    Object.entries( msgs ).forEach( ( singleMessage ) => {
                           
                            //delete keys and value where value is null
                        if( singleMessage[ 1 ] === null ){

                            delete msgs[ singleMessage[ 0 ] ];

                        }

                       });                
                });

                    //assign user information with messages
                    //for each users (send and reciver)
                currentMessage.forEach((messageObject) => {

                        //loop though that useres messages
                     Object.entries( messageObject ).forEach( ( singleMessage ) => {

                            //for each message set it equal to line component
                            //replace the message in current message with component
                            //singleMessage [ 0 ] is the key/array position in messgeObject
                            //SingleMessage[ 1 ] is the message
                        messageObject[ singleMessage[ 0 ] ] = <Line  userID={ user[ 0 ] } message={ singleMessage[ 1 ] } key={i} > </Line>;
                        i++;
                        
                    });
                    
                });
                
                //combine two objects 
                currentMessage.forEach((messageObject) => {
                    
                    orderedCombinedMessagesObject = {...messageObject, ...orderedCombinedMessagesObject};
                    
                });
                  
                orderedCombinedMessagesArray = Object.values(orderedCombinedMessagesObject);

                displayedMessages = orderedCombinedMessagesArray;
            });
        } 
        
        return(

            <div className = "messageContainer" >

                {displayedMessages}

            </div>

        );

    }

}

export default Message;