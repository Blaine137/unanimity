import React, { useState } from "react";
import DOMPurify from 'dompurify';
import styles from '../AccountSettings.module.scss';
import axios from '../../../../axios';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import { motion } from "framer-motion";
import { FormControl, InputLabel, OutlinedInput, Button } from '@material-ui/core';

/*
Child component of account settings. Is a form that takes in the current password and a new password to update .
Handles updating the database to the new password.
*/
const UpdatePasswordForm = props => {
	let [oldPassword, setOldPassword] = useState('');
	let [newPassword, setNewPassword] = useState('');
	let [confirmNewPassword, setConfirmNewPassword] = useState('');
	let [passwordInputError, setPasswordInputError] = useState('');

	//adds new password to database for authenticated user
	const updatePasswordInDatabase = async () => {
		let newHashedPassword = passwordHash.generate(newPassword);
		//Cant not set pwd field to string because firebase requires to pass object. So we have to pass the entire user object with the updated pwd property.
		let oldUser = await axios.get('users/u' + props.authUID + '.json')
		.catch(err => props.showHideCustomAlert(`${passwordInputError} Failed to update Password: ${err}`));
		let updatedUser = {...oldUser.data};
		updatedUser.password = newHashedPassword;
		axios.put('users/u' + props.authUID + '.json', updatedUser)
		.then(res => {
			if(res) {
				props.setAreSettingsShowing(false);
				props.showHideCustomAlert('Password successfully changed!', true)
			}
		})
		.catch(err => props.showHideCustomAlert(`${passwordInputError} Failed to update Password: ${err}`));	
	}

	//sanitizes and validates the new password. Then it confirms newPassword and ConfirmNewPassword are the same. Return True if it passes all checks else it returns false.
	const validateNewPassword = async () => {
		if(newPassword.length > 5) {	
			if(newPassword === confirmNewPassword) {
				return true;
			} else {
				props.showHideCustomAlert('Passwords do not match.');
				return false;
			}
		} else {
			props.showHideCustomAlert('New Password must be at least five characters long.');
			return false;
		}
	}

	/**
	 * sanitizes all the passwords that are in the state.
	 */
	const sanitizePasswordInState = async () => {
		let oldPasswordSanitized = await DOMPurify.sanitize(oldPassword);
		oldPasswordSanitized = await oldPasswordSanitized.replace(/[^\w]/g,'');
		await setOldPassword(oldPasswordSanitized);

		let newPasswordSanitized = await DOMPurify.sanitize(newPassword);
		newPasswordSanitized = await newPasswordSanitized.replace(/[^\w]/g,'');
		await setNewPassword(newPasswordSanitized);

		let confirmNewPasswordSanitized = await DOMPurify.sanitize(confirmNewPassword);
		confirmNewPasswordSanitized = await confirmNewPasswordSanitized.replace(/[^\w]/g,'');
		await setConfirmNewPassword(confirmNewPasswordSanitized);
	}

	/**
	 * Calls all the steps needed to update the password in order
	 */
	const updatePasswordOrchestrator = async e => {
		e.preventDefault();
		setPasswordInputError('');
		await sanitizePasswordInState();
		let isPasswordCorrect = await props.checkPasswordInput(oldPassword);
		if(isPasswordCorrect && isPasswordCorrect !== 300) {
			if(await validateNewPassword()) {
				updatePasswordInDatabase();
			}
		} else {
			props.showHideCustomAlert('Incorrect current password.');
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
			<form onSubmit={ updatePasswordOrchestrator } className={ styles.form }>
				<legend>Update Your Password</legend>
				<span>{passwordInputError}</span>
				<FormControl fullWidth={true} variant="outlined" margin="normal">
					<InputLabel htmlFor="oldPassword">
						Old Password
					</InputLabel>
					<OutlinedInput 
								id="oldPassword" 
								inputProps={{ 'aria-label': 'Enter your current password', 'type': 'password', 'name': 'oldPassword', 'required': 'true'}} 
								label="oldPassword"
								onChange={ e => setOldPassword(e.target.value) }
						/>    
				</FormControl> 
				<FormControl fullWidth={true} variant="outlined" margin="normal">
					<InputLabel htmlFor="newPassword">
						New Password
					</InputLabel>
					<OutlinedInput 
								id="newPassword" 
								inputProps={{ 'aria-label': 'Enter your new password', 'type': 'password', 'name': 'newPassword', 'required': 'true'}} 
								label="newPassword"
								onChange={ e => setNewPassword(e.target.value) }
						/>    
				</FormControl> 
				<FormControl fullWidth={true} variant="outlined" margin="normal">
					<InputLabel htmlFor="confirmNewPassword">
						Confirm Password
					</InputLabel>
					<OutlinedInput 
								id="confirmNewPassword" 
								inputProps={{ 'aria-label': 'confirm your new password', 'type': 'password', 'name': 'confirmNewPassword', 'required': 'true'}} 
								label="confirmNewPassword"
								onChange={ e => setConfirmNewPassword(e.target.value) }
						/>    
				</FormControl>
				<span role="alert" aria-label="Errors for entered data in the password form will display here">{passwordInputError}</span>
				<Button 
					aria-label="Click to proceed updating your password" 
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

export default UpdatePasswordForm;