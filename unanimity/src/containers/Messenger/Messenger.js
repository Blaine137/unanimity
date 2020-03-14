import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.css';




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
        this.interval = setInterval(() => {if(this.state.currentChatRoomID){this.setCurrentChatRoom(this.state.currentChatRoomID)}}, 1000);

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
                    e.data.splice(userIndex, this.state.userID);
                    
                    //for recipents in the array set them as chatRoom name
                    e.data.forEach( ( singleUserID ) => { 

                        //get username by id. the function wont work beacuse i need a specifc .then action
                         axios.get( 'users/u' + singleUserID + '/userName.json' ).then((e) => {

                            this.setState( { currentChatRoomName: e.data } )
                            
                        })                      
                    } );//e.data.foreach

                }//if e.data  

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

    //called by input once user enters a new message
    newMessage = ( newMessage ) => {

        let messageChatRoom = Object.entries(this.state.currentChatRoom);
        let authenticaedUserMessageOld = [];
        let authenticaedUserMessageCombined = [];
        let nextMsgNum = null;

        //set maximum allowed message length. make sure we have a message. and make sure a chatRoom is selected
        if( newMessage.length > 0 && newMessage.length < 200 && this.state.currentChatRoom != null){

            //set authenticaedUserMessageOld and nextMSg number from this.state.currentChatRoom
            Object.entries( this.state.currentChatRoom).forEach( ( user ) => {

                //user[0] is the name of the property indise of the chatroom (u +userID, nextMsgNum)
                //if this the current authenticaed user messages
                if( user[ 0 ] === ( "u" + this.state.userID )) {

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

    render( ) {

       let mainContentInlineStyles = { };
        // //if sidebar is not showing 
        if( !this.state.showSidebar ) {
           
          //make maincontent span entire width
            mainContentInlineStyles = {
                   
                transform: 'translateX(-20vw)',
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
                             showSidebar={this.state.showSidebar} 
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