import React from 'react';
import styles from './CustomAlert.module.scss';
import DOMPurify from 'dompurify';

/*
User interface component that shows a red Alert with custom message at top of the app.
Takes in from props alert Message and a function to close the alert.
*/
const CustomAlert = props => {
    let sanitizedAlertMessage = null;
    sanitizedAlertMessage = DOMPurify.sanitize(props.alertMessage);
    sanitizedAlertMessage = sanitizedAlertMessage.replace(/[^\w\s!?$]/g,'');   
    return (
        <div className={ `${props.isSuccess ? styles.alertContainerSuccess : styles.alertContainerNegative}` } >                          
            <span 
                className={ styles.alertClose } 
                tabIndex="0" 
                role="button"
                aria-label="Close Unanimity alert message." 
                onClick={ () => { props.alertClose(); } } 
                onKeyDown={ e => { if(e.key === 'Enter') { this.props.alertClose(); } } }
            >
                &times; 
            </span>
            <span role="alert" aria-label="Alert message from unanimity about some error." className={ styles.alertMessage }>{ sanitizedAlertMessage }</span>
        </div>
    );
};

export default CustomAlert;