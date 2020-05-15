import React, { Fragment } from 'react';
import styles from './Alert.module.scss';
import DOMPurify from 'dompurify';
/**
 
 takes in two props.
 the alert message to be displayed. As alertMessage
 A function to call once the closed button is clicked to stop displaying the alert. as alertClose

 */
const  alert = ( props ) => {

    //the finished content that is displayed to the user
    let alertDisplay = null;
    let sanitizedMessage = null;

    //have the required data then make the alert
    if ( props.alertMessage && props.alertClose ) {

        //sanitize the alert message. sometimes the alert message contains user entered data. Example: Account register as + username
        sanitizedMessage = DOMPurify.sanitize( props.alertMessage );
        sanitizedMessage = sanitizedMessage.replace(/[^\w\s!?$]/g,'');

        alertDisplay =  (<div className = { styles.alertContainer } >
                            
                            <span className = { styles.alertClose } tabIndex = "0" aria-label="Close alert message." 
                                onClick = { ( ) => { props.alertClose( ); } } 
                                onKeyDown = { ( e ) => { if ( e.key === 'Enter') { this.props.alertClose(); } } }
                            > 

                                &times; 

                            </span>

                            <span className = { styles.alertMessage } > { sanitizedMessage } </span>

                        </div>);

    }//if we have a message and close alert function
    
    return (

        <Fragment>

            { alertDisplay }

        </Fragment>
       
    );
}

export default alert;