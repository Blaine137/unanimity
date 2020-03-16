import React, { Component, Fragment } from "react";
import styles from './Sidebar.module.scss';
import axios from '../../axios';

class Sidebar extends Component {

    state = {

        chatRoomName: [],
        addChatRoomPopUp: null

    }

    /*shouldComponentUpdate( nextProps, nextState ) {
        if(nextState.chatRoomName === this.state.chatRoomName && this.state.chatRoomName !== [] && this.props === nextProps) {

            return false;
        
        }   else {

            return true;

        }
    }*/
    popUp = ( ) => {
        
        //show pop up by setting addChatRoomPopUp to pop up
        this.setState( { addChatRoomPopUp:  
                                    <div className = { styles.popUpContainer } >

                                        <form onSubmit = { ( e ) => { this.props.addChatRoom( e , document.getElementById( 'newChatRoomName' ).value ) } } >

                                            <label htmlFor = "newChatRoomName"  >Recipent's Name</label>
                                            <input type = "text" id = "newChatRoomName" name = "newChatRoomName" ></input>

                                        </form>

                                    </div>
        } );//end of setState for addChatRoomPopUp

    }
    render( ){
    
        let sidebarDisplay = [ ];
        let chatRoomIDs = null;
        let i = 0;
        let sidebar = null;
        let chatRoomNameIndex = 0;
        

        //if usersChatRoomID is NOT null
        if( this.props.usersChatRoomsID ){
           
                    chatRoomIDs = {
                        ...this.props.usersChatRoomsID
                    }; // All the chat rooms that the current authenticated user is in.
                    let chatRoomsIDsArray = Object.entries(chatRoomIDs);
                    //for each chatRoomID as singleChatRoomID
                  
                    chatRoomsIDsArray.forEach( ( singleChatRoomID ) => {
                        
                        //get alls usersID that are in the singleChatRoomID
                        axios.get( 'chatRoomsUsers/cru' + singleChatRoomID[1] + '.json' ).then( 
                            ( res ) => {
                                
                                //if we have the data. do stuff with the data. if there is no data the .catch() wil handle it
                                if( res.data !== null ){
                                    
                                    let chatRoomUsersArray = Object.entries( res.data ); //converts the data into an array
                                    
                                    //[1][1] navigates to userID in the array.
                                    // for each userID as chatRoomUserID
                                     //console.log('chatRoomUsersArray[1][1]: ', chatRoomUsersArray)
                                    chatRoomUsersArray[ 1 ][ 1 ].forEach( ( chatRoomUserID ) => {
                                                                                                                            
                                        
                                        //gets the data for that current chatRoomUserID
                                        //if current chatRoomuserID === current userID logged in  
                                        if( chatRoomUserID !== this.props.userID ) {
                                            
                                            //axios get username for the current chatRoom user
                                            axios.get( 'users/u' + chatRoomUserID + '/userName.json' ).then(
                                                ( e ) => {
                                                         
                                               
                                                        let newChatRoomName = []; 
                                                        //gets chatRoomName from previouse runs though the for loop. if there is any
                                                        if(this.state.chatRoomName !== null){

                                                            newChatRoomName = [...this.state.chatRoomName];
                                                            
                                                        }
                                                       //adds the new/current chatroom name to the arrays
                                                        newChatRoomName[chatRoomNameIndex] = e.data;                                                   
                                                        //set chatRoomName to username of the recipent in the chatroom
                                                        //if there is more chatroom in the array
                                                        if( this.state.chatRoomName.length !== newChatRoomName.length ){

                                                            this.setState( { chatRoomName: newChatRoomName } );
                                                            chatRoomNameIndex++;
                                                            
                                                        }
                                                        //this.setState( { chatRoomName: newChatRoomName } );
                                                        
                                                        
                                                   
                                                                                                                                                                                    
                                            });//axios get username for the current chatRoom user

                                        }//if current chatRoomuserID === current userID logged in 
                                                                                                        
                                    } );// for each userID as chatRoomUserID

                                }//if not null
                                
                            } 
                        ).catch( 
                            ( error ) => {

                                console.log( error ) 

                            } 
                        );//get alls usersID that are in the singleChatRoomID
                        
                      
                        sidebarDisplay.push( ( <div onClick = { ( ) => { this.props.setCurrentChatRoomID( singleChatRoomID[ 1 ] ) } } key = { i }  className = { styles.users } >
                                                        <h3> { this.state.chatRoomName[ i ] } </h3>
                                        </div>)); 
                        i++;

                    }); //for each chatRoomID as singleChatRoomID                
        }

        /* check is menu button is clicked, show or hide the sidebar */
        //if sidebar is open
        if( this.props.showSidebar ) {
            
            //set css to show the sidebar
            sidebar = <div className = { styles.sidebarContainer } style = { { transform: 'translateX( 0% )' } } >

                        <div className = { styles.addContainer } onClick = { ( ) => { this.popUp( ) } } >

                            <div className = { styles.addButton } ></div>

                        </div>

                        { sidebarDisplay }

                    </div>;

        } 
        //this.props.showSideBar is false and user has closed the sidebar
        else {

            //set the css to hide the sidebar by moving it left 100%
            sidebar = <div className = { styles.sidebarContainer } style = { { transform: 'translateX(-100%)' } } >

                        <div className = { styles.addContainer } onClick = { () => { this.popUp( ) } } >

                            <div className = { styles.addButton } ></div>

                        </div>

                        { sidebarDisplay }

                    </div>;

        }
       
        
        return(

            <Fragment>

                { this.state.addChatRoomPopUp }
                { sidebar }
                
            </Fragment>
            

        );//return()

    }//render()
    
}
export default Sidebar;