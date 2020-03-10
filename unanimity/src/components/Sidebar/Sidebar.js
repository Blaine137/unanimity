import React from "react";
import styles from './Sidebar.module.css';
import axios from '../../axios';

const sidebar = (props) => {
    let sql = null;
    let chatRoomUsers = null;
    let chatRoomName = null;
    let sidebarDisplay = null;
    let chatRoomIDs = null;

   if( props.usersChatRoomsID ){

        chatRoomIDs = props.usersChatRoomsID;
        
        chatRoomIDs.forEach((singleChatRoomID) => {
            
            
            console.log(singleChatRoomID)
            
            //sql = "SELECT * FROM chatRoomsUsers WHERE chatRoomID = " +  singleChatRoomID;
             axios.get('chatRoomsUsers/cru' + singleChatRoomID + '.json').then((res) => {
                
                let chatRoomUsersArray = Object.entries(res.data);
                chatRoomUsersArray.forEach((chatRoomuser) => {
                    //left off trying to get the users in each chatRoom B.Y. 03/09/2020 11:57PM
                });
        
            }).catch((error) => {console.log(error)});
            
            //chatRoomUsers turn comma deleminated string into arryay using split()
            //delete this.props.userID from chatRoomUsers 
            chatRoomName = props.getUsernameByID( chatRoomUsers );
            sidebarDisplay = (<div onClick={ ( ) => { props.setCurrentChatRoomID( singleChatRoomID ) } } >
                                            <h3>{chatRoomName}</h3>
                            </div>); 

        });
   }


    return(
        
            <div className={styles.sidebarContainer}>
                {sidebarDisplay}
            </div>
        
    );
}
export default sidebar;