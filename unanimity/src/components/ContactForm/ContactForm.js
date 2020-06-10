import React, {Fragment} from 'react';
import styles from './ContactForm.module.scss';

const contactForm = () => {

    return(

        <Fragment>
                        <div className = { styles.wrapper }>

                    <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                     
                    <form className = { styles.form }  >
                        <fieldset>

                            <legend>Contact Unanimity!</legend>
                            
                            <label htmlFor = "Email" >Email</label>
                            <input aria-label = "Email Text input" type = "Email" id = "Email" name = "Email" className = { styles.input } />

                            <label htmlFor = "Comments">Comments</label>
                            <textarea id = "Comments" rows="4" cols="40" placeholder = "Enter your comment here..."></textarea>

                            <input aria-label = "Submit Login information" type = "submit" value = "Submit" className = { styles.submit } /> 

                        </fieldset>
                        
                    </form>
                    
                </div>
        </Fragment>

    );

};

export default contactForm;