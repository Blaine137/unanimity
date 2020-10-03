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
   
    shouldComponentUpdate(nextProps, nextState) {
        if( nextProps.usersChatRoomsID.length !== this.props.usersChatRoomsID.length ) {  
            //if it has changed the resetTheSideBarDisplay
            this.resetSidebarDisplay( );
            return true;
        }      
        else if(nextState !== this.state || nextProps !== this.props) {
            //normal render
            return true;
        }     
        else {
            //don't re-render if nothing has changed
            return false;
        }
    }

    resetSidebarDisplay = () => {
        /*
            causes the component to update and resets the sidebar. the reset is required so that when it loops through the
            chatRoomsArray.length and this.state.sidebarDisplay.length are both starting at 0. otherwise when the number of chatroom's
            changes it wont display them properly.
        */
        this.setState({ sidebarDisplay: [] });
        addedChatRoomsName = [];
    }

    showSidebar = () => {
        let sidebarInner =  (
            <Fragment>
                <div
                    onClick = { () => this.addChatRoomPopUp() } 
                    onKeyDown = { e => { 
                        if(e.key === 'Enter') { this.addChatRoomPopUp(); } 
                    } }
                    tabIndex="0" 
                    className={ styles.addContainer }
                    aria-label="Add a chatroom button"
                    role="button"   
                >
                    <div className={ styles.addButton }></div>
                </div>
                <div  
                    onClick = { () => this.props.toggleSidebar() }
                    onKeyDown = { e => { 
                        if(e.key === 'Enter') { this.props.toggleSidebar() }
                    } }
                    tabIndex="0"
                    className={ styles.burger }
                    aria-label="Close sidebar button." 
                    role="button" 
                >
                    <div className={ styles.closeTop }></div>
                    <div className={ styles.closeMiddle }></div>
                    <div className={ styles.closeBottom }></div>
                </div>
                <div className={ styles.usersContainer }>
                    { this.state.sidebarDisplay }
                </div>                          
            </Fragment>
        );
        let sidebar = null;
        if( this.props.showSidebar ) {
            //set css to show the sidebar
            sidebar = (
                <div 
                    className={ styles.sidebarContainer } 
                    style={ { transform: 'translateX( 0% )' } } 
                >  
                    { sidebarInner }
                </div>
            );
        }
        else {
            //set the css to hide the sidebar by moving it left 100%
            sidebar=(
                <div 
                    className={ styles.sidebarContainer } 
                    style={ { transform: 'translateX(-100%)' } } 
                >
                      { sidebarInner }      
                </div>
            );
        };
        return sidebar;
    };

        //executes on click of the add chatroom button, renders a form to type the chatroom name to add
    addChatRoomPopUp = () => {
        //show pop up form to add new chatroom
        this.setState({ addChatRoomPopUp:  
            <div className={ styles.popUpContainer }>                                  
                <form 
                    onSubmit={ e => {
                            this.props.addChatRoom( e , DOMPurify.sanitize(document.getElementById( 'newChatRoomName' ).value) ) 
                            //on submit of popup close the popup
                            this.setState( { addChatRoomPopUp: null } )
                    }}
                    className={ styles.form } 
                >               
                    <div 
                        tabIndex="0" 
                        aria-label="Close Add ChatRoom pop up button."   
                        className={ styles.closeBurger }
                        role="button"
                        onClick={ () => { this.setState( { addChatRoomPopUp: null } ); } } 
                        onKeyDown={ e => { if(e.key === 'Enter') { this.setState({ addChatRoomPopUp: null }); } } }
                    >
                        <div className={ styles.closeTop } ></div>
                        <div className={ styles.closeBottom }></div>
                    </div>
                    <legend>Add a Chatroom.</legend>
                    <fieldset>
                        <label htmlFor="newChatRoomName">Recipient's Username</label>
                        <input 
                            type="text" 
                            id="newChatRoomName" 
                            name="newChatRoomName" 
                            className={styles.input}
                            placeholder="Press enter to submit!"
                        />
                        <input type="submit" value="Add Chatroom" className={ styles.submit}/>
                    </fieldset>
                </form>
            </div>
        });
    };

    /* adds a single chatroom to the sidebar. This is the jsx and styles for each recipient/chatroom */
    addChatRoomToSidebar = (recipientsName, chatRoomsArray, currentChatRoomID) => {
        let newDisplay=[...this.state.sidebarDisplay];
        newDisplay.push((
             <div key={ key } className={ styles.users }>
                <div 
                    tabIndex="0" 
                    className={ styles.deleteContainer } 
                    onClick={ () =>  this.props.deleteChatRoom(currentChatRoomID)  }
                    onKeyDown = { e => {
                        if(e.key === 'Enter') { this.props.deleteChatRoom(currentChatRoomID); }
                    }}
                    role="button"
                    aria-label="Delete Chatroom Button"
                >
                    <div className={ styles.deleteTop } ></div>
                    <div className={ styles.deleteBottom }></div>
                </div>
                <h3 
                    tabIndex="0"  
                    onClick={() => {
                        this.props.toggleSidebar(true); 
                        this.props.setCurrentChatRoomID( currentChatRoomID );  
                    }}
                    onKeyDown={ e => {
                        if(e.key === 'Enter') {                              
                            this.props.toggleSidebar(true); 
                            this.props.setCurrentChatRoomID(currentChatRoomID);  
                        }
                    } }
                > 
                    { recipientsName } 
                </h3>
            </div>
        ));
        key++;
        //prevents from  infinite loop
        if( chatRoomsArray.length > this.state.sidebarDisplay.length ) {       
            //if addedchatRoomsName does not have the new chatroom name then add it.(e.data is chatroom name their trying to add)
            if(!addedChatRoomsName.includes(recipientsName)) {
                addedChatRoomsName.push(recipientsName);
                this.setState({ sidebarDisplay: newDisplay });
            }
        }
    };
    
    //showAllChatRooms gets the recipients name and calls addChatRoomToSidebar().
    showAllChatRooms = () => {
        if(this.props.usersChatRoomsID) {
            // All the chat rooms ids that the current authenticated user is in. 
            let chatRoomIDs = { ...this.props.usersChatRoomsID }; 
            let chatRoomsArray = Object.entries(chatRoomIDs);
            //for each chatroom id get the chatroom information from the database
            chatRoomsArray.forEach((singleChatRoomID) => {              
                axios.get('chatRoomsUsers/cru' + singleChatRoomID[1] + '.json').then(                      
                    res  => {                   
                        if(res.data !== null) {   
                            //[1][1] navigates to userID in the response. [1][1] has the auth user id and recipients id. 
                            let chatRoomUsersArray = Object.entries(res.data)[1][1]; 
                            //For each of the users in the chatroom get that recipients username                                                                    
                            chatRoomUsersArray.forEach(chatRoomUserID => {  
                                if(chatRoomUserID !== this.props.userID) {                                 
                                    let currentChatRoomID = singleChatRoomID[1];                                 
                                    //axios get username for the current chatRoom user
                                    axios.get('users/u' + chatRoomUserID + '/userName.json').then(
                                        e  => {
                                            let recipientsName = e.data;
                                            this.addChatRoomToSidebar(recipientsName, chatRoomsArray, currentChatRoomID ); //the value of args is placed into jsx and added to the sidebar   
                                        }
                                    ).catch(error => { console.log(error) });
                                }                                                                                              
                            });
                        }                     
                    } 
                ).catch( 
                    error => console.log(error) 
                );              
            });
        }
    }

    render() {    
        this.showAllChatRooms();     
        return(
          <Fragment>
            { this.state.addChatRoomPopUp }
            { this.showSidebar() }                    
          </Fragment>       
        );
    }
}

export default Sidebar;