import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';
import styles from './Authentication.module.css';

class Authentication extends Component {
    state = {
        authenticated: true,
        userID: 1,
        username: 'Blaine Young'
    }
    render(){
        
        let messenger = null;
        if(this.state.authenticated){
            messenger = <Messenger authenticated={ this.state.authenticated } userID={ this.state.userID } username={ this.state.username } />;
        }else{
            messenger = (
                <form className={styles.form}>
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" className={styles.input} />
                    
                    <label for="password" >Password</label>
                    <input type="text" id="password" name="password" className={styles.input}/>

                    <input type="submit" value="Log in"/>
                    <input type="submit" value="Register"/>
                </form>
                );
        }
        
        
        
        
        
        return(
            <Fragment>
                {messenger}
            </Fragment>
        );
    }
}

export default Authentication;