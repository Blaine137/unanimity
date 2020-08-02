import React, { Component, Fragment } from "react";
import styles from './Sidebar.module.scss';
import axios from '../../axios';
import DOMPurify from 'dompurify';
//set at this scope so that no two keys would equal the same value
let key = 0;
let addedChatRoomsName = [];

class Sidebar extends Component {

    state = {

        addChatRoomPopUp: null,
        sidebarDisplay: [ ]
        
    }
   
    shouldComponentUpdate( nextProps, nextState ){

        //see if the prop uesrCHatRoomsID has changed
        if ( nextProps.usersChatRoomsID.length !== this.props.usersChatRoomsID.length ) {
            
            //if it has changed the resetTheSideBarDisplay
            this.resetSidebarDisplay( );
            return true;

        }
        //noraml render
        else if( nextState !== this.state || nextProps !== this.props ) {

            return true;

        } 
        //normal dont rerender if nothing has changed
        else {

            return false;

        }

    }

    resetSidebarDisplay = ( ) => {
  
        /*
            causes the component to update and resets the sidebar. the resest is required so that when it loops through the
            chatRoomsArray.length and this.state.sidebarDisplay.length are both starting at 0. 
        */
        this.setState( { sidebarDisplay: [ ] } );
        addedChatRoomsName = [ ];

    }

    showSidebar = () => {

        let sidebarInner =  (

            <Fragment>

                {/* Start Add Chatroom button */}
                <div

                    onClick = { 
                        ( ) => { 
                            this.popUp( ) 
                        } 
                    }//onClick 

                    onKeyDown = { 
                        ( e ) => { 
                            if ( e.key === 'Enter') { 
                                this.popUp( ); 
                            } 
                        } 
                    }//onKeyDown

                    tabIndex="0" 
                    className = { styles.addContainer }
                    aria-label = "Add a chatroom button"
                    role = "button" 
                    
                >

                    <div className = { styles.addButton } > </div>

                </div>
                {/* End of Add Chatroom button */}

                {/* Start Close Sidebar button */}
                <div  

                    onClick = { 
                        ( ) => {
                            this.props.toggleSidebar( ) 
                        } 
                    }//onClick

                    onKeyDown = { 
                        ( e ) => { 
                            if ( e.key === 'Enter' ) {
                                this.props.toggleSidebar( )   
                            }
                        } 
                    }//onKeyDown

                    tabIndex="0"
                    className = { styles.burger }
                    aria-label = "Close sidebar button." 
                    role = "button" 

                >

                    <div className = { styles.closeTop } > </div>
                    <div className = { styles.closeMiddle } > </div>
                    <div className = { styles.closeBottom } > </div>

                </div>
                {/* End of Close Sidebar button */}

                {/* auth users chatrooms */}
                <div className = { styles.usersContainer } >

                    { this.state.sidebarDisplay }

                </div> 
                            
            </Fragment>

        );//let sidebarInner


        let sidebar = null;
        //if sidebar is open
        if( this.props.showSidebar ) {
            
            //set css to show the sidebar
            sidebar = (

                <div 

                    className = { styles.sidebarContainer } 
                    style = { { transform: 'translateX( 0% )' } } 

                >
                    
                    { sidebarInner }

                </div>

            );//sidebar

        } 
        //this.props.showSideBar is false and user has closed the sidebar
        else {

            //set the css to hide the sidebar by moving it left 100%
            sidebar = (

                <div 

                    className = { styles.sidebarContainer } 
                    style = { { transform: 'translateX(-100%)' } } 

                >

                      { sidebarInner }      

                </div>

            );//sidebar

        }//if(this.props.showSidebar)

        return sidebar;

    }//showSidebar function

    popUp = ( ) => {

        //show pop up by setting addChatRoomPopUp to pop up
        this.setState( { addChatRoomPopUp:  
                                    <div className = { styles.popUpContainer } >

                                      

                                        <form onSubmit = {
                                             ( e ) => {

                                                    //calls function that adds chatroom
                                                    this.props.addChatRoom( e , DOMPurify.sanitize(document.getElementById( 'newChatRoomName' ).value) ) 

                                                    //on submit of popup close the popup
                                                    this.setState( { addChatRoomPopUp: null } )

                                                }
                                            }//end of onSubmitt

                                            className = { styles.form } >

                                            
                                            <div tabIndex = " 0 " aria-label = "Close Add ChatRoom pop up button."   className = { styles.closeBurger }
                                                role = "button"
                                                onClick = { ( ) => { this.setState( { addChatRoomPopUp: null } ); } } 
                                                onKeyDown = { ( e ) => { if ( e.key === 'Enter' ) { this.setState( { addChatRoomPopUp: null } );  } } }

                                            >

                                                <div className = { styles.closeTop } ></div>
                                                <div className = { styles.closeBottom } ></div>

                                            </div>

                                            <legend>Add a Chatroom.</legend>

                                            <fieldset>

                                                <label htmlFor = "newChatRoomName">Recipient's Username</label>
                                                <input type = "text" id = "newChatRoomName" 
                                                        name = "newChatRoomName" 
                                                        className={styles.input}
                                                        placeholder="Press enter to submit!"></input>

                                               <input type = "submit" value = "Add Chatroom" className = { styles.submit}></input>

                                            </fieldset>

                                        </form>

                                    </div>
        } );//end of setState for addChatRoomPopUp

    }

