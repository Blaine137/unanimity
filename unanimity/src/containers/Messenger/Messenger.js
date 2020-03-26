import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.scss';




class Messenger extends Component {

    state = {

        authenticated: null,
        userID: null,
        usersChatRoomsID: [],
        currentChatRoom: {},
        currentChatRoomID: null,
        currentChatRoomName: null,
        username: null,
        showSidebar: true,
        sidebarInlineStyles: { display: 'block'},
        renderHeader: false

    }
  
    componentDidMount = ( ) => {

        //every second update the current chatroom. this make sure we can see if the other messenger sent a message
        this.interval = setInterval( ( ) => { 
            if( this.state.currentChatRoomID ) { 
                
                this.setCurrentChatRoom(this.state.currentChatRoomID ); 

            } 

                this.setUsersChatRoomsID( );
     
        }, 1000);

        

        this.setAuthentication( );
        

        if( this.state.userID ) {

            this.setUsersChatRoomsID( );

        }
        
    }

    componentDidUpdate = ( prevProps, prevState ) => {

        //if the userID in the state is not the same.
        //prevents infinate loop
        if( prevState.userID !== this.state.userID ) {

            this.setUsersChatRoomsID( );

        }

           
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    setAuthentication = ( ) => {

        this.props.authenticated ? this.setState( { authenticated: this.props.authenticated } ) : this.setState( { authenticated: false } )

        this.props.userID ? this.setState( { userID: this.props.userID } ) : this.setState( { userID: null } )

        this.props.username ? this.setState( {username: this.props.username} ) : this.setState( { username: null } )
        
    }
     
    //gets array of chatRoomsID that the user is in and sets userChatRoomsID in state. called by mount and update
    setUsersChatRoomsID = ( )  =>{

        //ucr stands for user Chat Room.
        //get array that contains all the chatRoomIDs that the user is a part of
        axios.get( 'usersChatRooms/ucr' + this.state.userID + '/chatRooms.json' ).then(
            ( e ) => {

                this.setState( { usersChatRoomsID: e.data } );
            
            }
        );

    }

    //called by setCurrentChatRoom
    setCurrentChatRoomName = ( ChatRoomIDForName ) => {
    
     if( ChatRoomIDForName ) {
        
        //for chatRoom get users in the chatRoom
        axios.get( 'chatRoomsUsers/cru' + ChatRoomIDForName + '/users.json' ).then(
            ( e ) => {
                
                if( e.data ){

                    //find index of our id
                    let userIndex = e.data.indexOf(this.state.userID);

                    
                    //remove ourself form the array
                    e.data.splice(userIndex, 1);
                    
                    //for recipents in the array set them as chatRoom name
                    e.data.forEach( ( singleUserID ) => { 

                        //get username by id. the function wont work beacuse i need a specifc .then action
                         axios.get( 'users/u' + singleUserID + '/userName.json' ).then((e) => {
                            
                            this.setState( { currentChatRoomName: e.data } )
                            
                        })                      
                    } );//e.data.foreach

                }//if e.data
                else {
                    //no chatRoom so name ChatRoomName
                    this.setState( { currentChatRoomName: null } )
                }  

            }//axios get get users in the chatRoom .then function

        );//axios get get users in the chatRoom

     }//if chatRoomIdForName

    }

    //called by sidebar on click of a chatroom
    //sets currentChatRoom and currentChatRoomID
    setCurrentChatRoom = ( setChatRoomID ) => {
      
        //set currentChatRoom to object with messages and everything about that chatRoom
        axios.get( 'chatRooms/' + setChatRoomID + '/.json' ).then(

            ( e ) => { 
                    
                    this.setState( { currentChatRoom: e.data, currentChatRoomID: setChatRoomID } )
                }//.then function

        );//axios get currentChatRoom

        //call functiont to set chatRoom name
        this.setCurrentChatRoomName( setChatRoomID )

    }

    //called onClick of the hamburger in the maincontent/header.js
    setShowSidebar = ( ) => {

        //if sidebar was showing and we click hamburger. close the sidebar
        if( this.state.showSidebar ){

            this.setState( { showSidebar: false } );
            
            setTimeout( ( ) => {

                this.setState( { sidebarInlineStyles: {display: 'none'}  } );
                
            }, 1000 );
                
            
        } 
        //if sidebar was closed and we clicked the hamburger open the sidebar
        else {
            
            this.setState( { sidebarInlineStyles: {display: 'block'} } );
        
            setTimeout( ( ) => {

                this.setState( { showSidebar: true} );

            }, 150 );
            
        }

    }

    //called by input once user enters a new message
    newMessage = ( newMessage ) => {

        let messageChatRoom = Object.entries(this.state.currentChatRoom);
        let authenticaedUserMessageOld = [];
        let authenticaedUserMessageCombined = [];
        let nextMsgNum = null;

        //set maximum allowed message length. make sure we have a message. and make sure a chatRoom is selected
        if( newMessage.length > 0 && newMessage.length < 200 && this.state.currentChatRoom != null ) {

            //set authenticaedUserMessageOld and nextMSg number from this.state.currentChatRoom
            Object.entries( this.state.currentChatRoom ).forEach( ( user ) => {

                //user[0] is the name of the property indise of the chatroom (u +userID, nextMsgNum)
                //if this the current authenticaed user messages
                if( user[ 0 ] === ( "u" + this.state.userID ) ) {

                    //get the messages and set a vaible
                    authenticaedUserMessageOld = user[ 1 ];

                }else if( user[ 0 ] === "nextMsgNum" ) {

                    //user[1] the value of nextMsgNum
                    nextMsgNum = user[ 1 ];

                }

            })//end of foreach that sets old authenticaedUserMessageOld and nextMSg

            //add new message to to old messages
            authenticaedUserMessageCombined = [...Object.values(authenticaedUserMessageOld)];
            //make sure that it keeps the order in the arrays. make it the nextMsgNum postion in the array. array[nextMsgNum]
            authenticaedUserMessageCombined[ nextMsgNum ] = newMessage;

            //increment nextMsgNum by 1
            if( nextMsgNum ) {

                nextMsgNum++;

            }

            //set messageChatRoom to all the new data
            //messageChatRoom Contains the other user messages. This is required so that when we put the data on the db that the other user messages are not removed
            messageChatRoom.forEach( ( property ) => {

                //property[0] is the name of the property 
                //if this the current authenticaed user messages
                if( property[ 0 ] === ( "u" + this.state.userID )) {

                    //set our current user messages to combined messages new and old.
                    //property[ 1 ] is the array of out user messages
                    property[ 1 ] = authenticaedUserMessageCombined;

                } else if ( property[ 0 ] === "nextMsgNum" ) {

                    //property[ 1 ] is the old nextMsgNum before the increment of 1.
                    property[ 1 ] = nextMsgNum;

                }

            } )//foreach that sets messageChatRoom to new data values
            //convert our finished data from an array back to object to match the DB structure
            messageChatRoom = Object.fromEntries( messageChatRoom );

            //update the DB with all the new data. 
            axios.put( "chatRooms/" + this.state.currentChatRoomID  + ".json",  messageChatRoom );
            //upadate our current chatRoom
            this.setState( {currentChatRoom: messageChatRoom} );

        }//end of newMessage validation if
            
    }

    //add onSubmission of popUp for addChatRoom in sidebar component
    newChatRoom = ( event, recipentName, resetSidbebarDisplay ) => {
        
        //id of the person we are sending to
        let recipentID = null;

        //the chatroom id that will be used for the createion of the new chatroom
        let newChatRoomID = null;

        //chatRoomID after our new chatroom. used for upadating db after we add our newchatroom
        let updatedChatRoomID = null;
        let newChatRoomObject = { };

        //will be the new updated userChatRooms/ucr+userID/chatRooms.json for the authenticated user. will equal array of chatRoomsID that the user is apart of
        let updatedAuthUserChatRoomsID = [];
        let updatedRecipientUserChatRoomsID = [];

        //object that will be inserted in the newly created ChatRoomUsers/newchatRoomid.json.
        let newChatRoomUsersObject = {};

        //prevent browser reload
        if( event ) {

            event.preventDefault( );

        }


        //--------- start check if recipents name exists. set recipentsId if it exzist ---------

            if( recipentName !== null ) {

            //axios get userIDbyName for recipent
            axios.get( 'userIDByUsername/' + recipentName + '.json' ).then(
                ( response ) => {

                    //if username was found set userID
                    recipentID = response.data;

                    //if no recipentID
                    if( recipentID === null ) {

                        alert( "User not found!" );

                    }//if no recipentID


                    // --------- start create the chatroom and add chatroom to all tabels for referance ---------

                        //if userID was set. username was found
                        if( recipentID !== null ) {
                            
                                //sets newChatRoomObject. object will be added to db as a new chatroom
                                newChatRoomObject = {

                                     nextMsgNum: 2,
    
                                };
    
                                //adds u+userid to the chatroom object with u+userID as the property name. then sets the value to an array.
                                newChatRoomObject[ "u" + this.state.userID ]  =  [ ( this.state.username + " has joined the chat!" ) ] ;
                                newChatRoomObject[ "u" + recipentID ] = [ null,  ( recipentName + " has joined the chat!" ) ];

                                //gets next avaible chatRoomID
                                axios.get( 'chatRooms/nextChatRoomID.json' ).then(

                                    ( e ) => {
                                        //--------- start create the chatroom in chatRooms ---------
                                            //sets newChatroomID to next avaible chat room id
                                            newChatRoomID = e.data;
                                            
                                            //check if we have a newChatRoomID
                                            if( newChatRoomID ) {

                                                //add the newChatRoomObject to the DB. under ChatRooms/newChatRoomID.json
                                                axios.put( 'chatRooms/' + newChatRoomID + '.json', newChatRoomObject ).catch(
                                                    ( error ) => {

                                                        //failed to add the chatroom to the db
                                                        alert( "failed to add chat room. Please try agin. " );

                                                    }
                                                );//axios put newChatRoomObject

                                                //find the chatRoomID that comes after our newChatRoomID
                                                //sometimes it is a string so make sure its a int
                                                updatedChatRoomID = parseInt( newChatRoomID );
                                                
                                                //increment the ID to find the Id after newID
                                                updatedChatRoomID++;
                                                
                                                //set the db nextChatRoomID to the updatedChatRoomID
                                                axios.put( 'chatRooms/nextChatRoomID.json', updatedChatRoomID ).catch(
                                                    ( error ) => {

                                                        console.log( "failed to update the nextChatRoomID in the DB ", error );

                                                    }
                                                );//axios put nextChatRoomID

                                            }//if we have newChatRoomID 
                                            //else we dont have a newChatRoomID
                                            else {

                                                alert( "Could not determine the chat room id. Please try agin." );

                                            }//if we have a newChatRoomID
                                        //--------- end create the chatroom in chatRooms ---------
                                        
                                        // --------- start update usersChatRooms for authenticated user and recipent ---------
                                            
                                            //start update for Authenticated user
                                            
                                                
                                                if ( this.state.usersChatRoomsID ) {

                                                    //gets the latest data. this step prevents form add chatroom adding chatroom referances to deleted chatroom
                                                    axios.get( 'usersChatRooms/ucr' + this.state.userID + '/chatRooms.json' ).then(
                                                        ( e ) => {

                                                            
                                                            this.setState( { usersChatRoomsID: e.data } );
                                                            updatedAuthUserChatRoomsID =  e.data ;
                                                           
                                                            //add the newChatRoomID to the authenticated user chatRoomsID
                                                            updatedAuthUserChatRoomsID.push( newChatRoomID );
                                                            
                                                            let chatRooms = updatedAuthUserChatRoomsID;
                                                            //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                                                            axios.put( 'usersChatRooms/ucr' + this.state.userID + '.json', { chatRooms } ).catch(
                                                                ( error ) => {

                                                                    alert( "Error. failed to update Authenticated usersChatRooms " + error );

                                                                }
                                                            );//axios put updates Auth user in userChatRooms
                                
                                                        }
                                                    );//axios get() chatRoomIDs
                                                    

                                                } else {
                                                    
                                                    updatedAuthUserChatRoomsID = [ ];
                                                    //add the newChatRoomID to the authenticated user chatRoomsID
                                                     updatedAuthUserChatRoomsID.push( newChatRoomID );

                                                     let chatRooms = updatedAuthUserChatRoomsID;
                                                    //update the db for the Auth user with the updatedAuthUserChatRoomsID in usersChatRooms
                                                    axios.put( 'usersChatRooms/ucr' + this.state.userID + '.json', { chatRooms } ).catch(
                                                        ( error ) => {

                                                            alert( "Error. failed to update Authenticated usersChatRooms " + error );

                                                        }
                                                     );//axios put updates Auth user in userChatRooms

                                                }
                                             

                                            //end update for Authenticated user

                                            //start update for Recipent
                                                
                                                //get the recipents current/old(without the newchatroom)chatRooms from usersChatRooms
                                                axios.get( 'usersChatRooms/ucr' + recipentID + '/chatRooms.json').then(
                                                    ( e ) => {
                                                            
                                                            //if e.data is not null
                                                         if( e.data ){

                                                            updatedRecipientUserChatRoomsID = e.data; //set URUCR-ID to the data 

                                                         } else {
                                                            updatedRecipientUserChatRoomsID = [ ];
                                                         }
                                                         //add newChatRoomID to the recipents Chatrooms
                                                         updatedRecipientUserChatRoomsID.push( newChatRoomID );

                                                        let chatRooms = updatedRecipientUserChatRoomsID;
                                                         //add the updated IDs to the DB
                                                         axios.put( 'usersChatRooms/ucr' + recipentID + '.json', { chatRooms } ).then( 
                                                            ( ) => {
                                                                // --------- start update Sidebar with new ChatRoom ---------

                                                                    //once the userChatRooms has been updated
                                                                    //updates the state for usersChatRoomsID which sidebar uses to load all the chatrooms for auth user.    
                                                                    this.setUsersChatRoomsID( );
                                                                    
                                                                // --------- end update Sidebar with new ChatRoom ---------
                                                            } 
                                                         ).catch(
                                                             ( error ) => {

                                                                 alert( "Error. failed to update Recipient usersChatRooms " + error );

                                                            }
                                                         );//axios put of updated chatroomID

                                                     }//axios .then() of get old chatroom

                                                )//axios get recipents old chatroom

                                            //end update for Recipent

                                        // --------- end of userChatRooms update ---------


                                        // --------- start Add chatRoomUsers for new chatRoom --------- 
                                                     
                                            newChatRoomUsersObject = {

                                                chatRoomID: newChatRoomID,
                                                users:  [ this.state.userID, recipentID ] 

                                            }
                                            axios.put( 'chatRoomsUsers/cru' + newChatRoomID + '.json', newChatRoomUsersObject ).then(
                                                () => {

                                                    //settimout ensures that all the axios statements have finished. then it resert the sidebar so that it displays the proper chatRoomNames
                                                    setTimeout( ( ) => { resetSidbebarDisplay( ); }, 1000 );
                                                }

                                            ).catch(
                                                ( error ) => {

                                                    alert("Error. Failed to add ChatRoom to ChatRoomUsers ", error);

                                                }
                                            );
                                        // --------- end of update chatRoomUsers ---------
                                        
                                    }//end of axios get .then() next ChatRoom id .then()

                                ).catch( 
                                    //if error occurred in axios get nextChatRoomID from chatRooms/nextChatRoomID.json
                                    ( error ) => {

                                    alert( "Error occurred while trying to set ChatRoomID. Please try agin. " , error );
                                        console.log(error)
                                    } 

                                );//axios get nextchatRoomID
                                                                          
                        }//if recipentID set

                    //--------- end create the chatroom and referances ---------
                    
                }//axios get userIDbyName for recipent .then()
            ).catch(

                ( error ) => {

                    //no username found alert user
                    alert( "User not found!" );
                    
                }
                
            );//axios get userIDbyName for recipent
            } 
            //ussername cannot be null
            else {
               alert( 'Recipent\'s name is required!' );
            }

        // --------- end of check recipent name ---------
        
            
    }

