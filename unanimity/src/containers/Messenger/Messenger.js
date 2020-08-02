import React, { Component, Fragment } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.scss';
import DOMPurify from 'dompurify';
import Alert from '../../components/Alert/Alert';

class Messenger extends Component {

    state = {

        authenticated: null,
        userID: null,
        usersChatRoomsID: [],
        currentChatRoom: {},
        currentChatRoomID: null,
        currentChatRoomName: 'Unanimity',
        username: null,
        showSidebar: true,
        sidebarInlineStyles: {
            display: 'block'
        },
        renderHeader: false,
        notification: null

    }

    componentDidMount = ( ) => {

        //every second update the current chatroom. this make sure we can see if the other user sent a message.
        this.interval = setInterval( ( ) => {

            //if a chatroom has been selected
            if ( this.state.currentChatRoomID && this.state.currentChatRoom !== 'Unanimity' ) {
               
                let oldID = this.state.currentChatRoomID;

                //get the messages for the current chatroom                
                axios.get( 'chatRooms/' + oldID + '.json' ).then( ( res ) => {

                    //if the current chatroom has not changes since we started and there is new messages update the state
                    if( this.state.currentChatRoom !== res.data && oldID === this.state.currentChatRoomID ){

                        this.setState( { currentChatRoom: res.data } );

                    }//if new messages and same chatroom

                } );//axios get messages

            }//if a chatroom is selected

            //check for new chatroom's in the db
            this.setUsersChatRoomsID( );

            //if authentication get set to false
            if ( this.state.authenticated === false ) {

                //set auth in authentication to false so that it prevents from being able to use app
                this.props.authLogout();

            }

        }, 500);


        //on load set authentication
        this.setAuthentication();


        if ( this.state.userID ) {

            //get and set state with an array of all the chatroom's the authenticated user is in
            this.setUsersChatRoomsID( );

        }

    }

    componentDidUpdate = ( prevProps, prevState ) => {

        //if the userID in the state is not the same.
        //prevents infinite loop
        if ( prevState.userID !== this.state.userID ) {

            this.setUsersChatRoomsID( );

        }


    }

    componentWillUnmount( ) {

        //removes the setTimeout from the component did mount.
        clearInterval( this.interval );

    }

    closeNotification = ( ) => {

        this.setState( { notification: null } );
        
    }

    setNotification = ( message ) => {

        //sanitize the message and remove malicious code
        let sanitizedMessage = DOMPurify.sanitize( message );
        //only allows words, spaces, !, ?, $
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');

        let alertComponent = <Alert alertMessage = { sanitizedMessage } alertClose = { this.closeNotification } />;
        this.setState( { notification: alertComponent } );

    }

    /* handles logging in and out */
    setAuthentication = ( logout ) => {
        
        //login
        if(logout === null || logout === undefined) {
            /*
            if any of the bellow values is not set then auth is set to false. in component did mount their is a interval where it check to see if they are still authenticated. 
            if auth === false then it will handle force logging them out for security.
            */
            this.props.authenticated ? this.setState( { authenticated: this.props.authenticated } ) : this.setState( {authenticated: false } );

            this.props.userID ? this.setState( { userID: this.props.userID } ) : this.setState( { userID: null, authenticated: false } );

            this.props.username ? this.setState( { username: this.props.username } ) : this.setState( { username: null, authenticated: false } );
             
        } else /* Logout */  {

            //set messenger state to be logged out
            this.setState ({

                authenticated: false,
                userID: this.props.userID,
                username: null

            });//set state

            //set authentication component state to be logged out. 
            //This is the component that actually handles not allowing them to access the app while logged out
            this.props.authLogout();

        }//login/logout if

    }

    //gets array of chatRoomsID that the user is in and sets userChatRoomsID in state. called by mount and update
    setUsersChatRoomsID = () => {
      
        //ucr stands for user Chat Room.
        //get array that contains all the chatRoomIDs that the user is a part of
        if ( this.state.userID ) {

            //get auth user ucr
            axios.get( 'usersChatRooms/ucr' + this.state.userID + '/chatRooms.json' ).then(
                ( e ) => {
            
                    //if the data has changed update it.
                    if ( e.data !== this.state.usersChatRoomsID ) {
    
                        this.setState( {

                            usersChatRoomsID: e.data

                        } );
    
                    }//if data has changed
    
                }
            );//axios get ucr

        }//if this.state.userID
       
    }

