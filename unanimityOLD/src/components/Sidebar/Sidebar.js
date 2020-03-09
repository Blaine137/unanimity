import React, { Component } from 'react';
import styles from './Sidebar.module.css';
import Users from '../Users/Users';

class Sidebar extends Component {

    
    


    render ( ) {


        return (

            <div className = { styles.sidebarContainer }  >

                 { /* Need to list avabile chatrooms and onclick call props function to set as active chatroom */ }
                <p>this is located in the sidebar component</p>
                
                <Users userDisplay = "userList"  chatRooms = {this.props.chatRooms} selectCurrentChatroom = { this.props.selectCurrentChatroom }/>

            </div>

        );


    }

}

export default Sidebar;
