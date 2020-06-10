import React from 'react';
import styles from './Nav.scss';

const nav = ( props ) => {

    return(

        <nav>

            <ul>
                
                <li onClick={ () => {
                    props.goToAuth() //localhost shows error coming from this line of code ??????
                } }>
                    Login/Register
                </li>
                <li onClick = { () => {
                    props.goToContact()
                } }> 
                    Contact
                </li>

            </ul>  

        </nav>

    );

};

export default nav;