    /* adds a single chatroom to the existing chatrooms */
    addChatRoomToSidebar = ( data, chatRoomsArray, currentChatRoomID ) => {

        let newDisplay = [ ...this.state.sidebarDisplay ];

        newDisplay.push( (

             <div                                                        
                key = { key } 
                className = { styles.users } 
              >

                <div tabIndex = "0" className = { styles.deleteContainer } 

                    onClick = { 
                        ( ) => { 

                            this.props.deleteChatRoom( currentChatRoomID );

                        }//anonymous function 
                    }//onclick
                    onKeyDown = {
                        ( e ) => {
                            if( e.key === 'Enter' ){

                                this.props.deleteChatRoom( currentChatRoomID );

                            }
                        }
                    }//onkeydown
                    role = "button"
                    aria-label = "Delete Chatroom Button"
                >

                    <div className = { styles.deleteTop } ></div>
                    <div className = { styles.deleteBottom } ></div>

                </div>

                <h3 tabIndex =  "0"  

                    onClick = { ( ) => {

                            this.props.toggleSidebar(true); 
                            this.props.setCurrentChatRoomID( currentChatRoomID );  

                        } }//onClick
                    onKeyDown = {
                        ( e ) => {
                            if ( e.key === 'Enter' ) {
                               
                                this.props.toggleSidebar(true); 
                                this.props.setCurrentChatRoomID( currentChatRoomID );  

                            }
                        }
                    }//onKeyDown
                > 
                    { data } 
                </h3>

            </div>

        ) );//newDisplay .push()

        key++;
        
        //prevents from  infinite loop
        if( chatRoomsArray.length > this.state.sidebarDisplay.length ) {       
            
            //if addedchatRoomsName dose not have the new chatroom name then add it.(e.data is chatroom name their trying to add)
            if( !addedChatRoomsName.includes( data ) ){

                addedChatRoomsName.push( data ) ;
                this.setState( { sidebarDisplay: newDisplay } );

            }
            
        }//if prevents from  infante loop 

    };//addChatRoomToSidebar
    
    showAllChatRooms = () => {

        //chatRoomIDs is the id of the chatroom that the user is apart of
        let chatRoomIDs = null;

        //if usersChatRoomID is NOT null
            if( this.props.usersChatRoomsID ){

                chatRoomIDs = {
                    ...this.props.usersChatRoomsID
                }; // All the chat rooms that the current authenticated user is in. 

                let chatRoomsArray = Object.entries(chatRoomIDs);
                
                //for each chatRoomID as singleChatRoomID
                chatRoomsArray.forEach( ( singleChatRoomID ) => {
                    
                    //get alls usersID that are in the singleChatRoomID
                    axios.get( 'chatRoomsUsers/cru' + singleChatRoomID[ 1 ] + '.json' ).then( 
                        
                        ( res ) => {
                            
                            //if we have the data. do stuff with the data. if there is no data the .catch() wil handle it
                            if( res.data !== null ){
                                
                                let chatRoomUsersArray = Object.entries( res.data ); //converts the data into an array
                                
                                //[1][1] navigates to userID in the array.
                                // for each userID as chatRoomUserID                          
                                chatRoomUsersArray[ 1 ][ 1 ].forEach( ( chatRoomUserID ) => {
                                                                                                                        
                                    
                                    //gets the data for that current chatRoomUserID
                                    //if current chatRoomuserID === current userID logged in  
                                    if( chatRoomUserID !== this.props.userID ) {
                                        
                                        let currentChatRoomID = singleChatRoomID[1];
                                        
                                        //axios get username for the current chatRoom user
                                        axios.get( 'users/u' + chatRoomUserID + '/userName.json' ).then(
                                            ( e ) => {

                                                this.addChatRoomToSidebar(e.data, chatRoomsArray, currentChatRoomID );
                                                                                                                                
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
                    
                }); //for each chatRoomID as singleChatRoomID  

            } //end if this.props.usersChatRoomsID is not null
        
    }//showAllChatRooms Function

    render ( ) {

     
        this.showAllChatRooms();
        
        return (

          <Fragment>

            { this.state.addChatRoomPopUp }

            { this.showSidebar() }
                             
          </Fragment>
            

        );//return()

    }//render()
    
}//Sidebar class

export default Sidebar;