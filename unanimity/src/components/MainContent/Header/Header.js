import React from 'react';
import styles from './Header.module.css';

const header = ( props ) => {
 
            let burger = null;

                    //if props.showSidebar is true
            if( props.showSidebar ) {

                    //make the burger button a X
                burger = <div onClick = { ( ) => { props.toggleSidebar( ) } } className = { styles.close }  >

                                <div className = { styles.closeTop } ></div>
                                <div className = { styles.closeMiddle } ></div>
                                <div className = { styles.closeBottom } ></div>
                                
                    </div>;

            } else {
                        //if false then make the burger button 
                burger = <div onClick={ ( ) => { props.toggleSidebar( ) } } className = { styles.burger }  >

                            <div className = { styles.burgerTop } ></div>
                            <div className = { styles.burgerMiddle } ></div>
                            <div className = { styles.burgerBottom } ></div>
                
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