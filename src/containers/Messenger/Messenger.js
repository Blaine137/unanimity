import React, { Fragment, useEffect, useState } from 'react';
import SidebarOfConversations from '../../components/SidebarOfConversations/SidebarOfConversations';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.scss';
import DOMPurify from 'dompurify';
import { setAuthentication, setUserId, setUsername, setIsSidebarOpen, setCurrentChatRoomID, setCurrentChatRoom, setCurrentChatRoomName, setUsersChatRoomsID } from '../../redux/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        authenticated: state.authentication.authenticated,
        userId: state.authentication.userId,
        username: state.authentication.username,
        isSidebarOpen: state.messenger.isSidebarOpen,
        currentChatRoomID: state.messenger.currentChatRoomID,
        currentChatRoom: state.messenger.currentChatRoom,
        usersChatRoomsID: state.messenger.usersChatRoomsID,
        currentChatRoomName: state.messenger.currentChatRoomName
    };
};

const mapDispatchToProps = {
    setAuthentication,
    setUserId,
    setUsername,
    setIsSidebarOpen,
    setCurrentChatRoomID,
    setCurrentChatRoom,
    setCurrentChatRoomName,
    setUsersChatRoomsID
};

const Messenger = props => {
    const [sidebarInlineStyles, setSideStyles] = useState({display: 'block'});
 
    useEffect(() => {
        //updates the chatroom every half a second so users can see new messages
        const intervalForUpdateChatRoom = setInterval(() => { updateChatRoom(); }, 500);
        //on load of messenger make sure the user is logged in.
        intentionalAndForcedLogoutUser();
        //get and set state with an array of all the chatroom's the authenticated user is in
        if(props.userId) { getChatRoomIDsForAuthenticatedUser(); }

        return () => {
            //removes the interval component did mount/ updateChatRoom.
            clearInterval(intervalForUpdateChatRoom);
        };
    });

    //check that the user is logged in and if passed true for logout logs the user out
          
    const intentionalAndForcedLogoutUser = isUserLoggingOut => {
        //on login make sure all required values are set. If one value is not set force logout.
        if(isUserLoggingOut === null || isUserLoggingOut === undefined || isUserLoggingOut === false) {
            if(!props.username || !props.authenticated || !props.userId) {
                props.setAuthentication(false);
                props.setUserId(null);
                props.setUsername(null);
                props.setUsersChatRoomsID(null);
            }
        } else { 
            /* Logout */
            props.setAuthentication(false);
            props.setUserId(null);
            props.setUsername(null);
            props.setUsersChatRoomsID(null);
        }
    }

    //onClick of hamburger/X. show/Hide the sidebar
    const toggleSidebarOfConversations = closeSidebar => {
        //the x in the sidebar for mobile was clicked then close only == true
        if(closeSidebar === true) {
            props.setIsSidebarOpen(false);
            //wait for animiation to complete.
            setTimeout(() => setSideStyles({ display: 'none'}), 1000);
        } else {
            if(props.isSidebarOpen) {
                props.setIsSidebarOpen(false);
                //wait for animiation to complete.
                setTimeout(() => setSideStyles({ display: 'none'}), 1000);
            } else {
                setSideStyles({ display: 'block'})
                //wait for the animation
                setTimeout(() => props.setIsSidebarOpen(true), 150);
            }
        }
    }

    //once auth user sends message. Validates Message, add to the DB.
    const newMessage = newMessage => {
        //messageChatRoom = selected chatroom object with all the messages
        let messagesInCurrentChatRoom = Object.entries(props.currentChatRoom);
        let oldAuthenticatedUserMessages = [];
        let updatedAuthenticatedUserMessages = [];
        //nextMsgNum is the number of all the mesages sent by auth user and recipent plus one.
        let nextMsgNum = null;
        if(newMessage.length > 0 && newMessage.length < 2000 && props.currentChatRoom != null) {
            messagesInCurrentChatRoom.forEach(user => {
                if(user[0] === ("u" + props.userId)) {
                    //in this if user[0] is "u" + auth userID. user[1] is auth users messages
                    oldAuthenticatedUserMessages = user[1] ;
                } else if(user[0] === "nextMsgNum") {
                    nextMsgNum = user[1];
                }
            });
            let updatedMessagesInCurrentChatRoom = [...messagesInCurrentChatRoom];
            updatedAuthenticatedUserMessages = [...Object.values(oldAuthenticatedUserMessages)];
            updatedAuthenticatedUserMessages[nextMsgNum] = DOMPurify.sanitize(newMessage);
            updatedAuthenticatedUserMessages[nextMsgNum] = updatedAuthenticatedUserMessages[nextMsgNum].replace(/[^\w\s!?$:&.,\-()]/g,'');
            nextMsgNum++; 
            updatedMessagesInCurrentChatRoom.forEach(property => {
                if(property[0] === ("u" + props.userId)) {
                    property[1] = updatedAuthenticatedUserMessages;
                } else if(property[0] === "nextMsgNum") {
                    property[1] = nextMsgNum;
                }
            });
            //converts the array to an object
            updatedMessagesInCurrentChatRoom = Object.fromEntries(updatedMessagesInCurrentChatRoom); 
            axios.put("chatRooms/" + props.currentChatRoomID + ".json", updatedMessagesInCurrentChatRoom);
            //update our current chatRoom
            props.setCurrentChatRoom(updatedMessagesInCurrentChatRoom);
        }
    }

    /* checks for new messages/new chatrooms from other users */
    const updateChatRoom = () => {
        if(props.currentChatRoomID && props.currentChatRoom !== 'Unanimity') {
            let oldCurrentChatRoomID = props.currentChatRoomID;
            //get the messages for the current chatroom        
            axios.get('chatRooms/' + oldCurrentChatRoomID + '.json').then(newChatRoom => {  
                //convert object to string the see if strings equal to see if we need to update 
                if(JSON.stringify(props.currentChatRoom) !== JSON.stringify(newChatRoom.data) && oldCurrentChatRoomID === props.currentChatRoomID) {
                    props.setCurrentChatRoom(newChatRoom.data);
                }
            });
        }
        //check for new chatroom's in the db
        getChatRoomIDsForAuthenticatedUser();
        if(props.authenticated === false) { props.authLogout(); }
    }

    //gets array of chatRoomsID auth user is in. if its different then our current UsersChatRoomsID then update state. called by mount and update
    const getChatRoomIDsForAuthenticatedUser = () => {
        if(props.userId) {
            axios.get('usersChatRooms/ucr' + props.userId + '/chatRooms.json').then(
                newUsersChatRoomsID => {
                    //convert array to object. then stringify object. if strings dont eqaul chatroom has been added or delted. then update.
                    if(JSON.stringify(Object.assign({}, newUsersChatRoomsID.data)) !== JSON.stringify(Object.assign({}, props.usersChatRoomsID))) {
                         props.setUsersChatRoomsID(newUsersChatRoomsID.data); 
                    }
                }
            );
        }     
    }

    //gets selected chatRoom users(cru). gets name of recipient. then sets currentChatRoomName to recipients name. called by setCurrentChatRoom
    const getCurrentChatRoomName = ChatRoomID => {   
        if(ChatRoomID) {
            axios.get('chatRoomsUsers/cru' + ChatRoomID + '/users.json').then(
                e => {
                    if(e.data) {
                        let authenticatedUserIndex = e.data.indexOf(props.userId);
                        e.data.splice(authenticatedUserIndex, 1);                    
                        axios.get('users/u' + e.data[0] + '/userName.json').then(e => {
                            props.setCurrentChatRoomName(e.data);
                        });                   
                    }
                    else {
                        props.setCurrentChatRoomName('Unanimity');
                    }
                }
            ); 
        }
    }

    //called by sidebar on click of a chatroom. calls functions to set chatRoom name and set state for CurrentChatRoomID and CurrentChatRoom
    const getCurrentChatRoom = setChatRoomID => { 
        getCurrentChatRoomName(setChatRoomID);
        axios.get('chatRooms/' + setChatRoomID + '/.json').then(
            chatRoomMsg => {  
                props.setCurrentChatRoomID(setChatRoomID);       
                props.setCurrentChatRoom(chatRoomMsg.data);
            }
        );
    }

    const newChatRoom = (event, recipentName) => {
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
                newChatRoomObject["u" + props.userId] = [(props.username + " has joined the chat!")];
                newChatRoomObject["u" + recipentID] = [ null, (recipentName + " has joined the chat!")];
                axios.get('chatRooms/nextChatRoomID.json').then(
                    nextChatRoomId => {
                        //--------- start create the chatroom in chatRooms ---------
                        newChatRoomID = nextChatRoomId.data;
                        if(newChatRoomID) {
                            axios.put('chatRooms/' + newChatRoomID + '.json', newChatRoomObject).catch(
                                error => {
                                    props.showHideCustomAlert("failed to add chat room to data base. Please try agin.", null);   
                                }
                            );
                            updatedChatRoomID = parseInt(newChatRoomID);
                            //increment the ID to find the Id after newID
                            updatedChatRoomID++;
                            axios.put('chatRooms/nextChatRoomID.json', updatedChatRoomID).catch(
                                error => { props.showHideCustomAlert("failed to update the nextChatRoomID in the DB ", null); }
                            );
                        }
                        else {      
                            props.showHideCustomAlert("Could not determine the chat room id. Please try agin.", null);
                        }
                        //--------- end create the chatroom in chatRooms ---------


                        // --------- start update usersChatRooms for authenticated user and recipent ---------
                        //they have other chatRooms
                      
                        if(props.usersChatRoomsID && props.usersChatRoomsID.length !== 0) {
                            //gets latest data. this prevents from add chatroom adding chatroom references to deleted chatroom
                            axios.get('usersChatRooms/ucr' + props.userId + '/chatRooms.json').then(
                                e => {
                                    getChatRoomIDsForAuthenticatedUser();
                                    updatedAuthUserChatRoomsID = e.data;
                                    updatedAuthUserChatRoomsID.push(newChatRoomID);
                                    let chatRooms = updatedAuthUserChatRoomsID;
                                    axios.put('usersChatRooms/ucr' + props.userId + '.json', { chatRooms })
                                    .then(res => props.showHideCustomAlert('Chatroom successfully added!', true))
                                    .catch(
                                        error => {
                                            let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error);
                                            props.showHideCustomAlert(errorMessage, null);
                                        }
                                    ); 
                                }
                            );
                        } else {
                            //add their first chatroom
                            updatedAuthUserChatRoomsID = [];
                            updatedAuthUserChatRoomsID.push(newChatRoomID);
                            let chatRooms = updatedAuthUserChatRoomsID;
                            axios.put('usersChatRooms/ucr' + props.userId + '.json', { chatRooms }).catch(
                                error => {                              
                                    let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize(error); 
                                    props.showHideCustomAlert(errorMessage, null);
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
                                        getChatRoomIDsForAuthenticatedUser();     
                                    }
                                ).catch(
                                    error => {                                     
                                        let errorMessage = "Error. failed to update Recipient usersChatRooms " + DOMPurify.sanitize(error);
                                        props.showHideCustomAlert(errorMessage, null);
                                    }
                                );
                            } 
                        ) 
                        // --------- end of userChatRooms update ---------


                        // --------- start of update chatRoomUser --------- 
                        newChatRoomUsersObject = {
                            chatRoomID: newChatRoomID,
                            users: [props.userId, recipentID]
                        }
                        axios.put('chatRoomsUsers/cru' + newChatRoomID + '.json', newChatRoomUsersObject).catch(
                            error => {
                                let errorMessage = "Error. Failed to add ChatRoom to ChatRoomUsers " + DOMPurify.sanitize(error); 
                                props.showHideCustomAlert(errorMessage, null);
                            }
                        );
                        // --------- end of update chatRoomUsers ---------
                    } 
                ).catch(
                    //if error occurred in axios get nextChatRoomID from chatRooms/nextChatRoomID.json
                    error => {
                        let errorMessage = "Error occurred while trying to set ChatRoomID. Please try agin. " + DOMPurify.sanitize(error); 
                        props.showHideCustomAlert(errorMessage, null);
                    }
                );
            }
        }

        if(event) { event.preventDefault(); }
        //--------- start check if recipients name exists. set recipientsId if it exists ---------
        if(recipentName !== null && recipentName !== props.username && recipentName) {
            axios.get('userIDByUsername/' + recipentName + '.json').then(
                response => {
                    recipentID = response.data;
                    if(recipentID === null) {     
                        props.showHideCustomAlert("User not found! 308", null);
                    }

                    // --------- Check to see if auth user already has a chatroom with recipent ---------
                    if(recipentID !== null) {
                        if(props.usersChatRoomsID !== null && props.usersChatRoomsID.length !== 0) {
                            
                            props.usersChatRoomsID.forEach(chatRoomID => {
                                //for the current chatRoom get the users in that chatroom
                                axios.get('chatRoomsUsers/cru' + chatRoomID + '.json').then(
                                    chatRoomUsers => {
                                        if(chatRoomUsers) {
                                            let hasChatRoomWithRecipent = false;
                                            // see if auth user has a chatroom with recipent already
                                            for(let i = 0; i < Object.values(chatRoomUsers.data.users).length; i++) {
                                                let userID = chatRoomUsers.data.users[i];
                                                if(recipentID === userID) {             
                                                    props.showHideCustomAlert("You already have a chatroom with this user.", null);
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
                    props.showHideCustomAlert("User not found! 366", null);
                }
            );
        } else {
            props.showHideCustomAlert("Recipent\'s name is required and cannot be your own name!", null);
        }
        // --------- end of check recipent name ---------
    }

    const removeChatRoom = removeChatRoomID => {
        //will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
        let removeChatRoomUsers = [];
        //index of the chatRoom we need to remove from userChatRoom ( ucr )
        let userChatRoomIndex = null;
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
                            props.showHideCustomAlert('chatroom successfully removed!', true)
                            if(props.currentChatRoomID === removeChatRoomID) {
                                //set the current chatroom to Unanimity instead of the chatroom that dose not exist
                                props.setCurrentChatRoomName('Unanimity');
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
                                        userChatRoomIndex = userChatRoomIds.data.indexOf(removeChatRoomID);                                  
                                        //0 is a valid index but zero equals false by default 
                                        if(userChatRoomIndex || userChatRoomIndex === 0) {                                 
                                            userChatRoomIds.data.splice(userChatRoomIndex, 1);                                     
                                            if(Object.values(userChatRoomIds.data).length === 0) {                                               
                                                //User has only one chatroom. db requires object to be passed. cant not pass null so we pass empty object. which firebase auto deletes          
                                                axios.put('usersChatRooms/ucr' + user + '/chatRooms.json', empty).then(
                                                    () => {
                                                        //causes sidebar to update
                                                        getChatRoomIDsForAuthenticatedUser(); 
                                                    }
                                                ).catch(error => { console.log(error); });
                                            } else {                                      
                                                let chatRooms = userChatRoomIds.data;
                                                axios.put('usersChatRooms/ucr' + user + '.json', { chatRooms }).then(
                                                    () => {
                                                        //causes sidebar to update
                                                        getChatRoomIDsForAuthenticatedUser();
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
                    props.showHideCustomAlert("Could not find Chatroom that you requested to be removed.", null);
                }
            );
        }
        else {
            props.showHideCustomAlert("removeChatRoomID was null in removeChatRoom function. function was canceled.", null);
        }
    }

    let mainContentInlineStyles = {}; 
    //sidebar closed make main content (the chatRoom area) expand entire width
    if(!props.isSidebarOpen) {
        mainContentInlineStyles = {
            transform: 'translateX( -20vw )',
            width: '100vw',
            height: '100vh',
        };
    }
    //prevents sidebar from erring out by returning an empty array instead of null or undefined.
    let sidebarusersChatRoomsID;
    if(props.usersChatRoomsID !== null) {
        sidebarusersChatRoomsID = props.usersChatRoomsID;
    } else {
        sidebarusersChatRoomsID = [];
    }
    return(
        <Fragment>
            <div className={ styles.layout }>
                <div className={ styles.sidebarGrid } style={ sidebarInlineStyles }>
                    <SidebarOfConversations 
                        usersChatRoomsID={ sidebarusersChatRoomsID }
                        userID={ props.userId }
                        setCurrentChatRoomID = { getCurrentChatRoom }
                        isSidebarOpen={ props.isSidebarOpen }
                        addChatRoom={ newChatRoom }
                        deleteChatRoom={ removeChatRoom }
                        toggleSidebar={ toggleSidebarOfConversations }
                    />
                </div>
                <main className={ styles.mainContentGrid } style={ mainContentInlineStyles }>
                    <MainContent 
                        newMessage={ newMessage }
                        currentChatRoom={ props.currentChatRoom }
                        currentChatRoomName={ props.currentChatRoomName }
                        authUsername={ props.username }
                        authUID={ props.userId }
                        toggleSidebar={ toggleSidebarOfConversations }
                        isSidebarOpen={ props.isSidebarOpen }
                        intentionalAndForcedLogoutUser={ intentionalAndForcedLogoutUser }
                        showHideCustomAlert={ props.showHideCustomAlert }                    
                    />
                </main> 
            </div>
        </Fragment>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);