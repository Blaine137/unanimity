import React, { Component, Fragment } from 'react';
import Messenger from '../Messenger/Messenger';

class Authentication extends Component {
    state = {
        authenticated: true,
        userID: 1,
        username: 'Blaine Young'
    }
    render(){
        
        let messenger = null;
        if(this.state.authenticated){
            messenger = <Messenger authenticated={ this.state.authenticated } userID={ this.state.userID } username={ this.state.username } />
        }else{
            messenger = (<form>
                <label for="username">Username</label>
                    <input type="text" id="username" name="username" />
                    <label for="password" >Password</label>
                    <input type="text" id="password" name="password" />
                    <input type="submit" />
                </form>);
        }
        
        
        
        
        
        return(
            <Fragment>
                {messenger}
            </Fragment>
        );
    }
}

export default Authentication;