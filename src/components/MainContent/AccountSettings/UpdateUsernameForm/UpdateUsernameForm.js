import React, { useState } from "react";
import styles from '../AccountSettings.module.scss';
import DOMPurify from 'dompurify';
import axios from '../../../../axios';
import { motion } from "framer-motion";
import { FormControl, InputLabel, OutlinedInput, Button } from '@material-ui/core';

/*
Child component of account settings. Is a form that takes the current password and the new username to update . 
Handles logic for updating the username in the database. 
*/
const UpdateUsernameForm = props => {
	let [newUsername, setNewUsername] = useState('');
	let [confirmUsername, setConfirmUsername] = useState('');
	let [password, setPassword] = useState('');

	//makes sure password is correct. If password is correct then it calls UpdateUsernameInDatabase.
	const checkPassword = async e => {
		e.preventDefault();
        let isPasswordCorrect = await props.checkPasswordInput(password);
        if(isPasswordCorrect) {  
			validateSanitizeAndUpdateUsernameInDatabase();
		} else {
			props.showHideCustomAlert('Your password was incorrect.');
		}	
	}

	//confirms that newUsername and confirmUsername equal the same. Then sanitizes newUsername. Then Updated the database.
	const validateSanitizeAndUpdateUsernameInDatabase = async() => {
		let sanitizedUsername;
		//change username in users db
		let oldUserDataObject = await axios.get('users/u' + props.authUID + '.json')
		.catch(err => props.showHideCustomAlert('Failed to update username'));
		let updatedUserObject = {...oldUserDataObject.data};		
		if(newUsername === confirmUsername) {
			updatedUserObject.userName = newUsername.toLowerCase();
			updatedUserObject.userName = DOMPurify.sanitize(updatedUserObject.userName);
			updatedUserObject.userName.replace(/[^\w]/g,'');
			sanitizedUsername = updatedUserObject.userName;
			axios.put('users/u' + props.authUID + '.json', updatedUserObject)
			.then(res => {
				props.showHideCustomAlert('username successfully changed!!', true)
				props.setAreSettingsShowing(false);
			})
			.catch(err => props.showHideCustomAlert(`Failed to update username in the database: ${err}`));

			//change username in userIDByUsername
			const userIDByUsername = await axios.get('userIDByUsername.json');
			let updatedUserIDByUsername = {...userIDByUsername.data};
			delete updatedUserIDByUsername[props.authUsername];
			//add the new name with props.authUID as value
			updatedUserIDByUsername[sanitizedUsername] = props.authUID;

			axios.put('userIDByUsername.json', updatedUserIDByUsername)
			.then(res => {props.setAreSettingsShowing(false); props.showHideCustomAlert('Changed username successfully!', true)})
			.catch(err => props.showHideCustomAlert(`Failed to update username by userID in the database: ${err}`));
		} else {
			props.showHideCustomAlert('User names do not match.');
		}
    }
    
	return(
			<motion.div initial="hidden" animate="visible" variants={{
				hidden: {
					opacity: 0
				},
				visible: {
					opacity: 1,
					scale: 1
				}
			}}>
				<form onSubmit={ checkPassword } className={ styles.form }>
					<legend>Update Your Username</legend>
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="newUsername">New Username</InputLabel>
						<OutlinedInput 
									id="newUsername" 
                                    inputProps={{ 'aria-label': 'Enter your new username', 'type': 'text', 'name': 'newUsername', 'required': 'true'}} 
									label="newUsername"
									onChange={ e => setNewUsername(e.target.value) }
                            />    
                    </FormControl> 
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="confirmUsername">Confirm Username</InputLabel>
						<OutlinedInput 
									id="confirmUsername" 
                                    inputProps={{ 'aria-label': 'Confirm your new username', 'type': 'text', 'name': 'confirmUsername', 'required': 'true'}} 
									label="confirmUsername"
									onChange={ e => setConfirmUsername(e.target.value) }
                            />    
                    </FormControl> 
					<FormControl fullWidth={true} variant="outlined" margin="normal">
                        <InputLabel htmlFor="password">Password</InputLabel>
						<OutlinedInput 
									id="password" 
                                    inputProps={{ 'aria-label': 'Enter the password for your account', 'type': 'password', 'name': 'password', 'required': 'true'}} 
									label="password"
									onChange={ e => setPassword(e.target.value) }
                            />    
                    </FormControl>
					<Button 
						aria-label="Click to proceeding updating your account username." 
						type="submit"
						variant="contained"
						color="primary"
					>
						Submit
					</Button>	
				</form>	
			</motion.div>
	);
}

export default UpdateUsernameForm;																																																																																			