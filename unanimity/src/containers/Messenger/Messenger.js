import React, { Component, Fragment } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.scss';
import DOMPurify from 'dompurify';
import Alert from '../../components/Alert/Alert';
import { setAuthentication, setUserId, setUsername, setShowSidebar, setCurrentChatRoomID, setCurrentChatRoom, setCurrentChatRoomName, setUsersChatRoomsID, setNotification } from '../../redux/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        authenticated: state.authentication.authenticated,
        userId: state.authentication.userId,
        username: state.authentication.username,
        showSidebar: state.messenger.showSidebar,
        currentChatRoomID: state.messenger.currentChatRoomID,
        currentChatRoom: state.messenger.currentChatRoom,
        usersChatRoomsID: state.messenger.usersChatRoomsID,
        currentChatRoomName: state.messenger.currentChatRoomName,
        notification: state.messenger.notification,
    };
};

const mapDispatchToProps = {
    setAuthentication: authStatus => setAuthentication(authStatus),
    setUserId: userId => setUserId(userId),
    setUsername: username => setUsername(username),
    setShowSidebar: showSidebar => setShowSidebar(showSidebar),
    setCurrentChatRoomID: currentChatRoomID => setCurrentChatRoomID(currentChatRoomID),
    setCurrentChatRoom: currentChatRoom => setCurrentChatRoom(currentChatRoom),
    setCurrentChatRoomName: currentChatRoomName => setCurrentChatRoomName(currentChatRoomName),
    setUsersChatRoomsID: usersChatRoomsID => setUsersChatRoomsID(usersChatRoomsID),
    setNotification: notification => setNotification(notification)
};

class Messenger extends Component {
    state = {
        sidebarInlineStyles: { display: 'block' },
    }
 
    componentDidMount = () => {
        //updates the chatroom every half a second so users can see new messages
        this.updateChatRoom(); 
        //on load of messenger make sure the user is logged in.
        this.setAuthentication();
        //get and set state with an array of all the chatroom's the authenticated user is in
        if(this.props.userId) { this.setUsersChatRoomsID(); }
    }

    //removes the interval component did mount/ updateChatRoom.
    componentWillUnmount() { clearInterval(this.interval); }

    closeNotification = () => this.props.setNotification(null);

    setNotification = message => {
        let sanitizedMessage = DOMPurify.sanitize(message);
        //only allows words, spaces, !, ?, $
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');
        let alertComponent=<Alert alertMessage={ sanitizedMessage } alertClose={ this.closeNotification }/>;
        this.props.setNotification(alertComponent);
    }

    //check that the user is logged in and if passed true for logout logs the user out
    setAuthentication = logout => {
        //on login make sure all required values are set. If one value is not set force logout.
        if(logout === null || logout === undefined) {
            if(!this.props.username || !this.props.authenticated || !this.props.userId) {
                this.props.setAuthentication(false);
                this.props.setUserId(null);
                this.props.setUsername(null);
            }
        } else { 
            /* Logout */
            this.props.setAuthentication(false);
            this.props.setUserId(null);
            this.props.setUsername(null);
        }
    }

    //onClick of hamburger/X. show/Hide the sidebar
    setShowSidebar = closeOnly => {
        //the x in the sidebar for mobile was clicked then close only == true
        if(closeOnly === true) {
            this.props.setShowSidebar(false);
            //wait for animiation to complete.
            setTimeout(() => this.setState({ sidebarInlineStyles: { display: 'none'}}), 1000);
        } else {
            if(this.props.showSidebar) {
                //if sidebar was showing and we click hamburger. close the sidebar
                this.props.setShowSidebar(false);
                //wait for animiation to complete.
                setTimeout(() => this.setState({ sidebarInlineStyles: { display: 'none'}}), 1000);
            } else {
                //if sidebar was closed and we clicked the hamburger open the sidebar
                this.setState({ sidebarInlineStyles: { display: 'block' } });
                //wait for the animation
                setTimeout(() => this.props.setShowSidebar(true), 150);
            }
        }
    }

