import React from 'react';
import DOMPurify from 'dompurify';
import { Alert } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
/*
User interface component that shows a red Alert with custom message at top of the app.
Takes in from props alert Message and a function to close the alert.
*/
const CustomAlert = props => {
    let sanitizedAlertMessage = null;
    sanitizedAlertMessage = DOMPurify.sanitize(props.alertMessage);
    sanitizedAlertMessage = sanitizedAlertMessage.replace(/[^\w\s!?$]/g,'');   

    return (      
            <Alert 
                severity={ `${props.isSuccess ? 'success' : 'error'}` }
                action={
                    <IconButton
                        aria-label="close alert message"
                        color="inherit"
                        size="small"
                        onClick={() => props.alertClose()}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
              }
            >
              <span role="alert" aria-label="Alert message from unanimity about some error.">{ sanitizedAlertMessage }</span> 
            </Alert>
    );
};

export default CustomAlert;