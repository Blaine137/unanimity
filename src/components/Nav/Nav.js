import React from 'react';
import './Nav.module.scss';
import { Link } from 'react-router-dom';
import styles from './Nav.module.scss';

const nav = props => {
    return(
        <nav>
            <ul>          
                <li><Link className={styles.linkColor} exact="true" to="/" >Home</Link></li>
                <li><Link className={styles.linkColor} to="/contact" >Contact</Link></li>
                <li><Link className={styles.linkColor} to="/login" >Login</Link></li>
            </ul>  
        </nav>
    );
};

export default nav;