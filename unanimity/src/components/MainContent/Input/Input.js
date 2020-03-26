import React from 'react';
import styles from './Input.module.scss';

const input = ( props ) => {

    return(
        
        <div className = { styles.inputContainer } >

            <input type = "text" spellCheck="true" placeholder = "Press Enter to send Message" 
                onKeyDown = { ( e ) => {

                    let userInput = e.target.value;

                    if( e.key === 'Enter' ){

                        props.newMessage( userInput );
                        e.target.value = ''; //makes the input box empty once newMessage gets the input
                    }
                    
                } } className = { styles.input }
            />

        </div>

    );//return()

}
export default input;