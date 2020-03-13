import React, { Component } from "react";
import styles from './Sidebar.module.css';
import axios from '../../axios';

class Sidebar extends Component {

    state = {
        chatRoomName: 'none'
    }
    
  
    render( ){

        let sql = null;
        let chatRoomUsers = null;
        let chatRoomName = null;
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
                           
                                //[1][1] navigates to userID in the array. for each userID as chatRoomUserID
                              
                                chatRoomUsersArray[ 1 ][ 1 ].forEach( ( chatRoomUserID ) => {
                               
                                    //if current chatRoomuserID == current userID logged in                                                                                                                                 
                                        //console.log(chatRoomUserID);
                                        //gets the data for that current chatRoomUserID
                                        if( chatRoomUserID != this.props.userID ) {
                                     axios.get( 'users/u' + chatRoomUserID + '/userName.json' ).then(
                                        ( e ) => {
                                                    //this if prevents a infinite loop.
                                            if( this.state.chatRoomName != e.data ){

                                                //remove our userId chatRoomUserID

                                                this.setState( { chatRoomName: e.data} );
                                                
                                            } 
                                                                                                                                                                              
                                        }
                            
                                    );

                                }
                                                                                                    
                            });
                    
                        } ).catch( ( error ) => { console.log( error ) } );
                        i++;
                        sidebarDisplay.push( ( <div onClick={ ( ) => { this.props.setCurrentChatRoomID( singleChatRoomID ) } } key={i} className={styles.users}>
                                                        <h3>{ this.state.chatRoomName }</h3>
                                        </div>)); 

                    });                  
        }

        /* check is menu button is clicked, show or hide the sidebar */
        if(this.props.showSidebar){

        sidebar = <div className={ styles.sidebarContainer } style={ {transform: 'translateX(0)'} }>

                { sidebarDisplay }

            </div>;

        }else{

            sidebar = <div className={ styles.sidebarContainer } style={ {transform: 'translateX(-100%)'} }>

            { sidebarDisplay }

            </div>;

        }

        return(
        <div>
            {sidebar}
            </div>
        );

    }
    
}
export default Sidebar;