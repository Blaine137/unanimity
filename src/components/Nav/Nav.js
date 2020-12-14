import React from 'react';
import './Nav.module.scss';
import { Link } from 'react-router-dom';
import styles from './Nav.module.scss';

/*
user interface component that is just a navigate with react router links. 
Displayed on the Home, Contact, Login, and FQA page. Is not shown once logged in
or on login page.
*/
const nav = props => {
    return(
        <nav>
            <ul>     
                {/* link component is rendered as <a></a> and dose not need role="link" */}     
                <li><Link aria-label="go to the home page" className={styles.linkColor} exact="true" to="/" >Home</Link></li>
                <li><Link aria-label="go to the contact page" className={styles.linkColor} to="/contact" >Contact</Link></li>
                <li><Link aria-label="go to the login page" className={styles.linkColor} to="/login" >Login</Link></li>
                <li><Link aria-label="go to the frequently asked page" className={styles.linkColor} to="/FAQ" >FAQ</Link></li>
            </ul>  
        </nav>
    );
};

export default nav;