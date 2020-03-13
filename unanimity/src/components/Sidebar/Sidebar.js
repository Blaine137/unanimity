import React, { Component } from "react";
import styles from './Sidebar.module.css';
import axios from '../../axios';

class Sidebar extends Component {

    state = {

        chatRoomName: 'none'

    }
    
    render( ){

        let sidebarDisplay = [ ];
        let chatRoomIDs = null;
        let i = 0;
        let sidebar = null;
        
        if( this.props.usersChatRoomsID ){

                    chatRoomIDs = this.props.usersChatRoomsID; // All the chat rooms that the current authenticated user is in.
                    //console.log(chatRoomIDs)
                    //for each chatRoomID as singleChatRoomID
                    chatRoomIDs.forEach( ( singleChatRoomID ) => {
                                                         
                        //get alls usersID that are in the singleChatRoomID
                        axios.get( 'chatRoomsUsers/cru' + singleChatRoomID + '.json' ).then( ( res ) => {
                            
                            let chatRoomUsersArray = Object.entries( res.data ); //converts the data into an array
                           
                                //[1][1] navigates to userID in the array.
                                // for each userID as chatRoomUserID
                                chatRoomUsersArray[ 1 ][ 1 ].forEach( ( chatRoomUserID ) => {
                               
                                                                                                                                                                   
                                    //console.log(chatRoomUserID);
                                    //gets the data for that current chatRoomUserID
                                    //if current chatRoomuserID === current userID logged in  
                                    if( chatRoomUserID !== this.props.userID ) {

                                        //axios get username for the current chatRoom user
                                        axios.get( 'users/u' + chatRoomUserID + '/userName.json' ).then(
                                            ( e ) => {

                                                //this if prevents a infinite loop.
                                                if( this.state.chatRoomName !== e.data ){

                                                    //set chatRoomName to username of the recipent in the chatroom
                                                    this.setState( { chatRoomName: e.data} );
                                                    
                                                }//prevent infinateloop if
                                                                                                                                                                                
                                        });//axios get username for the current chatRoom user

                                    }//if current chatRoomuserID === current userID logged in 
                                                                                                    
                                });// for each userID as chatRoomUserID
                    
                        } ).catch( 
                            ( error ) => {

                                console.log( error ) 

                            } 
                        );//get alls usersID that are in the singleChatRoomID
                        i++;
                        sidebarDisplay.push( ( <div onClick={ ( ) => { this.props.setCurrentChatRoomID( singleChatRoomID ) } } key = { i }  className = { styles.users } >
                                                        <h3>{ this.state.chatRoomName }</h3>
                                        </div>)); 

                    }); //for each chatRoomID as singleChatRoomID                
        }

        /* check is menu button is clicked, show or hide the sidebar */
        //if sidebar is open
        if( this.props.showSidebar ) {
            
            //set css to show the sidebar
            sidebar = <div className = { styles.sidebarContainer } style = { {transform: 'translateX(0%)'} } >

                        { sidebarDisplay }

                    </div>;

        } 
        //this.props.showSideBar is false and user has closed the sidebar
        else {

            //set the css to hide the sidebar by moving it left 100%
            sidebar = <div className = { styles.sidebarContainer } style = { { transform: 'translateX(-100%)' } } >

                        { sidebarDisplay }

                    </div>;

        }

        return(

            <div>

                { sidebar }

            </div>

        );//return()

    }//render()
    
}
export default Sidebar;