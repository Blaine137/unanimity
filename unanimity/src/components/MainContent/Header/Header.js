import React from 'react';
import styles from './Header.module.scss';

const header = ( props ) => {
 
            let burger = null;

                    //if props.showSidebar is true
            if( props.showSidebar ) {

                    //make the burger button a X
                burger = <div onClick = { ( ) => { props.toggleSidebar( ) } } className = { styles.burger }  >

                                <div className = { styles.closeTop } ></div>
                                <div className = { styles.closeMiddle } ></div>
                                <div className = { styles.closeBottom } ></div>
                                
                    </div>;

            } else {
                        //if false then make the burger button 
                burger = <div onClick={ ( ) => { props.toggleSidebar( ) } } className = { styles.burger }  >

                            <div className = { styles.openTop } ></div>
                            <div className = { styles.openMiddle } ></div>
                            <div className = { styles.openBottom } ></div>
                
                        </div>;

            }
           
        return(

            <header className = { styles.header } >
                
                { burger }

                <h3 className = { styles.header3 } >
                    
                    { props.currentChatRoomName } 

                </h3>

            </header>

        );//return

}

export default header;