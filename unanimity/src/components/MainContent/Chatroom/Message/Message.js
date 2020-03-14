import React from 'react';
import styles from './Message.module.css';

const message = ( props ) => {

    return(

        <div className = { styles.message } >
            <p> { props.currentMessage } </p>
        </div>

    );

}
export default message;