    //called by setCurrentChatRoom
    setCurrentChatRoomName = ( ChatRoomIDForName ) => {
        /*
            This function only works for chatroom's that contain two people. you and a recipient. 
        */
        if ( ChatRoomIDForName ) {

            //for the passed in chatRoomName get the users in that chatRoom
            axios.get( 'chatRoomsUsers/cru' + ChatRoomIDForName + '/users.json' ).then(
                ( e ) => {

                    if ( e.data ) {

                        //find index of our id in the array of users.
                        let userIndex = e.data.indexOf(this.state.userID);

                        //remove ourself form the array.
                        e.data.splice(userIndex, 1);

                        //for recipients in the array set them as chatRoom name
                        e.data.forEach( ( singleUserID ) => {

                            //get username by id.
                            axios.get( 'users/u' + singleUserID + '/userName.json' ).then( ( e ) => {

                                //set the chatroom name to the users name
                                this.setState( {

                                    currentChatRoomName: e.data

                                } )

                            } )

                        } ); //e.data.foreach

                    } //if e.data
                    else {

                        //no chatroomName so set the chatroom to be the placeholder Unanimity
                        this.setState( {
                            currentChatRoomName: 'Unanimity'
                        } )

                    }

                } //axios get get users in the chatRoom .then function

            ); //axios get get users in the chatRoom

        } //if chatRoomIdForName

    }

    //called by sidebar on click of a chatroom
    //sets currentChatRoom and currentChatRoomID
    setCurrentChatRoom = ( setChatRoomID ) => {
        
        //calls the function to start setting the current chatroom Name
        this.setCurrentChatRoomName( setChatRoomID );

        //gets object with messages for each user and next message number
        axios.get( 'chatRooms/' + setChatRoomID + '/.json' ).then(

            ( e ) => {
                
                this.setState( {
                    currentChatRoom: e.data,
                    currentChatRoomID: setChatRoomID
                } )

            } //.then function

        ); //axios get currentChatRoom

    }

    //called onClick of the hamburger in the malcontent/header.js
    setShowSidebar = ( closeOnly ) => {

        //the x in the sidebar for mobile was clicked then close only == true
        if( closeOnly === true ){

            //set the sidebar to be closed
            this.setState( {

                showSidebar: false

            } );

            //wait for the set state and animation to complete then make the sidebar disappear completely 
            setTimeout( ( ) => {

                this.setState( {
                    sidebarInlineStyles: {
                        display: 'none'
                    }
                } );

            }, 1000);

        } else {

                //if sidebar was showing and we click hamburger. close the sidebar
                if ( this.state.showSidebar ) {

                    this.setState( {
                        showSidebar: false
                    } );
        
                    //wait for the set state and sidebar animations to complete then remove the sidebar completely
                    setTimeout( ( ) => {
        
                        this.setState({
                            sidebarInlineStyles: {
                                display: 'none'
                            }
                        });
        
                    }, 1000);
        
        
                }
                //if sidebar was closed and we clicked the hamburger open the sidebar
                else {
                    //set it to be visible
                    this.setState( {
                        sidebarInlineStyles: {
                            display: 'block'
                        }
                    } );
                    
                    //wait for it to be visible then set it to be true
                    setTimeout( ( ) => {
        
                        this.setState( {
                            showSidebar: true
                        } );
        
                    }, 150);
        
                }

        }//else close only

    }//setShowSidebar

