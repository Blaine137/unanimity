import React, { Component, Fragment } from "react";
import styles from './SidebarOfConversations.module.scss';
import axios from '../../axios';
import AddChatRoomPopUp from './addChatRoom/addChatRoom';
//set at this scope so that no two keys would equal the same value
let key = 0;
let addedChatRoomsName = [];

/*
handles opening and closing the sidebar and showing/hiding the add chatroom pop up.
Has the logic to get the authenticated user's chatroom's and display them inside of sidebar.
*/
class SidebarOfConversations extends Component {
    state = {
        isAddChatRoomPopUpShowing: false,
        listOfConversationsToOpenOrDelete: []    
    }
   
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.usersChatRoomsID.length !== this.props.usersChatRoomsID.length) {  
            //if chatRooms/conversations have been added or deleted resetTheSideBarDisplay
            this.resetSidebarDisplay();
            return true;
        } else if(nextState !== this.state || nextProps !== this.props) {
            //normal render
            return true;
        } else {
            //don't re-render if nothing has changed
            return false;
        }
    }
     /*
    causes the component to update and resets the sidebar. the reset is required so that when it loops through the
    chatRoomsArray.length and this.state.listOfConversationsToOpenOrDelete.length are both starting at 0. otherwise when the number of chatroom's
    changes(deleted or added) it wont display them properly.
    */
    resetSidebarDisplay = () => {
        this.setState({ listOfConversationsToOpenOrDelete: [] });
        addedChatRoomsName = [];
    }

    /* adds a single chatroom to the sidebar. This is the jsx and styles for each recipient/chatroom */
    addChatRoomToSidebar = (recipientsName, chatRoomsArray, currentChatRoomID) => {
        let newDisplay=[...this.state.listOfConversationsToOpenOrDelete];
        newDisplay.push((
             <div aria-label={`options for chatroom ${recipientsName}`} role="menuitem" key={ key } className={ styles.users }>
                <div 
                    tabIndex="0" 
                    className={ styles.deleteContainer } 
                    onClick={ () =>  this.props.deleteChatRoom(currentChatRoomID)  }
                    onKeyDown={ e => {
                        if(e.key === 'Enter') { this.props.deleteChatRoom(currentChatRoomID); }
                    }}
                    role="button"
                    aria-label={`Delete Chatroom Button for ${recipientsName}`}
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
                    role="button"
                    aria-label={`click here to open the chatroom with ${recipientsName}`}
                > 
                    { recipientsName } 
                </h3>
            </div>
        ));
        key++;
        //prevents from  infinite loop
        if(chatRoomsArray.length > this.state.listOfConversationsToOpenOrDelete.length) {       
            //if addedchatRoomsName does not have the new chatroom name then add it.(e.data is chatroom name their trying to add)
            if(!addedChatRoomsName.includes(recipientsName)) {
                addedChatRoomsName.push(recipientsName);
                this.setState({ listOfConversationsToOpenOrDelete: newDisplay });
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
            chatRoomsArray.forEach( async (singleChatRoomID) => {   
                try {
                    let chatroomData = await axios.get('chatRoomsUsers/cru' + singleChatRoomID[1] + '.json');
                    if(chatroomData.data !== null) {
                        let currentChatRoomID = singleChatRoomID[1]; 
                        //[1][1] navigates to userID in the response. [1][1] has the auth user id and recipients id. 
                        let chatRoomUsersArray = Object.entries(chatroomData.data)[1][1]; 
                        //For each of the users in the chatroom get that recipients username                                                                    
                        chatRoomUsersArray.forEach( async chatRoomUserID => {  
                            if(chatRoomUserID !== this.props.userID) {                                                          
                                //axios get username for the current chatRoom user
                                let recipientsName = await axios.get('users/u' + chatRoomUserID + '/userName.json');
                                recipientsName = recipientsName.data;
                                //takes the data and puts it into jsx for display
                                this.addChatRoomToSidebar(recipientsName, chatRoomsArray, currentChatRoomID);                              
                            }                                                                                              
                        });                      
                    }  
                } catch(error) {
                    return 300;
                }                               
            });
        }
    }

    toggleIsAddChatRoomPopUpShowing = () => {
        this.setState({ isAddChatRoomPopUpShowing: !this.state.isAddChatRoomPopUpShowing });
    }

    showPopUp = () => {
        if(this.state.isAddChatRoomPopUpShowing) {
            return <AddChatRoomPopUp togglePopUp={ this.toggleIsAddChatRoomPopUpShowing } addChatRoom={ this.props.addChatRoom }/>;
        }
        return null;
    }
    
    render() {    
        this.showAllChatRooms();     
        return(
            <Fragment>
                { this.showPopUp() }
                <aside 
                    className={ styles.sidebarContainer } 
                    style={ { transform: `translateX( ${this.props.isSidebarOpen ? '0%' : '-100%'} )` } } 
                >  
                    <div
                        onClick = { () => this.setState({ isAddChatRoomPopUpShowing: !this.state.isAddChatRoomPopUpShowing }) } 
                        onKeyDown = { e => { 
                            if(e.key === 'Enter') { this.setState({ isAddChatRoomPopUpShowing: !this.state.isAddChatRoomPopUpShowing }) } 
                        } }
                        tabIndex="0" 
                        className={ styles.addContainer }
                        aria-label="Add a chatroom button"
                        role="button"   
                        aria-haspopup="true"
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
                    <div role="menu" aria-label="list of all chatroom's that you are in and can send messages in." className={ styles.usersContainer }>
                        { this.state.listOfConversationsToOpenOrDelete }
                    </div>                          
                </aside >                   
            </Fragment>       
        );
    }
}

export default SidebarOfConversations;