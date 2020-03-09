import React, { Component } from 'react';
import styles from './MessengerLayout.module.css';
import Header from '../../components/Header/Header';
import Messages from '../../components/Messages/Messages';
import Input from '../../components/Input/Input';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from '../../axios';

class MessengerLayout extends Component {

    state = {

        input: null,

        messages: null,

        userID: 100001,

        currentChatRoom: null,


    }

    /* on first load of the app. retrive the current loged in user messages and set state messages to messages */
    componentDidMount ( ) {
        
        axios.get( 'messages/user' + this.state.userID + '.json' ).then(
            ( e ) => {
                this.setState( { messages: e.data } );
                //console.log(this.state.messages);
                
            }
        );
              
    }

    /*
        overrides database and deletes all data. it overides with incorrect databse structure and breaks 
        everthing need to upadte. make it put the old data and the new data to the db or not overide somehow

        Will need to fetch data from database
        concatiante(join) old data with new input data in proper db structure
        then put onto database

        using axios.post() would result in it not overriding but creates a uniqe id for eache pushed data and is not changable. creating a unorgainzed taughting db. 
        complecation everything
       
       
        using azios.put() overides data in the database. the content sent with put should included to current db content + new content to prevent data loss

        Do Not uncomment until fixed. if uncommented and someone enters the input the databse structure will be deletd and we will have to recreate the db
        database backup located under source files in folder dbbackup
    */



    /*
        receiveUserInput = ( userInput ) => {

        
            const jsonInput = { userID: { message: userInput } };
            axios.put( 'messages.json',  jsonInput ).then( response => {

            } );

        
        }
    */ 


    //set Current Chat Room
    selectCurrentChatroom = ( chatroomID ) => {

        /*called from sidebar on select of chatroom */
        /*sets current chat room to chatroom id */
        if(chatroomID){

            this.setState( { currentChatRoom: chatroomID } );
            //console.log(chatroomID);
            
        }

    }
   
      
    
    

 
 
    
    render ( ) {

      
        return (
            
            <div className = { styles.layout } >

                <div className = { styles.sidebarGrid } >

                    {/* sidebar needs to select current chatroom and current chatroom needs to be sent to messages for displaying*/}
                    <Sidebar selectCurrentChatroom = { this.selectCurrentChatroom } chatRooms = { this.state.messages }  />

                </div>

                <div className = { styles.messageGrid } >
           
                    <Header messages = { this.state.messages } currentChatRoom={this.state.currentChatRoom} />
                  
                    <Messages userMessages = { this.state.messages } currentChatRoom = { this.state.currentChatRoom } />
                    
                  
                    <Input getUserInput = { this.receiveUserInput } />

                </div>

    </div>

        );

    }

}

export default MessengerLayout;