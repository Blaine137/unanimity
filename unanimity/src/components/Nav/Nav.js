import React from 'react';
import './Nav.module.scss';
import { Link } from 'react-router-dom';

const nav = ( props ) => {
    return(
        <nav>
            <ul>          
                <li><Link style={{color: '#05386B'}} exact="true" to="/" >Home</Link></li>
                <li><Link style={{color: '#05386B'}} to="/contact" >Contact</Link></li>
                <li><Link style={{color: '#05386B'}} to="/login" >Login</Link></li>
            </ul>  
        </nav>
    );
};

export default nav;