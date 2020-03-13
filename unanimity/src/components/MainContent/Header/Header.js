import React from 'react';
import styles from './Header.module.css';

const header = (props) => {
  
    return(
        <header className={styles.header}>
            
            <div onClick={ ( ) => { props.showSidebar() } } className={styles.burger}  >

                        <div className={styles.burgerTop}></div>
                        <div className={styles.burgerBottom}></div>
                        
            </div>

            <h3 className={styles.header3}>
                {props.currentChatRoomName}
            </h3>
        </header>
    );
}
export default header;