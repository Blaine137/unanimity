import React, { Component } from 'react';
import styles from './Input.module.css';

class Input extends Component {

   render ( ) {
   
                return(

                    <div className = { styles.inputContainer } >

                    
                        <input type = "text" placeholder = "Enter your message" onKeyDown = { ( e ) => {
                            if( e.key === 'Enter' ){

                                this.props.getUserInput( e.target.value );
                            
                            }
                        } }
                        ></input>
                        

                    </div>

                );
            }

};

export default Input;