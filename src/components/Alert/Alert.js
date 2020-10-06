import React, { Fragment } from 'react';
import styles from './Alert.module.scss';
import DOMPurify from 'dompurify';

const alert = props => {
    let alertDisplay = null;
    let sanitizedMessage = null;
    if(props.alertMessage && props.alertClose) {
        sanitizedMessage = DOMPurify.sanitize(props.alertMessage);
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');
        alertDisplay =  (
            <div className={ styles.alertContainer } >                          
                <span 
                    className={ styles.alertClose } 
                    tabIndex="0" 
                    aria-label="Close alert message." 
                    onClick={ () => { props.alertClose(); } } 
                    onKeyDown={ e => { if(e.key === 'Enter') { this.props.alertClose(); } } }
                > 
                    &times; 
                </span>
                <span className={ styles.alertMessage }>{ sanitizedMessage }</span>
            </div>
        );
    };
    return (
        <Fragment>
            { alertDisplay }
        </Fragment> 
    );
};

export default alert;