    //called by input once a user enters a new message
    newMessage = ( newMessage ) => {

        //current chat room object with all the messages
        let messageChatRoom = Object.entries( this.state.currentChatRoom );

        let authenticaedUserMessageOld = [ ];
        let authenticaedUserMessageCombined = [ ];
        let nextMsgNum = null;

        //set maximum allowed message length. make sure we have a message. and make sure a chatRoom is selected
        if ( newMessage.length > 0 && newMessage.length < 2000 && this.state.currentChatRoom != null ) {

            //set authenticatedUserMessageOld and nextMSg number from this.state.currentChatRoom
            Object.entries( this.state.currentChatRoom).forEach( ( user ) => {
             
                //if the message user id is the current authenticated user id
                if ( user[0] === ( "u" + this.state.userID ) ) {

                    //in this if user[0] is "u" + userID of the message. user[1] is message  (u +userID, Message).
                    //set auth old messages to auth user messages
                    authenticaedUserMessageOld = user[ 1] ;

                } else if ( user[0] === "nextMsgNum" ) {

                    //user[1] the value of nextMsgNum
                    nextMsgNum = user[ 1 ];

                }

            }) //end of foreach that sets old authenticatedUserMessageOld and nextMSg

            //add new message to to old messages
            authenticaedUserMessageCombined = [ ...Object.values( authenticaedUserMessageOld ) ];
            //make sure that it keeps the order in the arrays. make it the nextMsgNum position in the array. array[nextMsgNum]
            authenticaedUserMessageCombined[ nextMsgNum ] = DOMPurify.sanitize(newMessage);
            authenticaedUserMessageCombined[ nextMsgNum ] =  authenticaedUserMessageCombined[ nextMsgNum ].replace(/[^\w\s!?$]/g,'');
            //increment nextMsgNum by 1
            if ( nextMsgNum ) {

                nextMsgNum++;

            }

            //set messageChatRoom to all the new data
            //messageChatRoom Contains the other user messages. This is required so that when we put the data on the db that the other user messages are not removed
            messageChatRoom.forEach( ( property ) => {

                //property[0] is the name of the property 
                //if this the current authenticaed user messages
                if ( property[ 0 ] === ( "u" + this.state.userID ) ) {

                    //set our current user messages to combined messages new and old.
                    //property[ 1 ] is the array of out user messages
                    property[1] = authenticaedUserMessageCombined;

                } else if ( property[ 0 ] === "nextMsgNum" ) {

                    //property[ 1 ] is the old nextMsgNum before the increment of 1.
                    property[ 1 ] = nextMsgNum;

                }

            }) //foreach that sets messageChatRoom to new data values

            //convert our finished data from an array back to object to match the DB structure
            messageChatRoom = Object.fromEntries( messageChatRoom );

            //update the DB with all the new data. 
            axios.put( "chatRooms/" + this.state.currentChatRoomID + ".json", messageChatRoom );
            //update our current chatRoom
            this.setState( {
                currentChatRoom: messageChatRoom
            } );

        } //end of newMessage validation if

    }//new message function

