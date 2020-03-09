import React, { Component } from 'react';
import Nav from './Nav/Nav';
import User from '../User/User';
import Options from '../Header/Options/Options';
import styles from './Header.module.css';


class Header extends Component {

    state = {

    }

    render ( ) {
        let userID = null;
        if( this.props.messages ) {
            //convert object to array for looping
            let messages = Object.entries( this.props.messages )
            messages.forEach( ( chatRoom ) => {
                //find the current chatRoom
                if( chatRoom[ 0 ] === this.props.currentChatRoom ){
                    //get the user that we are sending to
                    //chatRoom[1] goes into the array of messages and the user info. userID[1] is the user that the message is sent to. 
                    userID = chatRoom[ 1 ].userID[ 1 ];
                }
               
            })
            
         }
        
         
        return(
        
                <div className = { styles.header } >
                    <div className = { styles.col1 } >
                        {/* NAV goes below this comment */}
                        <Nav />
                    </div>

                    <div className = { styles.col2 } >
                        {/* USERS goes below this comment */}
                        <User userDisplay = "username"  userID = { userID } />
                    </div>

                    <div className = { styles.col3 } >
                        {/*OPTIONS goes below this comment */}
                        <Options />
                    </div>
                </div>

        );


    }


}

export default Header;