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
        this.handleAuthentication();
        //get and set state with an array of all the chatroom's the authenticated user is in
        if(this.props.userId) { this.handleUsersChatRoomsID(); }
    }

    //removes the interval component did mount/ updateChatRoom.
    componentWillUnmount() { clearInterval(this.interval); }

    closeNotification = () => this.props.setNotification(null);

    handleNotification = message => {
        let sanitizedMessage = DOMPurify.sanitize(message);
        //only allows words, spaces, !, ?, $
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');
        let alertComponent=<Alert alertMessage={ sanitizedMessage } alertClose={ this.closeNotification }/>;
        this.props.setNotification(alertComponent);
    }

    //check that the user is logged in and if passed true for logout logs the user out
    handleAuthentication = logout => {
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
    handleShowSidebar = closeOnly => {
        //the x in the sidebar for mobile was clicked then close only == true
        if(closeOnly === true) {
            this.props.setShowSidebar(false);
            //wait for animiation to complete.
            setTimeout(() => this.setState({ sidebarInlineStyles: { display: 'none'}}), 1000);
        } else {
            if(this.props.showSidebar) {
                this.props.setShowSidebar(false);
                //wait for animiation to complete.
                setTimeout(() => this.setState({ sidebarInlineStyles: { display: 'none'}}), 1000);
            } else {
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
                axios.get('chatRooms/' + oldID + '.json').then(newChatRoom => {
                    if(this.props.currentChatRoom !== newChatRoom.data && oldID === this.props.currentChatRoomID) {
                        this.props.setCurrentChatRoom(newChatRoom.data);
                    }
                });
            }
            //check for new chatroom's in the db
            this.handleUsersChatRoomsID();
            if(this.props.authenticated === false) { this.props.authLogout(); }
        }, 500);
    }

    //gets array of chatRoomsID auth user is in. if its different then our current UsersChatRoomsID then update state. called by mount and update
    handleUsersChatRoomsID = () => {
        if(this.props.userId) {
            axios.get('usersChatRooms/ucr' + this.props.userId + '/chatRooms.json').then(
                newUsersChatRoomsID => {
                    if(newUsersChatRoomsID.data !== this.props.usersChatRoomsID) { this.props.setUsersChatRoomsID(newUsersChatRoomsID.data); }
                }
            );
        }     
    }

    //gets selected chatRoom users(cru). gets name of recipient. then sets currentChatRoomName to recipients name. called by setCurrentChatRoom
    handleCurrentChatRoomName = ChatRoomID => {   
        if(ChatRoomID) {
            axios.get('chatRoomsUsers/cru' + ChatRoomID + '/users.json').then(
                e => {
                    if(e.data) {
                        let authUserIndex = e.data.indexOf(this.props.userId);
                        e.data.splice(authUserIndex, 1);                    
                        axios.get('users/u' + e.data[0] + '/userName.json').then(e => {
                            this.props.setCurrentChatRoomName(e.data);
                        });                   
                    }
                    else {
                        this.props.setCurrentChatRoomName('Unanimity');
                    }
                }
            ); 
        }
    }

    //called by sidebar on click of a chatroom. calls functions to set chatRoom name and set state for CurrentChatRoomID and CurrentChatRoom
    handleCurrentChatRoom = setChatRoomID => { 
        this.handleCurrentChatRoomName(setChatRoomID);
        axios.get('chatRooms/' + setChatRoomID + '/.json').then(
            chatRoomMsg => {  
                this.props.setCurrentChatRoomID(setChatRoomID);       
                this.props.setCurrentChatRoom(chatRoomMsg.data);
            }
        );
    }

    newChatRoom = (event, recipentName) => {
        recipentName = DOMPurify.sanitize(recipentName);
        recipentName = recipentName.replace(/[^\w^!?$]/g,'');
        recipentName = recipentName.toLowerCase();   
        let recipentID = null;
        let newChatRoomID = null;
        //updatedChatRoomID is the id that comes after this newChatRoom Id. used to update the db.
        let updatedChatRoomID = null;
        let newChatRoomObject = {};
        //will be the new updated userChatRooms/ucr+userID/chatRooms.json for the authenticated user. will equal array of chatRoomsID that the user is apart of
        let updatedAuthUserChatRoomsID = [];
        let updatedRecipientUserChatRoomsID = [];
        //object that will be inserted in the newly created ChatRoomUsers/newchatRoomid.json.
        let newChatRoomUsersObject = {};
        
        //adds references in db for a new chatroom.
        let addChatRoomReferances = () => {
            //if recipentID was set. the user they are trying to start a convo with exists.
            if(recipentID !== null) {
                newChatRoomObject = { nextMsgNum: 2, };
                //adds u+userid to the chatroom object with u+userID as the property name. then sets the value to an array with a welcome message.
                newChatRoomObject["u" + this.props.userId] = [(this.props.username + " has joined the chat!")];
                newChatRoomObject["u" + recipentID] = [ null, (recipentName + " has joined the chat!")];
                axios.get('chatRooms/nextChatRoomID.json').then(
                    nextChatRoomId => {
                        //--------- start create the chatroom in chatRooms ---------
                        newChatRoomID = nextChatRoomId.data;
                        if(newChatRoomID) {
                            axios.put('chatRooms/' + newChatRoomID + '.json', newChatRoomObject).catch(
                                error => {
                                    this.props.setNotification([<Alert alertMessage = "failed to add chat room to data base. Please try agin." alertClose = { this.closeNotification }/>]);   
                                }
                            );
                            updatedChatRoomID = parseInt(newChatRoomID);
                            //increment the ID to find the Id after newID
                            updatedChatRoomID++;
                            axios.put('chatRooms/nextChatRoomID.json', updatedChatRoomID).catch(
                                error => { console.log("failed to update the nextChatRoomID in the DB ", error); }
                            );
                        }
                        else {      
                            this.props.setNotification([<Alert alertMessage="Could not determine the chat room id. Please try agin." alertClose={ this.closeNotification }/>]);
                        }
                        //--------- end create the chatroom in chatRooms ---------


                        // --------- start update usersChatRooms for authenticated user and recipent ---------
                        //they have other chatRooms
                        if(this.props.usersChatRoomsID) {
                            //gets latest data. this prevents from add chatroom adding chatroom references to deleted chatroom
                            axios.get('usersChatRooms/ucr' + this.props.userId + '/chatRooms.json').then(
                                e => {
                                    this.handleUsersChatRoomsID();
                                    updatedAuthUserChatRoomsID = e.data;
                                    updatedAuthUserChatRoomsID.push(newChatRoomID);
                                    let chatRooms = updatedAuthUserChatRoomsID;
                                    axios.put('usersChatRooms/ucr' + this.props.userId + '.json', { chatRooms }).catch(
                                        error => {
                                            let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error);
                                            this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification } />]);
                                        }
                                    ); 
                                }
                            );
                        } else {
                            //add their first chatroom
                            updatedAuthUserChatRoomsID = [];
                            updatedAuthUserChatRoomsID.push(newChatRoomID);
                            let chatRooms = updatedAuthUserChatRoomsID;
                            axios.put('usersChatRooms/ucr' + this.props.userId + '.json', { chatRooms }).catch(
                                error => {                              
                                    let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error); 
                                    this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                                }
                            );
                        }

                        axios.get('usersChatRooms/ucr' + recipentID + '/chatRooms.json').then(
                            recipientsChatRoom => {
                                if(recipientsChatRoom.data) {
                                    updatedRecipientUserChatRoomsID = recipientsChatRoom.data;
                                } else {
                                    updatedRecipientUserChatRoomsID = [];
                                }
                                updatedRecipientUserChatRoomsID.push(newChatRoomID);
                                let chatRooms = updatedRecipientUserChatRoomsID;
                                axios.put('usersChatRooms/ucr' + recipentID + '.json', { chatRooms }).then(
                                    () => {
                                        //auth and recipent have new chatroom so update auth user sidebar with new chatroom 
                                        this.handleUsersChatRoomsID();     
                                    }
                                ).catch(
                                    error => {                                     
                                        let errorMessage = "Error. failed to update Recipient usersChatRooms " + DOMPurify.sanitize(error);
                                        this.props.setNotification([<Alert alertMessage={ errorMessage } alertClose={ this.closeNotification }/>]);
                                    }
                                );
                            } 
                        ) 
                        // --------- end of userChatRooms update ---------


                        // --------- start of update chatRoomUser --------- 
                        newChatRoomUsersObject = {
                            chatRoomID: newChatRoomID,
                            users: [this.props.userId, recipentID]
                        }
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
        }

        if(event) { event.preventDefault(); }
        //--------- start check if recipients name exists. set recipientsId if it exists ---------
        if(recipentName !== null && recipentName !== this.props.username && recipentName) {
            axios.get('userIDByUsername/' + recipentName + '.json').then(
                response => {
                    recipentID = response.data;
                    if(recipentID === null) {     
                        this.props.setNotification([<Alert alertMessage = "User not found! 308" alertClose = { this.closeNotification } />]);
                    }

                    // --------- Check to see if auth user already has a chatroom with recipent ---------
                    if(recipentID !== null) {
                        if(this.props.usersChatRoomsID !== null) {
                            this.props.usersChatRoomsID.forEach(chatRoomID => {
                                //for the current chatRoom get the users in that chatroom
                                axios.get('chatRoomsUsers/cru' + chatRoomID + '.json').then(
                                    chatRoomUsers => {
                                        if(chatRoomUsers) {
                                            let hasChatRoomWithRecipent = false;
                                            // see if auth user has a chatroom with recipent already
                                            for(let i = 0; i < Object.values(chatRoomUsers.data.users).length; i++) {
                                                let userID = chatRoomUsers.data.users[i];
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
                    this.props.setNotification([<Alert alertMessage="User not found! 366" alertClose={ this.closeNotification }/>]);
                }
            );
        } else {
            this.props.setNotification([<Alert alertMessage="Recipent\'s name is required and can\'t be your own name!" alertClose={ this.closeNotification }/>]);
        }
        // --------- end of check recipent name ---------
    }

    removeChatRoom = removeChatRoomID => {
        //will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
        let removeChatRoomUsers = [];
        //index of the chatRoom we need to remove from userChatRoom ( ucr )
        let ucrIndex = null;
        let empty = {};
        if(removeChatRoomID !== null) {
            //get the chatRoomUsers ID so that we can use it to remove the chatRoom from usersChatRoom.
            axios.get('chatRoomsUsers/cru' + removeChatRoomID + '/users.json').then(
                chatRoom => {
                    if(chatRoom.data !== null) {
                        removeChatRoomUsers = chatRoom.data;
                        // -------- start remove the chatRoom from the ChatRoomUsers --------
                        //deletes data by setting it equal to an empty object. firebase then automatically removes empty objects
                        axios.put('chatRoomsUsers/cru' + removeChatRoomID + '.json', empty).then(() => {
                            if(this.props.currentChatRoomID === removeChatRoomID) {
                                //set the current chatroom to Unanimity instead of the chatroom that dose not exist
                                this.props.setCurrentChatRoomName('Unanimity');
                            }
                        }).catch(e => { console.log("error overriding/deleting chatRoomUsers for " + removeChatRoomID + "axios error: " + e) });
                        // -------- end of remove the chatRoom from the chatRoomUsers --------


                        // -------- start of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------
                        if(removeChatRoomUsers) {
                            removeChatRoomUsers.forEach(user => {
                                //get all of the users chatroom's for a specific user
                                axios.get('usersChatRooms/ucr' + user + '/chatRooms.json').then(
                                    userChatRoomIds => {                                  
                                        userChatRoomIds.data = Object.values(userChatRoomIds.data);                                   
                                        ucrIndex = userChatRoomIds.data.indexOf(removeChatRoomID);                                  
                                        //0 is a valid index but zero equals false by default 
                                        if(ucrIndex || ucrIndex === 0) {                                 
                                            userChatRoomIds.data.splice(ucrIndex, 1);                                     
                                            if(Object.values(userChatRoomIds.data).length === 0) {                                               
                                                //User has only one chatroom. db requires object to be passed. cant not pass null so we pass empty object. which firebase auto deletes          
                                                axios.put('usersChatRooms/ucr' + user + '/chatRooms.json', empty).then(
                                                    () => {
                                                        //causes sidebar to update
                                                        this.handleUsersChatRoomsID(); 
                                                    }
                                                ).catch(error => { console.log(error); });
                                            } else {                                      
                                                let chatRooms = userChatRoomIds.data;
                                                axios.put('usersChatRooms/ucr' + user + '.json', { chatRooms }).then(
                                                    () => {
                                                        //causes sidebar to update
                                                        this.handleUsersChatRoomsID();
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
                        //deletes data by setting it to empty object. then firebase removes it completely
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
        else {
            console.log("removeChatRoomID was null in removeChatRoom function. function was canceled.");
        }
    }

    render() {
        let mainContentInlineStyles = {}; 
        //sidebar closed make main content (the chatRoom area) expand entire width
        if(!this.props.showSidebar) {
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
                            setCurrentChatRoomID = { this.handleCurrentChatRoom }
                            showSidebar={ this.props.showSidebar }
                            addChatRoom={ this.newChatRoom }
                            deleteChatRoom={ this.removeChatRoom }
                            toggleSidebar={ this.handleShowSidebar }
                        />
                    </div>
                    <div className={ styles.mainContentGrid } style={ mainContentInlineStyles }>
                        <MainContent 
                            newMessage={ this.newMessage }
                            currentChatRoom={ this.props.currentChatRoom }
                            currentChatRoomName={ this.props.currentChatRoomName }
                            authUsername={ this.props.username }
                            authUID={ this.props.userId }
                            toggleSidebar={ this.handleShowSidebar }
                            showSidebar={ this.props.showSidebar }
                            setAuth={ this.handleAuthentication }
                            showAlert={ this.handleNotification }
                        />
                    </div> 
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);