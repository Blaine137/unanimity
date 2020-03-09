import React from 'react';
import styles from './Options.module.css';

const options = ( props ) => (

    <div className = { styles.options } >
        <div className = { styles.topCircle } ></div>
        <div className = { styles.middleCircle } ></div>
        <div className = { styles.bottomCircle } ></div>
    </div>

);

export default options;