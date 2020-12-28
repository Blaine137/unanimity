import React from 'react';
import styles from './LoginForm.module.scss';
import { FormControl, InputLabel, OutlinedInput, Grid, Button } from '@material-ui/core';

const LoginForm = props => {
    return(
        <main className={`${styles.wrapper} ${styles.backgroundImage}`}>
            <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
            <form className={ styles.form }>
                <fieldset>
                    <legend>Unanimity Messenger Login</legend>
                    <FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="userNameID">Username</InputLabel>
                        <OutlinedInput id="userNameID" 
                                    inputProps={{ 'aria-label': 'Username text input field', 'type': 'text', 'name': 'userNameID', 'required': true}} 
                                    label="Username"
                            />    
                    </FormControl>    
                    <FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="passwordID">Password</InputLabel>
                        <OutlinedInput id="passwordID" 
                                    inputProps={{ 'aria-label': 'password text input field', 'type': 'password', 'name': 'passwordID', 'required': true}} 
                                    label="Password"
                            />    
                    </FormControl> 
                    <FormControl fullWidth={true} margin="normal">
                        <Grid container spacing={4} direction="row" alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Button 
                                    aria-label="Submit Login information button" 
                                    type="submit" 
                                    value="Log in" 
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={ e => { 
                                        props.checkName(e , document.getElementById('userNameID'), document.getElementById('passwordID')) 
                                    } }
                                >
                                    Log in
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button 
                                    aria-label="Register For Account button"
                                    type="submit" 
                                    value="Register" 
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    className={styles.register}
                                    fullWidth 
                                    onClick={ e => {
                                        props.checkForNewUser(e, document.getElementById('userNameID'), document.getElementById('passwordID')) 
                                    } }  
                                >
                                    Register
                                </Button>
                            </Grid>    
                        </Grid>    
                    </FormControl> 
                </fieldset>
            </form>
            <p>This Project's Database is public so that people can see how the project works!</p>
        </main>    
    );
};

export default LoginForm;