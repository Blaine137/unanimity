import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainContent from '../../components/MainContent/MainContent';
import axios from '../../axios'; //custom axios instance with DB base Url added
import styles from './Messenger.module.css';

//i is for testing setCurrentChatRoomName. delete once fixed
//let i = 1;

class Messenger extends Component {

    state = {

        authenticated: null,
        userID: this.props.userID,
        usersChatRoomsID: [],
        currentChatRoom: {},
        currentChatRoomID: null,
        currentChatRoomName: null,
        username: null

    }
  
    componentDidMount( ) {


        this.setAuthentication( );
        
        this.checkAuthentication( );

        if(this.state.userID){
            this.setUsersChatRoomsID( );
        }

    }
    
    componentDidUpdate( prevProps, prevState ) {

        this.checkAuthentication( );
        //if the userID in the state is not the same.
        //prevents infinate loop
        if(prevState.userID != this.state.userID){
            this.setUsersChatRoomsID( );
        }

    }
    
    setAuthentication( ) {

        this.props.authenticated ? this.setState( { authenticated: this.props.authenticated } ) : this.setState( { authenticated: false } )

        this.props.userID ? this.setState( { userID: this.props.userID } ) : this.setState( { userID: null } )

        this.props.username ? this.setState( {username: this.props.username} ) : this.setState( { username: null } )
        
    }
    
    checkAuthentication( ) {

        if ( !this.state.authenticated ){
            //redirect to authentication
        }

    }
    
    //gets array of chatRoomsID that the user is in and sets userChatRoomsID in state. called by mount and update
    setUsersChatRoomsID( ) {

        //ucr stands for user Chat Room.
        axios.get( 'usersChatRooms/ucr' + this.state.userID + '/chatRooms.json' ).then(
            ( e ) => {
                this.setState( { usersChatRoomsID: e.data } );
                //console.log(this.state.usersChatRoomsID);            
            }
        );

    }

    getUsernameByID( getUserID ) {

      //add userID validation such as if not null an integer
      //if we have a userID
      if( getUserID ) {
         axios.get( 'users/u' + getUserID + '/userName.json' ).then(
            ( e ) => {
                //console.log(e.data);  
                return e.data;
               
                          
            }

        );

      } 
      //no ID return name of nobody
      else {

          return 'nobody';

      }

    }
   
    /**
     * setCurrentChatRoomName is not Complete!!
     * 
     * asyncornise js takes time to exicute. 
     * getUsernameByID contains a db fectch(async)
     * we Need to wait for getUserNamebyID to finish before running setState currentChatRoomName
     * Logic is there just am unsure of how to wait until the getUserNameByID is done
     * cannot use .then() or wait until() becuase getUserNameByID is not asyn it just dose asyn task
     * 
     */
    //called by setCurrentChatRoom
    setCurrentChatRoomName( ChatRoomIDForName ) {
        let setChatRoomName = "";
        //for chatRoom get users in the chatRoom
        axios.get( 'chatRoomsUsers/cru' + ChatRoomIDForName + '/users.json' ).then(
            ( e ) => {
 
                //remove ourselfs from the chatroomID array
                e.data.splice(0 , this.state.userID);

                //for recipents in the array set them as chatRoom name
                e.data.forEach( ( singleUserID ) => { 

                    setChatRoomName += this.getUserNameByID( singleUserID )
                    
                } );

                //set state
                this.setState( { currentChatRoomName: setChatRoomName } )
               

            }
        );    
    }
    //called by sidebar on click of a chatroom
    setCurrentChatRoom( setChatRoomID ) {

        //set currentchatRoomID
        this.setState( {currentChatRoomID: setChatRoomID } );

        //set currentChatRoom to object with messages and everything about that chatRoom
        axios.get( 'chatRooms/' + setChatRoomID + '/.json' ).then(
            ( e ) => { 

                    this.setState( { currentChatRoom: e.data } )
            
                }
            );

        //call functiont to set chatRoom name
        this.setCurrentChatRoomName( setChatRoomID );

    }
    //called by input once user enters a new message
    newMessage( message ) {

        //validate the message.
        //set maximum allowed message length
        //add message to currnetChatRoom in DB. for the current user 
        //make sure that it keeps the order in the arrays. make it the nextMsgNum postion in the array. array[nextMsgNum]
        //increment nextMsgNum by 1 on the database
        
    }
    
    render( ) {
        //temp delete once setCurrentChatRoomName is fixed
                //use to test setCurrentChatRoom and setCurrcentChatRoomName
                //setCurretnChatRoom call setCurrentChatRoomName
                //to use uncomment varible i in top of document
                //if statement prevents infiante loop
                /*if (i === 1){
                    i++
                    this.setCurrentChatRoom( 12345678 )
                }*/
                //console.log(this.state.currentChatRoomName);
        //end of test block for setCurrentChatRoom and setCurrentChatRoomName
        return(

            <div className={styles.layout}>

                <div className={styles.sidebarGrid}>

                    <Sidebar usersChatRoomsID = {this.state.usersChatRoomsID} 
                             userID={this.state.userID} 
                             getUsernameByID={this.getUsernameByID} 
                             setCurrentChatRoomID={this.setCurrentChatRoomID} />

                </div>
                
                <div className={styles.mainContentGrid}>

                    <MainContent getUserNameByID={this.getUserNameByID} 
                                 newMessage={this.newMessage} 
                                 currentChatRoom={this.state.currentChatRoom} 
                                 currentChatRoomName={this.state.currentChatRoomName} />

                </div> 
            
            </div>

        );
        
    }
    
}

export default Messenger;