    //add onSubmission of popUp for addChatRoom in sidebar component
    newChatRoom = ( event, recipentName ) => {

        //sanitize data 
        recipentName = DOMPurify.sanitize( recipentName );
        recipentName = recipentName.replace(/[^\w^!?$]/g,'');
        recipentName = recipentName.toLowerCase();

        //id of the person we are sending to
        let recipentID = null;

        //the chatroom id that will be used for the creation of the new chatroom
        let newChatRoomID = null;

        //chatRoomID after our new chatroom. used for updating db after we add our new chatroom
        let updatedChatRoomID = null;
        let newChatRoomObject = { };

        //will be the new updated userChatRooms/ucr+userID/chatRooms.json for the authenticated user. will equal array of chatRoomsID that the user is apart of
        let updatedAuthUserChatRoomsID = [ ];
        let updatedRecipientUserChatRoomsID = [ ];

        //object that will be inserted in the newly created ChatRoomUsers/newchatRoomid.json.
        let newChatRoomUsersObject = { };

        //adds references in db for a new chatroom. this was required to prevent from redundant code
        let addChatRoomReferances = ( ) => {

            // --------- start create the chatroom and add chatroom to all tables for reference ---------

            //if userID was set. username was found
            if ( recipentID !== null ) {

                //sets newChatRoomObject. object will be added to db as a new chatroom
                newChatRoomObject = {

                    nextMsgNum: 2,

                };

                //adds u+userid to the chatroom object with u+userID as the property name. then sets the value to an array with a welcome message.
                newChatRoomObject[ "u" + this.state.userID ] = [ ( this.state.username + " has joined the chat!" ) ];
                newChatRoomObject[ "u" + recipentID ] = [ null, ( recipentName + " has joined the chat!" ) ];

                //gets next available chatRoomID
                axios.get( 'chatRooms/nextChatRoomID.json' ).then(

                    ( e ) => {
                        //--------- start create the chatroom in chatRooms ---------
                        //sets newChatroomID to next available chat room id
                        newChatRoomID = e.data;

                        //check if we have a newChatRoomID
                        if ( newChatRoomID ) {

                            //add the newChatRoomObject to the DB. under ChatRooms/newChatRoomID.json
                            axios.put( 'chatRooms/' + newChatRoomID + '.json', newChatRoomObject ).catch(
                                ( error ) => {

                                    //failed to add the chatroom to the db
                                  
                                    this.setState( { notification: [<Alert alertMessage = "failed to add chat room. Please try agin." alertClose = { this.closeNotification } />] } );

                                }
                            ); //axios put newChatRoomObject

                            //find the chatRoomID that comes after our newChatRoomID
                            //sometimes it is a string so convert it to a int
                            updatedChatRoomID = parseInt( newChatRoomID );

                            //increment the ID to find the Id after newID
                            updatedChatRoomID++;

                            //set the db nextChatRoomID to the updatedChatRoomID
                            axios.put( 'chatRooms/nextChatRoomID.json', updatedChatRoomID ).catch(
                                ( error ) => {

                                    console.log( "failed to update the nextChatRoomID in the DB ", error );

                                }
                            ); //axios put nextChatRoomID

                        } //if we have newChatRoomID 

                        //else we don't have a newChatRoomID
                        else {
                        
                            this.setState( { notification: [<Alert alertMessage = "Could not determine the chat room id. Please try agin." alertClose = { this.closeNotification } />] } );

                        } //if we have a newChatRoomID
                        //--------- end create the chatroom in chatRooms ---------


                        // --------- start update usersChatRooms for authenticated user and recipent ---------

                        //start update for Authenticated user

                        if ( this.state.usersChatRoomsID ) {

                            //gets the latest data. this step prevents form add chatroom adding chatroom references to deleted chatroom
                            axios.get( 'usersChatRooms/ucr' + this.state.userID + '/chatRooms.json' ).then(
                                ( e ) => {

                                    this.setState( {
                                        usersChatRoomsID: e.data
                                    } ); //adds all chatrooms that authenticated user is in

                                    updatedAuthUserChatRoomsID = e.data;

                                    //add the newChatRoomID to the authenticated user chatRoomsID
                                    updatedAuthUserChatRoomsID.push( newChatRoomID );

                                    let chatRooms = updatedAuthUserChatRoomsID;
                                    //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                                    axios.put( 'usersChatRooms/ucr' + this.state.userID + '.json', {
                                        chatRooms
                                    } ).catch(
                                        ( error ) => {

                                            let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize( error ) ;
                                            this.setState( { notification: [<Alert alertMessage = { errorMessage } alertClose = { this.closeNotification } />] } );


                                        }
                                    ); //axios put updates Auth user in userChatRooms

                                }
                            ); //axios get() chatRoomIDs


                        } else {

                            updatedAuthUserChatRoomsID = [ ];
                            //add the newChatRoomID to the authenticated user chatRoomsID
                            updatedAuthUserChatRoomsID.push( newChatRoomID );

                            let chatRooms = updatedAuthUserChatRoomsID;
                            //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                            axios.put( 'usersChatRooms/ucr' + this.state.userID + '.json', {
                                chatRooms
                            } ).catch(
                                ( error ) => {

                                    
                                    let errorMessage = "Error. failed to update Authenticated usersChatRooms " + DOMPurify.sanitize( error ); 
                                    this.setState( { notification: [<Alert alertMessage = { errorMessage } alertClose = { this.closeNotification } />] } );

                                }
                            ); //axios put updates Auth user in userChatRooms

                        }


                        //end update for Authenticated user

                        //start update for Recipient

                        //get the recipients current/old ( without the new chatroom ) chatRooms from usersChatRooms
                        axios.get( 'usersChatRooms/ucr' + recipentID + '/chatRooms.json' ).then(
                            ( e ) => {

                                //if e.data is not null
                                if ( e.data ) {

                                    updatedRecipientUserChatRoomsID = e.data; //set URUCR-ID to the data 

                                } else {
                                    updatedRecipientUserChatRoomsID = [ ];
                                }
                                //add newChatRoomID to the recipients Chatroom
                                updatedRecipientUserChatRoomsID.push( newChatRoomID );

                                let chatRooms = updatedRecipientUserChatRoomsID;
                                //add the updated IDs to the DB
                                axios.put( 'usersChatRooms/ucr' + recipentID + '.json', {
                                    chatRooms
                                } ).then(
                                    ( ) => {
                                        // --------- start update Sidebar with new ChatRoom ---------

                                        //once the userChatRooms has been updated
                                        //updates the state for usersChatRoomsID which sidebar uses to load all the chatroom's for auth user.    
                                        this.setUsersChatRoomsID( );

                                        // --------- end update Sidebar with new ChatRoom ---------
                                    }
                                ).catch (
                                    ( error ) => {

                                      
                                        let errorMessage = "Error. failed to update Recipient usersChatRooms " + DOMPurify.sanitize( error ); 
                                        this.setState( { notification: [<Alert alertMessage = { errorMessage } alertClose = { this.closeNotification } />] } );

                                    }
                                ); //axios put of updated chatroomID

                            } //axios .then() of get old chatroom

                        ) //axios get recipient old chatroom

                        //end update for Recipient

                        // --------- end of userChatRooms update ---------


                        // --------- start Add chatRoomUsers for new chatRoom --------- 

                        //create proper structured object for db
                        newChatRoomUsersObject = {

                            chatRoomID: newChatRoomID,
                            users: [ this.state.userID, recipentID ]

                        }

                        //add chatRoomUsers to db
                        axios.put( 'chatRoomsUsers/cru' + newChatRoomID + '.json', newChatRoomUsersObject ).catch(
                            ( error ) => {
                             
                                let errorMessage = "Error. Failed to add ChatRoom to ChatRoomUsers " + DOMPurify.sanitize(error ); 
                                this.setState( { notification: [<Alert alertMessage = { errorMessage } alertClose = { this.closeNotification } />] } );

                            }
                        );//axios put

                        // --------- end of update chatRoomUsers ---------

                    } //end of axios get .then() next ChatRoom id .then()

                ).catch(
                    //if error occurred in axios get nextChatRoomID from chatRooms/nextChatRoomID.json
                    (error) => {
                        
                        let errorMessage = "Error occurred while trying to set ChatRoomID. Please try agin. " + DOMPurify.sanitize( error ); 
                        this.setState( { notification: [<Alert alertMessage = { errorMessage } alertClose = { this.closeNotification } />] } );

                    }

                ); //axios get next chatRoomID

            } //if recipentID set

            //--------- end create the chatroom and references ---------

        } //addChatRoomReferences

        //prevent browser reload
        if ( event ) {

            event.preventDefault( );

        }


        //--------- start check if recipients name exists. set recipientsId if it exists ---------
      
        if ( recipentName !== null && recipentName !== this.state.username && recipentName ) {

            //axios get userIDbyName for recipent
            axios.get( 'userIDByUsername/' + recipentName + '.json' ).then(
                ( response ) => {

                    //if username was found set userID
                    recipentID = response.data;

                    //if no recipentID
                    if ( recipentID === null ) {
                       
                        this.setState( { notification: [<Alert alertMessage = "User not found! 308" alertClose = { this.closeNotification } />] } );


                    } //if no recipentID

                    // --------- Check to see if auth user already has a chatroom with recipent ---------
                    // if we have a valid recipent
                    if ( recipentID !== null ) {

                        //if the auth user has other chatroom check to see if the recipent is in one of those
                        if ( this.state.usersChatRoomsID !== null ) {

                            //for each auth userChatroom. check to see if the recipent is in one of those chatroom's
                            this.state.usersChatRoomsID.forEach( ( chatRoomID ) => {

                                //for the current chatRoom get the users in that chatroom
                                axios.get( 'chatRoomsUsers/cru' + chatRoomID + '.json' ).then(
                                    ( result ) => {

                                        if ( result ) {

                                            let hasChatRoomWithRecipent = false;
                                            // see if auth user has a chatroom with recipent already
                                            for ( let i = 0; i < Object.values( result.data.users ).length; i++ ) {

                                                let userID = result.data.users[ i ];

                                                if ( recipentID === userID ) {
                                              
                                                    this.setState( { notification: [<Alert alertMessage = "You already have a chatroom with this user." alertClose = { this.closeNotification } />] } );

                                                    hasChatRoomWithRecipent = true;
                                                    break;

                                                }//if recipient is userID

                                            } //for result.data.users

                                            //if the auth user dose not have a chatroom with the recipent add the chatroom
                                            if (recipentID !== null && hasChatRoomWithRecipent === false) {

                                                addChatRoomReferances();

                                            }

                                        } //if result

                                    } ); //axios get chatRoomUsers for chatRoomID

                            } ); //foreach userChatRoomID

                        } /* no chatroom for the recipient to be in so just add the chatroom */
                        else {

                            addChatRoomReferances( );

                        } //if(this.state.usersChatRoomsID !== null )

                    } // if we have a username

                } //axios get userIDbyName for recipent .then()

            ).catch(

                ( error ) => {

                    //no username found alert user
                    this.setState( { notification:  <Alert alertMessage = "User not found! 685" alertClose = { this.closeNotification } />  } );

                }

            ); //axios get userIDbyName for recipent

        } //if( recipentName !== null && recipentName !== this.state.username ) 
        //username cannot be null and not ours
        else {

            this.setState( { notification: <Alert alertMessage = "Recipent\'s name is required and can\'t be your own name!" alertClose = { this.closeNotification } /> } );


        } //else ( recipentName !== null && recipentName !== this.state.username )

        // --------- end of check recipent name ---------

    } //newChatroom function

    removeChatRoom = ( removeChatRoomID ) => {
       
        //will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
        let removeChatRoomUsers = [ ];
        //index of the chatRoom we need to remove from userChatRoom ( ucr )
        let ucrIndex = null;
        //used for deleting the data. set the data to null ( empty object ) and firebase removes it completely
        let empty = { };

        //if chatRoomID is not null
        if ( removeChatRoomID !== null ) {
        
            //get the chatRoomUsers ID so that we can use it to remove the chatRoom from usersChatRoom.
            axios.get( 'chatRoomsUsers/cru' + removeChatRoomID + '/users.json' ).then(
                ( e ) => {
                    
                    //if there is no data then .catch() should inform the user something went wrong
                    //also if there is e.data then the chatroom existed
                    if ( e.data !== null ) {

                        removeChatRoomUsers = e.data;

                        // -------- start remove the chatRoom from the ChatRoomUsers --------


                        //deletes data by setting it equal to an empty object. firebase then automatically removes empty objects
                        axios.put( 'chatRoomsUsers/cru' + removeChatRoomID + '.json', empty ).then(( ) => {

                            //if deleted chatroom is the current chatroom
                            if(this.state.currentChatRoomID === removeChatRoomID){

                                //set the current chatroom to Unanimity instead of the chatroom that dose not exist
                                this.setState( {currentChatRoomName: 'Unanimity'} ); //reset the chatroom name to null

                            }

                        }).catch(
                            ( e ) => {

                                console.log("error overriding/deleting chatRoomUsers for " + removeChatRoomID + "axios error: " + e)

                            }
                        );

                        // -------- end of remove the chatRoom from the chatRoomUsers --------


                        // -------- start of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------

                        //if we have users to remove

                        if ( removeChatRoomUsers ) {

                            //for each user that we need to remove the chatroom from
                            removeChatRoomUsers.forEach( ( user ) => {
                              
                                //get all of the users chatroom's for a specific user
                                axios.get( 'usersChatRooms/ucr' + user + '/chatRooms.json' ).then(
                                    ( e ) => {
                                        
                                        //confirm that it is an array
                                        e.data = Object.values( e.data );
                                       
                                       //find the index of the chatRoomID we need to remove                                      
                                        ucrIndex = e.data.indexOf( removeChatRoomID );
                                       
                                        //if we have an index to remove.
                                        //0 is a valid index but zero equals false by default 
                                        if ( ucrIndex || ucrIndex === 0 ) {

                                            //removes the chatroom from the usersChatRooms                                     
                                            e.data.splice( ucrIndex, 1 );
                                           
                                            ///if e.data only contained one chatroom and we removed that chatroom then it would equal null
                                            if ( Object.values( e.data ).length === 0 ) {
                                           
                                                //update the userChatRooms to the empty object which just deletes the entire object.
                                                //if we used e.data which is just null it doesn't work. it requires an object to be passed in for the DB restraints

                                                //in if ucrIndex because if we don't remove anything no need to update the db
                                                //update users chatroom's in BD
                                                axios.put( 'usersChatRooms/ucr' + user + '/chatRooms.json', empty ).then(
                                                    ( ) => {

                                                        //causes sidebar to update
                                                        this.setUsersChatRoomsID( );

                                                    }
                                                ).catch(
                                                    ( error ) => {
                                                        console.log( error );
                                                    }
                                                );

                                            }
                                            //removed the chatroom and they still have other chatroom's
                                            else {
                                              
                                                let chatRooms = e.data;
                                                //in if ucrIndex because if we don't remove anything no need to update the db
                                                //update users chatroom's in BD
                                                axios.put( 'usersChatRooms/ucr' + user + '.json', {
                                                    chatRooms
                                                } ).then(
                                                    ( ) => {

                                                        //causes sidebar to update
                                                        this.setUsersChatRoomsID( );

                                                    }
                                                ).catch(
                                                    ( error ) => {
                                                        console.log( error );
                                                    }
                                                );

                                            } //else of if(e.data === null)


                                        } //if ucrIndex is not null


                                    } //axios then()
                                ).catch( ( e ) => {

                                    console.log( e )

                                } ); //axios get userChatRooms for user

                            }); //foreach chatRoomUsers

                        } //if have users to remove

                        // -------- end of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------


                        // -------- start of remove chatRoom from chatRooms -------- 

                        //deletes data by setting it to null. then firebase removes it completely
                        axios.put( 'chatRooms/' + removeChatRoomID + '.json', empty );

                        // -------- end of remove chatRoom from chatRooms -------- 

                    } //if e.data is not null

                }
            ).catch(
                ( error ) => {

                    this.setState( { notification: [<Alert alertMessage = "Could not find Chatroom that you requested to be removed." alertClose = { this.closeNotification } />] } );

                }
            ); //axios get chatRoomUsers

        } //if ChatroomID is not null 
        //chatRoomID Is null
        else {

            console.log( "removeChatRoomID was null in removeChatRoom function. function was canceled." );

        } //if chatroomID is not null

    }

    render () {

        let mainContentInlineStyles = { };
        //if sidebar is not showing 
        if ( !this.state.showSidebar ) {

            //make main content span entire width of screen
            mainContentInlineStyles = {

                transform: 'translateX( -20vw )',
                width: '100vw',
                height: '100vh',

            };

        }

        //prevents sidebar from erring out by returning an empty array instead of null or undefined.
        let sidebarusersChatRoomsID;
        if ( this.state.usersChatRoomsID !== null ) {

            sidebarusersChatRoomsID = this.state.usersChatRoomsID;

        } else {

            sidebarusersChatRoomsID = [ ];

        }

        return (

            <Fragment>

                { this.state.notification }

                <div className = { styles.layout } >

                <div className = { styles.sidebarGrid } style = { this.state.sidebarInlineStyles } >

                <Sidebar usersChatRoomsID = { sidebarusersChatRoomsID }
                    userID = { this.state.userID }
                    setCurrentChatRoomID = { this.setCurrentChatRoom }
                    showSidebar = { this.state.showSidebar }
                    addChatRoom = { this.newChatRoom }
                    deleteChatRoom = { this.removeChatRoom }
                    toggleSidebar = { this.setShowSidebar }
                />

                </div>

                <div className = { styles.mainContentGrid } style = { mainContentInlineStyles } >

                    <MainContent 
                        newMessage = { this.newMessage }
                        currentChatRoom = { this.state.currentChatRoom }
                        currentChatRoomName = { this.state.currentChatRoomName }
                        authUsername = { this.state.username }
                        authUID = { this.state.userID }
                        toggleSidebar = { this.setShowSidebar }
                        showSidebar = { this.state.showSidebar  }
                        setAuth = { this.setAuthentication }
                        showAlert = { this.setNotification }
                    />

                </div> 

                </div>

            </Fragment>
         
 
        );

    }

}

export default Messenger;