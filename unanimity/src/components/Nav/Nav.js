import React from 'react';
import styles from './Nav.scss';

const nav = ( props ) => {

    return(

        <nav>

            <ul>
                
                <li onClick={ () => {
                    props.goToAuth()
                } }>
                    Login/Register
                </li>
                <li> 
                    Contact
                </li>

            </ul>  

        </nav>

    );

};

export default nav;