    //once auth user sends message. Validates Message, add to the DB.
    newMessage = newMessage => {
        //messageChatRoom = selected chatroom object with all the messages
        let messageChatRoom = Object.entries(this.props.currentChatRoom);
        let authenticaedUserMessageOld = [];
        let authenticaedUserMessageCombined = [];
        //nextMsgNum is the number of all the mesages sent by auth user and recipent plus one.
        let nextMsgNum = null;
        if(newMessage.length > 0 && newMessage.length < 2000 && this.props.currentChatRoom != null) {
            Object.entries(this.props.currentChatRoom).forEach(user => {
                if(user[0] === ("u" + this.props.userId)) {
                    //in this if user[0] is "u" + auth userID. user[1] is auth users messages
                    authenticaedUserMessageOld = user[1] ;
                } else if(user[0] === "nextMsgNum") {
                    nextMsgNum = user[1];
                }
            });
            authenticaedUserMessageCombined = [...Object.values(authenticaedUserMessageOld)];
            authenticaedUserMessageCombined[nextMsgNum] = DOMPurify.sanitize(newMessage);
            authenticaedUserMessageCombined[nextMsgNum] = authenticaedUserMessageCombined[nextMsgNum].replace(/[^\w\s!?$]/g,'');
            nextMsgNum++; 
            messageChatRoom.forEach(property => {
                if(property[0] === ("u" + this.props.userId)) {
                    property[1] = authenticaedUserMessageCombined;
                } else if(property[0] === "nextMsgNum") {
                    property[1] = nextMsgNum;
                }
            })
            messageChatRoom = Object.fromEntries(messageChatRoom);
            axios.put("chatRooms/" + this.props.currentChatRoomID + ".json", messageChatRoom);
            //update our current chatRoom
            this.props.setCurrentChatRoom(messageChatRoom);
        }
    }

    /* checks for new messages/new chatrooms from other users */
    updateChatRoom = () => {
        this.interval = setInterval(() => {
            if(this.props.currentChatRoomID && this.props.currentChatRoom !== 'Unanimity') {
                let oldID = this.props.currentChatRoomID;
                //get the messages for the current chatroom                
                axios.get('chatRooms/' + oldID + '.json').then(res => {
                    //if the selected chatroom has not changes and there is new messages update the state
                    if(this.props.currentChatRoom !== res.data && oldID === this.props.currentChatRoomID) {
                        this.props.setCurrentChatRoom(res.data);
                    }
                });
            }
            //check for new chatroom's in the db
            this.setUsersChatRoomsID();
            if(this.props.authenticated === false) { this.props.authLogout(); }
        }, 500);
    }

    //gets array of chatRoomsID that the user is in and sets userChatRoomsID in state. called by mount and update
    setUsersChatRoomsID = () => {
        //ucr stands for user Chat Room.
        //get array that contains all the chatRoomIDs that the user is a part of
        if(this.props.userId) {
            //get auth user ucr
            axios.get('usersChatRooms/ucr' + this.props.userId + '/chatRooms.json').then(
                e => {
                    //if the data has changed update it.
                    if(e.data !== this.props.usersChatRoomsID) { this.props.setUsersChatRoomsID(e.data); }
                }
            );
        }     
    }

    //called by setCurrentChatRoom
    setCurrentChatRoomName = ChatRoomIDForName => {   
        if(ChatRoomIDForName) {
            //for the passed in chatRoomName get the users in that chatRoom
            axios.get('chatRoomsUsers/cru' + ChatRoomIDForName + '/users.json').then(
                e => {
                    if(e.data) {
                        //find index of our id in the array of users.
                        let userIndex = e.data.indexOf(this.props.userId);
                        //remove ourself form the array.
                        e.data.splice(userIndex, 1);
                        //for recipients in the array set them as chatRoom name
                        e.data.forEach(singleUserID => {
                            //get username by id.
                            axios.get('users/u' + singleUserID + '/userName.json').then(e => {
                                //set the chatroom name to the users name
                                this.props.setCurrentChatRoomName(e.data);
                            });
                        });
                    }
                    else {
                        //no chatroomName so set the chatroom to be the placeholder Unanimity
                        this.props.setCurrentChatRoomName('Unanimity');
                    }
                }
            ); 
        }
    }

