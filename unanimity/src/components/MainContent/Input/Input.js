import React from 'react';
import styles from './Input.module.scss';
let oldTime = null;

const input = ( props ) => {

    return(
        
        <div className = { styles.inputContainer } >

            <textarea aria-label = "Type a messages and press enter to send." spellCheck="true" placeholder = "Press Enter to send Message" maxLength = "1999"
                onKeyDown = { ( e ) => {

                    let userInput = e.target.value;
                    
                    if( e.key === 'Enter' ) {
                       
                        if(props.currentChatRoomName){

                                //if null
                            if( oldTime === null ) {
                                
                                
                                oldTime =  Date.now();
                                oldTime -= 50000;
                                
                            }
                        
                            let currentTime = Date.now();
                            
                            if( currentTime >= ( oldTime + 2000 ) ){
                                
                                    oldTime = currentTime;
                                
        
                                    props.newMessage( userInput );
                                    e.target.value = ''; //makes the input box empty once newMessage gets the input
                                

                            } else {

                                alert( "Please wait one second before sending another message!" );

                            }

                        }else{

                            alert('Please select a chatroom before sending a message!');
                            
                        }

                    }

                } } className = { styles.input }
            >
            </textarea>

        </div>

    );//return()

}
export default input;