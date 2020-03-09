import React, { Component, Fragment } from 'react';
import styles from './User.module.css';
import axios from '../../axios';


class User extends Component {
    
    state ={
        userInfo: {}

    }
        //once component is rendered
    componentDidMount(){
       this.getUserByID();
    }
    componentDidUpdate( prevProps ) {

        if(this.props.userID !== prevProps.userID ){
            this.getUserByID();
            console.log("hello");
        }

    }
    getUserByID = () => {
         //if userID is set

         if( this.props.userID ) {
            //get data based on userID and then sets userInfo to the user's info
            axios.get( 'users/user' + this.props.userID + '.json' ).then(
            ( e ) => {                      
                this.setState({ userInfo: e.data});
            });

        }

    }
    render ( ) {
  

        let user = null;
        if ( this.props.userDisplay === 'username' ) { 
            
            user = <div className = { styles.username } >
                        <p>{this.state.userInfo.username}</p>  
                    </div>;
                     
        } else if ( this.props.userDisplay === 'userPicture' ) {

            user = <div className = { styles.picture } >
                         <img href="#" alt="img" />
                    </div>;   

        } else if ( this.props.userDisplay === 'userList' ) {

            user = <div className = { styles.list } >
                         <img href="#" alt="img" />
                         <p>{this.state.userInfo.username}</p>
                    </div>;   
                    
        }
      

        return(
           
                <Fragment  >
                    <div onClick = { () => { this.props.selectCurrentChatroom(this.props.currentChatRoom) } } >
                        { user }
                       
                    </div>
                </Fragment>
        );

    }

}

export default User; 