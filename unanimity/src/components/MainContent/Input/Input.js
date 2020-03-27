import React from 'react';
import styles from './Input.module.scss';
let oldTime = null;

const input = ( props ) => {

    return(
        
        <div className = { styles.inputContainer } >

            <input type = "text" spellCheck="true" placeholder = "Press Enter to send Message" 
                onKeyDown = { ( e ) => {

                    let userInput = e.target.value;
                    
                    if( e.key === 'Enter' ) {
                       
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
                    }

                } } className = { styles.input }
            />

        </div>

    );//return()

}
export default input;