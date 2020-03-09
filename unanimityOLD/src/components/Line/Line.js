import React, { Component, Fragment } from 'react';
import Axios from '../../axios';
class Line extends Component {
state = {
    userName: "No Name Found"
};
componentDidMount(){
    Axios.get( 'users/user' + this.props.userID + '.json' ).then(
        ( e ) => {                  
            //console.log(e.data);
            this.setState({userName: e.data.username});
        }
    );
}
render(){
    
    return(
     <Fragment>
        <p>{this.state.userName} </p>
        <p> {this.props.message} </p>
        &nbsp;
     </Fragment>
    );
}
   


};


export default Line;