import React from 'react';
import styles from './Input.module.css';

const input = ( props ) => {
    return(
        
        <div className={styles.inputContainer}>
            <input type="text" placeholder="Press Enter to send Message" 
                onKeyDown={ ( e ) => {

                    let userInput = e.target.value;

                    if( e.key === 'Enter' ){

                        props.newMessage( userInput );

                    }
                    
                } } className={ styles.input }
            />
        </div>

    );
}
export default input;