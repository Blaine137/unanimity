import React from 'react';
import styles from './Header.module.css';

const header = (props) => {
    return(
        <header className={styles.header}>
            <h3>{props.currentChatRoomName}</h3>
        </header>
    );
}
export default header;