    //called by sidebar on click of a chatroom
    //sets currentChatRoom and currentChatRoomID
    setCurrentChatRoom = setChatRoomID => { 
        //calls the function to start setting the current chatroom Name
        this.setCurrentChatRoomName(setChatRoomID);
        //gets object with messages for each user and next message number
        axios.get('chatRooms/' + setChatRoomID + '/.json').then(
            e => {  
                this.props.setCurrentChatRoomID(setChatRoomID);       
                this.props.setCurrentChatRoom(e.data);
            }
        );
    }

    //add onSubmission of popUp for addChatRoom in sidebar component
    newChatRoom = (event, recipentName) => {
        //sanitize data 
        recipentName = DOMPurify.sanitize(recipentName);
        recipentName = recipentName.replace(/[^\w^!?$]/g,'');
        recipentName = recipentName.toLowerCase();
        
        let recipentID = null; //id of the person we are sending to
        //the chatroom id that will be used for the creation of the new chatroom
        let newChatRoomID = null;
        //chatRoomID after our new chatroom. used for updating db after we add our new chatroom
        let updatedChatRoomID = null;
        let newChatRoomObject = {};
        //will be the new updated userChatRooms/ucr+userID/chatRooms.json for the authenticated user. will equal array of chatRoomsID that the user is apart of
        let updatedAuthUserChatRoomsID = [];
        let updatedRecipientUserChatRoomsID = [];
        //object that will be inserted in the newly created ChatRoomUsers/newchatRoomid.json.
        let newChatRoomUsersObject = {};
        //adds references in db for a new chatroom. this was required to prevent from redundant code
        let addChatRoomReferances = () => {
            // --------- start create the chatroom and add chatroom to all tables for reference ---------
            //if userID was set. username was found
            if(recipentID !== null) {
                //sets newChatRoomObject. object will be added to db as a new chatroom
                newChatRoomObject = { nextMsgNum: 2, };
                //adds u+userid to the chatroom object with u+userID as the property name. then sets the value to an array with a welcome message.
                newChatRoomObject["u" + this.props.userId] = [(this.props.username + " has joined the chat!")];
                newChatRoomObject["u" + recipentID] = [ null, (recipentName + " has joined the chat!")];
                //gets next available chatRoomID
                axios.get('chatRooms/nextChatRoomID.json').then(
                    e => {
                        //--------- start create the chatroom in chatRooms ---------
                        //sets newChatroomID to next available chat room id
                        newChatRoomID = e.data;
                        //check if we have a newChatRoomID
                        if(newChatRoomID) {
                            //add the newChatRoomObject to the DB. under ChatRooms/newChatRoomID.json
                            axios.put('chatRooms/' + newChatRoomID + '.json', newChatRoomObject).catch(
                                error => {
                                    //failed to add the chatroom to the db   
                                    this.props.setNotification([<Alert alertMessage = "failed to add chat room. Please try agin." alertClose = { this.closeNotification }/>]);   
                                }
                            );
                            //find the chatRoomID that comes after our newChatRoomID
                            //sometimes it is a string so convert it to a int
                            updatedChatRoomID = parseInt(newChatRoomID);
                            //increment the ID to find the Id after newID
                            updatedChatRoomID++;
                            //set the db nextChatRoomID to the updatedChatRoomID
                            axios.put('chatRooms/nextChatRoomID.json', updatedChatRoomID).catch(
                                error => { console.log("failed to update the nextChatRoomID in the DB ", error); }
                            );
                        }
                        //else we don't have a newChatRoomID
                        else {      
                            this.props.setNotification([<Alert alertMessage="Could not determine the chat room id. Please try agin." alertClose={ this.closeNotification }/>]);
                        }
                        //--------- end create the chatroom in chatRooms ---------


                        // --------- start update usersChatRooms for authenticated user and recipent ---------
                        //start update for Authenticated user
                        if(this.props.usersChatRoomsID) {
                            //gets the latest data. this step prevents form add chatroom adding chatroom references to deleted chatroom
                            axios.get('usersChatRooms/ucr' + this.props.userId + '/chatRooms.json').then(
                                e => {
                                    this.props.setUsersChatRoomsID(e.data); //adds all chatroom's that authenticated user is in
                                    updatedAuthUserChatRoomsID = e.data;
                                    //add the newChatRoomID to the authenticated user chatRoomsID
                                    updatedAuthUserChatRoomsID.push(newChatRoomID);
                                    let chatRooms = updatedAuthUserChatRoomsID;
                                    //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                                    axios.put('usersChatRooms/ucr' + this.props.userId + '.json', { chatRooms }).catch(
                                        error => {
                                            let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error);
                                            this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification } />]);
                                        }
                                    ); 
                                }
                            );
                        } else {
                            updatedAuthUserChatRoomsID = [];
                            //add the newChatRoomID to the authenticated user chatRoomsID
                            updatedAuthUserChatRoomsID.push(newChatRoomID);
                            let chatRooms = updatedAuthUserChatRoomsID;
                            //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                            axios.put('usersChatRooms/ucr' + this.props.userId + '.json', { chatRooms }).catch(
                                error => {                              
                                    let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error); 
                                    this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                                }
                            );//axios put updates Auth user in userChatRooms
                        }
                        //end update for Authenticated user


                        //start update for Recipient
                        //get the recipients current/old ( without the new chatroom ) chatRooms from usersChatRooms
                        axios.get('usersChatRooms/ucr' + recipentID + '/chatRooms.json').then(
                            e => {
                                //if e.data is not null
                                if(e.data) {
                                    updatedRecipientUserChatRoomsID = e.data; //set URUCR-ID to the data 
                                } else {
                                    updatedRecipientUserChatRoomsID = [];
                                }
                                //add newChatRoomID to the recipients Chatroom
                                updatedRecipientUserChatRoomsID.push(newChatRoomID);
                                let chatRooms = updatedRecipientUserChatRoomsID;
                                //add the updated IDs to the DB
                                axios.put('usersChatRooms/ucr' + recipentID + '.json', { chatRooms }).then(
                                    () => {
                                        // --------- start update Sidebar with new ChatRoom ---------
                                        //once the userChatRooms has been updated
                                        //updates the state for usersChatRoomsID which sidebar uses to load all the chatroom's for auth user.    
                                        this.setUsersChatRoomsID();
                                        // --------- end update Sidebar with new ChatRoom ---------
                                    }
                                ).catch(
                                    error => {                                     
                                        let errorMessage = "Error. failed to update Recipient usersChatRooms " + DOMPurify.sanitize(error);
                                        this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                                    }
                                );
                            } 
                        ) 
                        //end update for Recipient
                        // --------- end of userChatRooms update ---------


                        // --------- start Add chatRoomUsers for new chatRoom --------- 
                        //create proper structured object for db
                        newChatRoomUsersObject = {
                            chatRoomID: newChatRoomID,
                            users: [this.props.userId, recipentID]
                        }
                        //add chatRoomUsers to db
                        axios.put('chatRoomsUsers/cru' + newChatRoomID + '.json', newChatRoomUsersObject).catch(
                            error => {
                                let errorMessage = "Error. Failed to add ChatRoom to ChatRoomUsers " + DOMPurify.sanitize(error); 
                                this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                            }
                        );
                        // --------- end of update chatRoomUsers ---------
                    } 
                ).catch(
                    //if error occurred in axios get nextChatRoomID from chatRooms/nextChatRoomID.json
                    error => {
                        let errorMessage = "Error occurred while trying to set ChatRoomID. Please try agin. " + DOMPurify.sanitize(error); 
                        this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                    }
                );
            }
            //--------- end create the chatroom and references ---------
        }
        if(event) { event.preventDefault(); }
        //--------- start check if recipients name exists. set recipientsId if it exists ---------
      
        if(recipentName !== null && recipentName !== this.props.username && recipentName) {
            //axios get userIDbyName for recipent
            axios.get('userIDByUsername/' + recipentName + '.json').then(
                response => {
                    //if username was found set userID
                    recipentID = response.data;
                    //if no recipentID
                    if(recipentID === null) {     
                        this.props.setNotification([<Alert alertMessage = "User not found! 308" alertClose = { this.closeNotification } />]);
                    }

                    // --------- Check to see if auth user already has a chatroom with recipent ---------
                    // if we have a valid recipent
                    if(recipentID !== null) {
                        //if the auth user has other chatroom check to see if the recipent is in one of those
                        if(this.props.usersChatRoomsID !== null) {
                            //for each auth userChatroom. check to see if the recipent is in one of those chatroom's
                            this.props.usersChatRoomsID.forEach(chatRoomID => {
                                //for the current chatRoom get the users in that chatroom
                                axios.get('chatRoomsUsers/cru' + chatRoomID + '.json').then(
                                    result => {
                                        if(result) {
                                            let hasChatRoomWithRecipent = false;
                                            // see if auth user has a chatroom with recipent already
                                            for(let i = 0; i < Object.values(result.data.users).length; i++) {
                                                let userID = result.data.users[i];
                                                if(recipentID === userID) {             
                                                    this.props.setNotification([<Alert alertMessage="You already have a chatroom with this user." alertClose={ this.closeNotification }/>]);             
                                                    hasChatRoomWithRecipent = true;
                                                    break;
                                                }
                                            }
                                            //if the auth user dose not have a chatroom with the recipent add the chatroom
                                            if(recipentID !== null && hasChatRoomWithRecipent === false) {
                                                addChatRoomReferances();
                                            }
                                        }
                                    });
                            });
                        } else {
                            /* no chatroom for the recipient to be in so just add the chatroom */
                            addChatRoomReferances();
                        }
                    }
                }
            ).catch(
                error => {
                    //no username found alert user
                    this.props.setNotification([<Alert alertMessage="User not found! 685" alertClose={ this.closeNotification }/>]);
                }
            );
        } else {
            //username cannot be null and not ours
            this.props.setNotification([<Alert alertMessage="Recipent\'s name is required and can\'t be your own name!" alertClose={ this.closeNotification }/>]);
        }
        // --------- end of check recipent name ---------
    }

    removeChatRoom = removeChatRoomID => {
        //will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
        let removeChatRoomUsers = [];
        //index of the chatRoom we need to remove from userChatRoom ( ucr )
        let ucrIndex = null;
        //used for deleting the data. set the data to null ( empty object ) and firebase removes it completely
        let empty = {};
    
        if(removeChatRoomID !== null) {
            //get the chatRoomUsers ID so that we can use it to remove the chatRoom from usersChatRoom.
            axios.get('chatRoomsUsers/cru' + removeChatRoomID + '/users.json').then(
                e => {
                    //if there is no data then .catch() should inform the user something went wrong
                    //also if there is e.data then the chatroom existed
                    if(e.data !== null) {
                        removeChatRoomUsers = e.data;
                        // -------- start remove the chatRoom from the ChatRoomUsers --------
                        //deletes data by setting it equal to an empty object. firebase then automatically removes empty objects
                        axios.put('chatRoomsUsers/cru' + removeChatRoomID + '.json', empty).then(() => {
                            //if deleted chatroom is the current chatroom
                            if(this.props.currentChatRoomID === removeChatRoomID) {
                                //set the current chatroom to Unanimity instead of the chatroom that dose not exist
                                this.props.setCurrentChatRoomName('Unanimity');
                            }
                        }).catch(e => { console.log("error overriding/deleting chatRoomUsers for " + removeChatRoomID + "axios error: " + e) });
                        // -------- end of remove the chatRoom from the chatRoomUsers --------


                        // -------- start of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------
                        //if we have users to remove
                        if(removeChatRoomUsers) {
                            //for each user that we need to remove the chatroom from
                            removeChatRoomUsers.forEach(user => {
                                //get all of the users chatroom's for a specific user
                                axios.get('usersChatRooms/ucr' + user + '/chatRooms.json').then(
                                    e => {                                  
                                        e.data = Object.values(e.data);  //confirm that it is an array                                     
                                        ucrIndex = e.data.indexOf(removeChatRoomID);  //find the index of the chatRoomID we need to remove                                   
                                        //if we have an index to remove.
                                        //0 is a valid index but zero equals false by default 
                                        if(ucrIndex || ucrIndex === 0) {
                                            //removes the chatroom from the usersChatRooms                                     
                                            e.data.splice(ucrIndex, 1);                                     
                                            ///if e.data only contained one chatroom and we removed that chatroom then it would equal null
                                            if(Object.values(e.data).length === 0) {
                                                //update the userChatRooms to the empty object which just deletes the entire object.
                                                //if we used e.data which is just null it doesn't work. it requires an object to be passed in for the DB restraints
                                                //in if ucrIndex because if we don't remove anything no need to update the db
                                                //update users chatroom's in BD
                                                axios.put('usersChatRooms/ucr' + user + '/chatRooms.json', empty).then(
                                                    () => {
                                                        this.setUsersChatRoomsID(); //causes sidebar to update
                                                    }
                                                ).catch(error => { console.log(error); });
                                            }
                                            //removed the chatroom and they still have other chatroom's
                                            else {                                      
                                                let chatRooms = e.data;
                                                //in if ucrIndex because if we don't remove anything no need to update the db
                                                //update users chatroom's in BD
                                                axios.put('usersChatRooms/ucr' + user + '.json', { chatRooms }).then(
                                                    () => {
                                                        //causes sidebar to update
                                                        this.setUsersChatRoomsID();
                                                    }
                                                ).catch(error => { console.log(error); });
                                            }
                                        }
                                    }
                                ).catch(e => console.log(e) );
                            });
                        }
                        // -------- end of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------


                        // -------- start of remove chatRoom from chatRooms -------- 
                        //deletes data by setting it to null. then firebase removes it completely
                        axios.put('chatRooms/' + removeChatRoomID + '.json', empty);
                        // -------- end of remove chatRoom from chatRooms -------- 
                    }
                }
            ).catch(
                 error => {
                    this.props.setNotification([<Alert alertMessage="Could not find Chatroom that you requested to be removed." alertClose={ this.closeNotification }/>]);
                }
            );
        }
        //chatRoomID Is null
        else {
            console.log("removeChatRoomID was null in removeChatRoom function. function was canceled.");
        }
    }

    render() {
        let mainContentInlineStyles = {};
        //if sidebar is not showing 
        if(!this.props.showSidebar) {
            //make main content span entire width of screen
            mainContentInlineStyles = {
                transform: 'translateX( -20vw )',
                width: '100vw',
                height: '100vh',
            };
        }
        //prevents sidebar from erring out by returning an empty array instead of null or undefined.
        let sidebarusersChatRoomsID;
        if(this.props.usersChatRoomsID !== null) {
            sidebarusersChatRoomsID = this.props.usersChatRoomsID;
        } else {
            sidebarusersChatRoomsID = [];
        }
   
        return(
            <Fragment>
                { this.props.notification }
                <div className={ styles.layout }>
                    <div className={ styles.sidebarGrid } style={ this.state.sidebarInlineStyles }>
                        <Sidebar usersChatRoomsID={ sidebarusersChatRoomsID }
                            userID={ this.props.userId }
                            setCurrentChatRoomID = { this.setCurrentChatRoom }
                            showSidebar={ this.props.showSidebar }
                            addChatRoom={ this.newChatRoom }
                            deleteChatRoom={ this.removeChatRoom }
                            toggleSidebar={ this.setShowSidebar }
                        />
                    </div>
                    <div className={ styles.mainContentGrid } style={ mainContentInlineStyles }>
                        <MainContent 
                            newMessage={ this.newMessage }
                            currentChatRoom={ this.props.currentChatRoom }
                            currentChatRoomName={ this.props.currentChatRoomName }
                            authUsername={ this.props.username }
                            authUID={ this.props.userId }
                            toggleSidebar={ this.setShowSidebar }
                            showSidebar={ this.props.showSidebar }
                            setAuth={ this.setAuthentication }
                            showAlert={ this.setNotification }
                        />
                    </div> 
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);