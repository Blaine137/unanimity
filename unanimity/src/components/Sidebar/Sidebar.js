import React, { Fragment } from "react";


const sidebar = (props) => {
    let sql = null;
    let chatRoomUsers = null;
    let chatRoomName = null;
    let sidebarDisplay = null;
/*
   if(props.usersChatRoomsID ){
        props.usersChatRoomsID.foreach((singleChatRoomID) => {
            
            sql = "SELECT * FROM chatRoomsUsers WHERE chatRoomID = " +  singleChatRoomID;
            //chatRoomUsers = mysql request
            //chatRoomUsers turn comma deleminated string into arryay using split()
            //delete this.props.userID from chatRoomUsers
            //chatRoomName = this.props.getUsernameByID( chatRoomUsers );
            sidebarDisplay = (<div onClick={ ( ) => { props.setCurrentChatRoomID( singleChatRoomID ) } } >
                                            <h3>{chatRoomName}</h3>
                            </div>);

        });
   }
*/

    return(
        <Fragment>
            {sidebarDisplay}
        </Fragment>
    );
}
export default sidebar;