    removeChatRoom = ( removeChatRoomID, resetSidebarDisplay ) => {
        
        //will equal all the users ID that are in the chatroom and need the chatroom id removed from userChatRooms
        let removeChatRoomUsers = [];
        //index of the chatRoom we need to remove from userChatRoom(ucr)
        let ucrIndex = null;
        //used for deleting the data. set the data to null(empty object) and firebase removes it completely
        let empty = {};

        //if chatRoomID is not null
        if( removeChatRoomID !== null ){
            
            //get the chatRoomUsers ID so that we can use it to remove the chatRoom from usersChatRoom.
            axios.get( 'chatRoomsUsers/cru' + removeChatRoomID + '/users.json' ).then(
                ( e ) => {
                    
                    //if there is no data then .catch() should inform the user something went wrong
                    //also if there is e.data then the chatroom exzisted
                    if( e.data !== null ) {

                        removeChatRoomUsers = e.data;
                        
                        // -------- start remove the chatRoom from the ChatRoomUsers --------

                            
                            //deletes data by setting it equal to an empty object. firebase then automattically removes empty objects
                            axios.put( 'chatRoomsUsers/cru' + removeChatRoomID + '.json' , empty ).catch(
                                 ( e ) => {
                                      console.log( "error overiding/deleting chatRoomUsers for " + removeChatRoomID + "axios error: " + e ) 
                                    } 
                                );

                        // -------- end of remove the chatRoom from the chatRoomUsers --------


                        // -------- start of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------

                            //if we have users to remove
                            
                            if( removeChatRoomUsers ) {
                                
                                //for each user that we need to remove the chatoom from
                                removeChatRoomUsers.forEach( (user) => {

                                    //get all of the users chatrooms for a specifc user
                                    axios.get( 'usersChatRooms/ucr' + user + '/chatRooms.json' ).then(
                                        ( e ) => {
                                            
                                            //confirm that it is an array
                                            e.data = Object.values(e.data);
                                                  
                                            //find the index of the chatRoomID we need to remove

                                            ucrIndex = e.data.indexOf(removeChatRoomID);
                            
                                            //if we have an index to remove.
                                            //0 is a valid index but zero equals false by default 
                                            if( ucrIndex || ucrIndex === 0){
         
                                                //removes the chatroom from the usersChatRooms
                                                e.data.splice(ucrIndex);
                                                
                                                ///if e.data only contained one chatroom and we removed that chatroom then it would equal null
                                                if( e.data === null ) {


                                                    //update the userChatRooms to the empty object which just deltes the enrie object.
                                                    //if we used e.data which is just null it dosent work. it requires an object to be passed in for the DB restraints

                                                     //in if ucrIndex because if we dont remove anything no need to update the db
                                                    //update users chatrooms in BD


                                                    axios.put( 'usersChatRooms/ucr' + user + '/chatRooms.json', empty ).then(
                                                        () => {

                                                            //causes sidebar to update
                                                            this.setUsersChatRoomsID();
                                                            //wait for the setUserChatRoomsID to finsih then update the sidebar
                                                            setTimeout(() => {resetSidebarDisplay(); }, 1000);
                                                            
                                                        }
                                                    ).catch(
                                                        ( error ) => {
                                                            console.log( error );
                                                        }
                                                    );

                                                } 
                                                //removed the chatroom and they still have other chatrooms
                                                else {
                                                    let chatRooms = e.data;
                                                    //in if ucrIndex because if we dont remove anything no need to update the db
                                                    //update users chatrooms in BD
                                                    axios.put( 'usersChatRooms/ucr' + user + '.json', {chatRooms} ).then(
                                                        () => {

                                                           //causes sidebar to update
                                                           this.setUsersChatRoomsID();
                                                           //wait for the setUserChatRoomsID to finsih then update the sidebar
                                                           setTimeout(() => {resetSidebarDisplay(); }, 1000);

                                                        }
                                                    ).catch(
                                                        ( error ) => {
                                                            console.log( error );
                                                        }
                                                    );

                                                }//else of if(e.data === null)
                                                

                                            }//if ucrIndex is not null


                                        }//axios then()
                                    ).catch( ( e ) => { console.log( e ) } );//axios get userChatRooms for user

                                });//foreach chatRoomUsers

                            }//if have users to remove

                        // -------- end of remove the chatRoom from usersChatRooms for the ID of removeChatRoomUsers --------


                        // -------- start of remove chatRoom from chatRooms -------- 

                            //deltes data by setting it to null. then firebase removes it completly
                            axios.put( 'chatRooms/' + removeChatRoomID + '.json', empty );
                            
                        // -------- end of remove chatRoom from chatRooms -------- 

                    }//if e.data is not null
                    
                }
            ).catch(
                ( error ) => {

                    alert( "Could not find Chatroom that you requested to be removed. ", error );

                }
            );//axios get chatRoomUsers

        }//if ChatroomID is not null 
        //chatRoomID Is null
        else {

            console.log( "removeChatRoomID was null in removeChatRoom function. function was canceled." );

        }//if chatroomID is not null

    }

