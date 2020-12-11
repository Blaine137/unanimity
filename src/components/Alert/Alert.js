import React, { Fragment } from 'react';
import styles from './Alert.module.scss';
import DOMPurify from 'dompurify';

/*
User interface component that shows a red Alert with custom message at top of the app.
Takes in from props alert Message and a function to close the alert.
*/
const alert = props => {
    let alertDisplay = null;
    let sanitizedMessage = null;
    if(props.alertMessage && props.alertClose) {
        sanitizedMessage = DOMPurify.sanitize(props.alertMessage);
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');
        if(props.successBoolean === true){
            alertDisplay =  (
                <div className={ styles.alertContainerSuccess } >                          
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
                    <span role="alert" aria-label="Alert message from unanimity about some error." className={ styles.alertMessage }>{ sanitizedMessage }</span>
                </div>
            );
        }else{
            alertDisplay =  (
                <div className={ styles.alertContainerNegative } >                          
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
                    <span role="alert" aria-label="Alert message from unanimity about some error." className={ styles.alertMessage }>{ sanitizedMessage }</span>
                </div>
            );
        }
    };
    return (
        <Fragment>
            { alertDisplay }
        </Fragment> 
    );
};

export default alert;