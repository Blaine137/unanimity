import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { connect } from 'react-redux';
import SidebarOfConversations from '../../components/SidebarOfConversations/SidebarOfConversations';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; // custom axios instance with DB base Url added
import styles from './Messenger.module.scss';
import {
  setIsSidebarOpen, setCurrentChatRoomID, setCurrentChatRoom, setCurrentChatRoomName, setUsersChatRoomsID,
} from '../../redux/actions';

const mapStateToProps = (state) => ({
  isSidebarOpen: state.messenger.isSidebarOpen,
  currentChatRoomID: state.messenger.currentChatRoomID,
  currentChatRoom: state.messenger.currentChatRoom,
  usersChatRoomsID: state.messenger.usersChatRoomsID,
  currentChatRoomName: state.messenger.currentChatRoomName,
});

const mapDispatchToProps = {
  setIsSidebarOpen,
  setCurrentChatRoomID,
  setCurrentChatRoom,
  setCurrentChatRoomName,
  setUsersChatRoomsID,
};

const Messenger = (props) => {
  const [sidebarInlineStyles, setSideStyles] = useState({ display: 'block' });
  const [areSettingsShowing, setAreSettingsShowing] = useState(false);
  const [isAddChatroomErrors, setIsAddChatroomErrors] = useState(false);
  const [addChatroomErrorFeedback, setAddChatroomErrorFeedback] = useState('');

  useEffect(() => {
    // updates the chatroom every half a second so users can see new messages
    // eslint-disable-next-line no-use-before-define
    const intervalForUpdateChatRoom = setInterval(() => { checkForNewMessageAndChatRooms(); }, 500);
    // on load of messenger make sure the user is logged in.
    // eslint-disable-next-line no-use-before-define
    intentionalAndForcedUserLogout();
    // get and set state with an array of all the chatroom's the authenticated user is in
    // eslint-disable-next-line no-use-before-define
    if (props.authenticatedUserID) { getChatRoomIDsForAuthenticatedUser(); }

    return () => {
      // removes the interval component did mount/ checkForNewMessageAndChatRooms.
      clearInterval(intervalForUpdateChatRoom);
    };
  });

  // check that the user is logged in and if passed true for logout logs the user out
  const intentionalAndForcedUserLogout = (isUserLoggingOut) => {
    if (isUserLoggingOut === null || isUserLoggingOut === undefined || isUserLoggingOut === false) {
      // on login make sure all required values are set. If one value is not set force logout.
      if (!props.authenticatedUsername || !props.isAuthenticated || !props.authenticatedUserID) {
        props.setAuthentication(false);
        props.setAuthenticatedUserID(null);
        props.setAuthenticatedUsername(null);
        props.setUsersChatRoomsID(null);
      }
    } else {
      /* Logout */
      props.setAuthentication(false);
      props.setAuthenticatedUserID(null);
      props.setAuthenticatedUsername(null);
      props.setUsersChatRoomsID(null);
    }
  };

  // onClick of hamburger/X. show/Hide the sidebar
  const toggleSidebarOfConversations = (closeSidebar) => {
    // the x in the sidebar for mobile was clicked then closeSidebar == true
    if (closeSidebar === true) {
      props.setIsSidebarOpen(false);
      // wait for animation to complete.
      setTimeout(() => setSideStyles({ display: 'none' }), 1000);
    } else if (props.isSidebarOpen) {
      props.setIsSidebarOpen(false);
      // wait for animation to complete.
      setTimeout(() => setSideStyles({ display: 'none' }), 1000);
    } else {
      setSideStyles({ display: 'block' });
      // wait for the animation
      setTimeout(() => props.setIsSidebarOpen(true), 150);
    }
  };

  // once auth user sends message. Validates Message, add to the DB.
  // eslint-disable-next-line no-shadow
  const newMessage = async (newMessage) => {
    // messageChatRoom = selected chatroom object with all the messages
    const messagesInCurrentChatRoom = Object.entries(props.currentChatRoom);
    let oldAuthenticatedUserMessages = [];
    let updatedAuthenticatedUserMessages = [];
    let nextMsgNum;
    try {
      // nextMsgNum is the number of all the messages sent by auth user and recipient plus one.
      nextMsgNum = await axios.get(`chatRooms/${props.currentChatRoomID}/nextMsgNum.json`);
      nextMsgNum = nextMsgNum.data;
      // eslint-disable-next-line no-console
    } catch (error) { console.log(error); }

    // 'chatRooms/' + props.currentChatRoomID + '/nextMsgNum.json'
    if (newMessage.length > 0 && newMessage.length < 2000 && props.currentChatRoom != null) {
      // gets old messages not included the new message they are trying to send
      messagesInCurrentChatRoom.forEach((user) => {
        if (user[0] === (`u${props.authenticatedUserID}`)) {
          // in this if user[0] is "u" + auth userID. user[1] is auth users messages
          oldAuthenticatedUserMessages = user[1];
        }
      });
      /// adds new message to old message array
      updatedAuthenticatedUserMessages = [...Object.values(oldAuthenticatedUserMessages)];
      updatedAuthenticatedUserMessages[nextMsgNum] = DOMPurify.sanitize(newMessage);
      updatedAuthenticatedUserMessages[nextMsgNum] = updatedAuthenticatedUserMessages[nextMsgNum].replace(/[^\w\s!?$:&.,\-()]/g, '');
      nextMsgNum++;
      let updatedMessagesInCurrentChatRoom = [...messagesInCurrentChatRoom];
      // adds update message array with new message to the chatRoom Object that will be uploaded to firebase.
      updatedMessagesInCurrentChatRoom.forEach((property) => {
        if (property[0] === (`u${props.authenticatedUserID}`)) {
          // eslint-disable-next-line no-param-reassign
          property[1] = updatedAuthenticatedUserMessages;
        } else if (property[0] === 'nextMsgNum') {
          // eslint-disable-next-line no-param-reassign
          property[1] = nextMsgNum;
        }
      });
      // converts the array to an object
      updatedMessagesInCurrentChatRoom = Object.fromEntries(updatedMessagesInCurrentChatRoom);
      axios.put(`chatRooms/${props.currentChatRoomID}.json`, updatedMessagesInCurrentChatRoom);
      // update our current chatRoom
      props.setCurrentChatRoom(updatedMessagesInCurrentChatRoom);
    }
  };

  // gets array of chatRoomsID auth user is in. if its different then our current UsersChatRoomsID then update state. called by mount and update
  const getChatRoomIDsForAuthenticatedUser = () => {
    if (props.authenticatedUserID) {
      axios.get(`usersChatRooms/ucr${props.authenticatedUserID}/chatRooms.json`).then(
        (newUsersChatRoomsID) => {
          // convert array to object. then stringify object. if strings dont eqaul chatroom has been added or delted. then update.
          if (JSON.stringify({ ...newUsersChatRoomsID.data }) !== JSON.stringify({ ...props.usersChatRoomsID })) {
            props.setUsersChatRoomsID(newUsersChatRoomsID.data);
          }
        },
      );
    }
  };

  /* checks for new messages/new chatroom's from other users */
  const checkForNewMessageAndChatRooms = () => {
    if (props.currentChatRoomID && props.currentChatRoom !== 'Unanimity') {
      const oldChatRoomID = props.currentChatRoomID;
      // get the messages for the current chatroom
      axios.get(`chatRooms/${oldChatRoomID}.json`).then((newChatRoom) => {
        // convert object to string the see if strings equal to see if we need to update
        if (JSON.stringify(props.currentChatRoom) !== JSON.stringify(newChatRoom.data) && oldChatRoomID === props.currentChatRoomID) {
          props.setCurrentChatRoom(newChatRoom.data);
        }
      });
    }
    // check for new chatroom's in the db
    getChatRoomIDsForAuthenticatedUser();
    if (props.isAuthenticated === false) { props.authLogout(); }
  };

  // gets selected chatRoom users(cru). gets name of recipient. then sets currentChatRoomName to recipients name. called by setCurrentChatRoom
  const getCurrentChatRoomName = (ChatRoomID) => {
    if (ChatRoomID) {
      axios.get(`chatRoomsUsers/cru${ChatRoomID}/users.json`).then(
        (e) => {
          if (e.data) {
            const authenticatedUserIndex = e.data.indexOf(props.authenticatedUserID);
            e.data.splice(authenticatedUserIndex, 1);
            axios.get(`users/u${e.data[0]}/userName.json`).then((event) => {
              props.setCurrentChatRoomName(event.data);
            });
          } else {
            props.setCurrentChatRoomName('Unanimity');
          }
        },
      );
    }
  };

  // called by sidebar on click of a chatroom. calls functions to set chatRoom name and set state for CurrentChatRoomID and CurrentChatRoom
  const getCurrentChatRoom = (ChatRoomID) => {
    getCurrentChatRoomName(ChatRoomID);
    axios.get(`chatRooms/${ChatRoomID}/.json`).then(
      (chatRoomMsg) => {
        props.setCurrentChatRoomID(ChatRoomID);
        props.setCurrentChatRoom(chatRoomMsg.data);
      },
    );
  };

  const newChatRoom = (event, recipientName) => {
    let sanitizedRecipientName = DOMPurify.sanitize(recipientName);
    sanitizedRecipientName = sanitizedRecipientName.replace(/[^\w^!?$]/g, '');
    sanitizedRecipientName = sanitizedRecipientName.toLowerCase();
    let recipientID = null;
    let newChatRoomID = null;
    // updatedChatRoomID is the id that comes after this newChatRoom Id. used to update the db.
    let updatedChatRoomID = null;
    let newChatRoomObject = {};
    // will be the new updated userChatRooms/ucr+userID/chatRooms.json for the authenticated user. will equal array of chatRoomsID that the user is apart of
    let updatedAuthUserChatRoomsID = [];
    let updatedRecipientUserChatRoomsID = [];
    // object that will be inserted in the newly created ChatRoomUsers/newChatRoomId.json.
    let newChatRoomUsersObject = {};

    // adds references in db for a new chatroom.
    const addChatRoomReferences = () => {
      setIsAddChatroomErrors(false);
      setAddChatroomErrorFeedback('');
      // if recipientID was set. the user they are trying to start a conversation with exists.
      if (recipientID !== null) {
        newChatRoomObject = { nextMsgNum: 2 };
        // adds u+userid to the chatroom object with u+userID as the property name. then sets the value to an array with a welcome message.
        newChatRoomObject[`u${props.authenticatedUserID}`] = [(`${props.authenticatedUsername} has joined the chat!`)];
        newChatRoomObject[`u${recipientID}`] = [null, (`${sanitizedRecipientName} has joined the chat!`)];
        axios.get('chatRooms/nextChatRoomID.json').then(
          (nextChatRoomId) => {
            // --------- start create the chatroom in chatRooms ---------
            newChatRoomID = nextChatRoomId.data;
            if (newChatRoomID) {
              axios.put(`chatRooms/${newChatRoomID}.json`, newChatRoomObject).catch(
                () => {
                  setIsAddChatroomErrors(true);
                  setAddChatroomErrorFeedback('failed to add. Please try agin.', null);
                },
              );
              // eslint-disable-next-line radix
              updatedChatRoomID = parseInt(newChatRoomID);
              // increment the ID to find the Id after newID
              updatedChatRoomID++;
              axios.put('chatRooms/nextChatRoomID.json', updatedChatRoomID).catch(
                (error) => { setIsAddChatroomErrors(true); setAddChatroomErrorFeedback(`failed to update the nextChatRoomID in the DB. ${error}`, null); },
              );
            } else {
              setIsAddChatroomErrors(true);
              setAddChatroomErrorFeedback('ChatroomId is null', null);
            }
            // --------- end create the chatroom in chatRooms ---------

            // --------- start update usersChatRooms for authenticated user and recipient ---------
            // they have other chatRooms
            if (props.usersChatRoomsID && props.usersChatRoomsID.length !== 0) {
              // gets latest data this prevents from add chatroom adding chatroom references to deleted chatroom
              axios.get(`usersChatRooms/ucr${props.authenticatedUserID}/chatRooms.json`).then(
                (e) => {
                  getChatRoomIDsForAuthenticatedUser();
                  updatedAuthUserChatRoomsID = e.data;
                  updatedAuthUserChatRoomsID.push(newChatRoomID);
                  const chatRooms = updatedAuthUserChatRoomsID;
                  axios.put(`usersChatRooms/ucr${props.authenticatedUserID}.json`, { chatRooms })
                    .then(() => setAddChatroomErrorFeedback('Chatroom added!'))
                    .catch(
                      (error) => {
                        const errorMessage = `Failed to update Authenticated usersChatRooms. ${DOMPurify.sanitize(error)}`;
                        setIsAddChatroomErrors(true);
                        setAddChatroomErrorFeedback(errorMessage);
                      },
                    );
                },
              );
            } else {
              // add their first chatroom
              updatedAuthUserChatRoomsID = [];
              updatedAuthUserChatRoomsID.push(newChatRoomID);
              const chatRooms = updatedAuthUserChatRoomsID;
              axios.put(`usersChatRooms/ucr${props.authenticatedUserID}.json`, { chatRooms }).catch(
                (error) => {
                  const errorMessage = `Failed to update Authenticated usersChatRooms. ${DOMPurify.sanitize(error)}`;
                  setIsAddChatroomErrors(true);
                  setAddChatroomErrorFeedback(errorMessage);
                },
              );
            }

            axios.get(`usersChatRooms/ucr${recipientID}/chatRooms.json`).then(
              (recipientsChatRoom) => {
                if (recipientsChatRoom.data) {
                  updatedRecipientUserChatRoomsID = recipientsChatRoom.data;
                } else {
                  updatedRecipientUserChatRoomsID = [];
                }
                updatedRecipientUserChatRoomsID.push(newChatRoomID);
                const chatRooms = updatedRecipientUserChatRoomsID;
                axios.put(`usersChatRooms/ucr${recipientID}.json`, { chatRooms }).then(
                  () => {
                    // auth and recipient have new chatroom so update auth user sidebar with new chatroom
                    getChatRoomIDsForAuthenticatedUser();
                  },
                ).catch(
                  (error) => {
                    const errorMessage = `Failed to update Recipient usersChatRooms. ${DOMPurify.sanitize(error)}`;
                    props.showHideCustomAlert(errorMessage, null);
                  },
                );
              },
            );
            // --------- end of userChatRooms update ---------

            // --------- start of update chatRoomUser ---------
            newChatRoomUsersObject = {
              chatRoomID: newChatRoomID,
              users: [props.authenticatedUserID, recipientID],
            };
            axios.put(`chatRoomsUsers/cru${newChatRoomID}.json`, newChatRoomUsersObject).catch(
              (error) => {
                const errorMessage = `Failed to add ChatRoom to ChatRoomUsers. ${DOMPurify.sanitize(error)}`;
                setIsAddChatroomErrors(true);
                setAddChatroomErrorFeedback(errorMessage);
              },
            );
            // --------- end of update chatRoomUsers ---------
          },
        ).catch(
          // if error occurred in axios get nextChatRoomID from chatRooms/nextChatRoomID.json
          (error) => {
            const errorMessage = `Error occurred while trying to set ChatRoomID. ${DOMPurify.sanitize(error)}`;
            setIsAddChatroomErrors(true);
            setAddChatroomErrorFeedback(errorMessage);
          },
        );
      }
    };

    if (event) { event.preventDefault(); }
    // --------- start check if recipients name exists. set recipientsId if it exists ---------
    if (sanitizedRecipientName !== null && sanitizedRecipientName !== props.authenticatedUsername && sanitizedRecipientName) {
      axios.get(`userIDByUsername/${sanitizedRecipientName}.json`).then(
        (response) => {
          recipientID = response.data;
          if (recipientID === null) {
            setIsAddChatroomErrors(true);
            setAddChatroomErrorFeedback('User not found!');
          }

          // --------- Check to see if auth user already has a chatroom with recipient ---------
          if (recipientID !== null) {
            if (props.usersChatRoomsID !== null && props.usersChatRoomsID.length !== 0) {
              props.usersChatRoomsID.forEach((chatRoomID) => {
                // for the current chatRoom get the users in that chatroom
                axios.get(`chatRoomsUsers/cru${chatRoomID}.json`).then(
                  (chatRoomUsers) => {
                    if (chatRoomUsers.data) {
                      let hasChatRoomWithRecipient = false;
                      // see if auth user has a chatroom with recipient already
                      for (let i = 0; i < Object.values(chatRoomUsers.data.users).length; i++) {
                        const userID = chatRoomUsers.data.users[i];
                        if (recipientID === userID) {
                          setIsAddChatroomErrors(true);
                          setAddChatroomErrorFeedback('Chatroom already exist', null);
                          hasChatRoomWithRecipient = true;
                          break;
                        }
                      }
                      // if the auth user dose not have a chatroom with the recipient add the chatroom
                      if (recipientID !== null && hasChatRoomWithRecipient === false) {
                        addChatRoomReferences();
                      }
                    }
                  },
                );
              });
            } else {
              /* no chatroom for the recipient to be in so just add the chatroom */
              addChatRoomReferences();
            }
          }
        },
      ).catch(
        () => {
          setIsAddChatroomErrors(true);
          setAddChatroomErrorFeedback('User not found');
        },
      );
    } else {
      // eslint-disable-next-line no-lonely-if
      if (sanitizedRecipientName === props.authenticatedUsername) {
        setIsAddChatroomErrors(true);
        setAddChatroomErrorFeedback('Can not add yourself');
      } else {
        setIsAddChatroomErrors(true);
        setAddChatroomErrorFeedback("Recipient's name is required");
      }
    }
    // --------- end of check recipient name ---------
  };

  const removeChatRoom = (removeChatRoomID) => {
    // will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
    let removeChatRoomUsers = [];
    // index of the chatRoom we need to remove from userChatRoom ( ucr )
    let userChatRoomIndex = null;
    const empty = {};
    if (removeChatRoomID !== null) {
      // get the chatRoomUsers ID so that we can use it to remove the chatRoom from usersChatRoom.
      axios.get(`chatRoomsUsers/cru${removeChatRoomID}/users.json`).then(
        (chatRoom) => {
          if (chatRoom.data !== null) {
            removeChatRoomUsers = chatRoom.data;
            // -------- start remove the chatRoom from the ChatRoomUsers --------
            // deletes data by setting it equal to an empty object. firebase then automatically removes empty objects
            axios.put(`chatRoomsUsers/cru${removeChatRoomID}.json`, empty).then(() => {
              props.showHideCustomAlert('chatroom successfully removed!', true);
              if (props.currentChatRoomID === removeChatRoomID) {
                // set the current chatroom to Unanimity instead of the chatroom that dose not exist
                props.setCurrentChatRoomName('Unanimity');
              }
              // eslint-disable-next-line no-console
            }).catch((e) => { console.log(`error overriding/deleting chatRoomUsers for ${removeChatRoomID}axios error: ${e}`); });
            // -------- end of remove the chatRoom from the chatRoomUsers --------

            // -------- start of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------
            if (removeChatRoomUsers) {
              removeChatRoomUsers.forEach((user) => {
                // get all of the users chatroom's for a specific user
                axios.get(`usersChatRooms/ucr${user}/chatRooms.json`).then(
                  (userChatRoomIds) => {
                    // eslint-disable-next-line no-param-reassign
                    userChatRoomIds.data = Object.values(userChatRoomIds.data);
                    userChatRoomIndex = userChatRoomIds.data.indexOf(removeChatRoomID);
                    // 0 is a valid index but zero equals false by default
                    if (userChatRoomIndex || userChatRoomIndex === 0) {
                      userChatRoomIds.data.splice(userChatRoomIndex, 1);
                      if (Object.values(userChatRoomIds.data).length === 0) {
                        // User has only one chatroom. db requires object to be passed. cant not pass null so we pass empty object. which firebase auto deletes
                        axios.put(`usersChatRooms/ucr${user}/chatRooms.json`, empty).then(
                          () => {
                            // causes sidebar to update
                            getChatRoomIDsForAuthenticatedUser();
                          },
                          // eslint-disable-next-line no-console
                        ).catch((error) => { console.log(error); });
                      } else {
                        const chatRooms = userChatRoomIds.data;
                        axios.put(`usersChatRooms/ucr${user}.json`, { chatRooms }).then(
                          () => {
                            // causes sidebar to update
                            getChatRoomIDsForAuthenticatedUser();
                          },
                          // eslint-disable-next-line no-console
                        ).catch((error) => { console.log(error); });
                      }
                    }
                  },
                  // eslint-disable-next-line no-console
                ).catch((error) => console.log(error));
              });
            }
            // -------- end of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------

            // -------- start of remove chatRoom from chatRooms --------
            // deletes data by setting it to empty object. then firebase removes it completely
            axios.put(`chatRooms/${removeChatRoomID}.json`, empty);
            // -------- end of remove chatRoom from chatRooms --------
          }
        },
      ).catch(
        (error) => {
          setAddChatroomErrorFeedback(`Could not find Chatroom that you requested to be removed. ${error}`);
        },
      );
    } else {
      setAddChatroomErrorFeedback('removeChatRoomID was null in removeChatRoom function. function was canceled.');
    }
  };

  let mainContentInlineStyles = {};
  // sidebar closed make main content (the chatRoom area) expand entire width
  if (!props.isSidebarOpen) {
    mainContentInlineStyles = {
      transform: 'translateX( -20vw )',
      width: '100vw',
      height: '100vh',
    };
  }
  // prevents sidebar from erroring out by returning an empty array instead of null or undefined.
  let sidebarUsersChatRoomsID;
  if (props.usersChatRoomsID !== null) {
    sidebarUsersChatRoomsID = props.usersChatRoomsID;
  } else {
    sidebarUsersChatRoomsID = [];
  }
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.sidebarGrid} style={sidebarInlineStyles}>
          <SidebarOfConversations
            authenticatedUsername={props.authenticatedUsername}
            currentChatRoomID={props.currentChatRoomID}
            usersChatRoomsID={sidebarUsersChatRoomsID}
            userID={props.authenticatedUserID}
            setCurrentChatRoomID={getCurrentChatRoom}
            isSidebarOpen={props.isSidebarOpen}
            addChatRoom={newChatRoom}
            deleteChatRoom={removeChatRoom}
            toggleSidebar={toggleSidebarOfConversations}
            setAreSettingsShowing={setAreSettingsShowing}
            addChatroomErrorFeedback={addChatroomErrorFeedback}
            isAddChatroomErrors={isAddChatroomErrors}
          />
        </div>
        <div className={styles.mainContentGrid} style={mainContentInlineStyles}>
          <MainContent
            setIsAppLightTheme={props.setIsAppLightTheme}
            newMessage={newMessage}
            currentChatRoom={props.currentChatRoom}
            currentChatRoomName={props.currentChatRoomName}
            authUsername={props.authenticatedUsername}
            authUID={props.authenticatedUserID}
            toggleSidebar={toggleSidebarOfConversations}
            isSidebarOpen={props.isSidebarOpen}
            intentionalAndForcedUserLogout={intentionalAndForcedUserLogout}
            areSettingsShowing={areSettingsShowing}
            setAreSettingsShowing={setAreSettingsShowing}
          />
        </div>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
