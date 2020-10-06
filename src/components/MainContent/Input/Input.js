import React from 'react';
import styles from './Input.module.scss';
import DOMPurify from 'dompurify';
let oldTime = null;

const input = props => {
    return(
        <div className={ styles.inputContainer }>
            <textarea 
                aria-label="Type a messages and press enter to send." 
                spellCheck="true" 
                placeholder="Press Enter to send Message" 
                maxLength="1999"
                className={ styles.input }
                onKeyDown={ e => {
                    let userInput = DOMPurify.sanitize(e.target.value);         
                    if(e.key === 'Enter') {
                        if(props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
                            if( oldTime === null ) {                                      
                                oldTime = Date.now();
                                oldTime -= 50000;                           
                            }                       
                            let currentTime = Date.now();                           
                            if(currentTime >= (oldTime + 2000)) {                               
                                    oldTime = currentTime;                                       
                                    props.newMessage(userInput);
                                    e.target.value = ''; //makes the input box empty once newMessage gets the input                            
                            } else {
                                props.showAlert(" Please wait two seconds before sending another message! ");
                            }
                        } else {
                            props.showAlert(' Please select a chatroom before sending a message! ');                           
                        }
                    }
                } }             
            >
            </textarea>
        </div>
    );
}

export default input;