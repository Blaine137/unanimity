import React, { Component } from 'react';
import User from '../User/User';
import styles from './Users.module.css';

class Users extends Component{

        
        render(){

            let users = [];
            if( this.props.chatRooms ) {
                    //conver object to multi demnision array
                    let chatRooms = Object.entries( this.props.chatRooms ); 
                    let i = 0;
                    chatRooms.forEach( (chatRoom) => {   
                        i++;
                        //send the user id for the chatroom that is the recipent of the message(who were sending too)
                        //chatroom[1] is that that it enters into the array created by the entries.
                        //Db structure is that the first value [0] in the userID chatroom is the sender and the second [1] is the reciver
                        //chatRoom[0] is the name of the current chatroom in the loop
                        users[i] =  <User userDisplay = { this.props.userDisplay }  userID = { chatRoom[1].userID[1] }  key={i} selectCurrentChatroom = { this.props.selectCurrentChatroom } currentChatRoom = { chatRoom[0] } />;
                      
                    }); 

            }
       
            return (

                <div className = { styles.usersContainer } >
                    
                { users }

                </div>

            );

        }


}; 

export default Users;