    render( ) {
       
       let mainContentInlineStyles = { };
        //if sidebar is not showing 
        if( !this.state.showSidebar ) {
           
          //make maincontent span entire width
            mainContentInlineStyles = {
                   
                transform: 'translateX( -20vw )',
                width: '100vw',
                height: '100vh',
                       
            };
                          
        }

        return(

            <div className = { styles.layout } >

                <div className = { styles.sidebarGrid } style = { this.state.sidebarInlineStyles } >
                
                    <Sidebar usersChatRoomsID = { this.state.usersChatRoomsID } 
                             userID = { this.state.userID } 
                             setCurrentChatRoomID = { this.setCurrentChatRoom }
                             showSidebar = { this.state.showSidebar }
                             addChatRoom = { this.newChatRoom } 
                             deleteChatRoom = { this.removeChatRoom }
                    />

                </div>
                
                <div className = { styles.mainContentGrid }  style={mainContentInlineStyles}>

                    <MainContent newMessage = { this.newMessage } 
                                 currentChatRoom = { this.state.currentChatRoom } 
                                 currentChatRoomName = { this.state.currentChatRoomName }
                                 toggleSidebar = { this.setShowSidebar } 
                                 showSidebar={ this.state.showSidebar }
                    />

                </div> 
            
            </div>

        );
        
    }
    
}

export default Messenger;