import React, { useState } from "react";
import DOMPurify from 'dompurify';
import styles from '../AccountSettings.module.scss';
import axios from '../../../../axios';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import { motion } from "framer-motion";

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
		newPassword = await DOMPurify.sanitize(newPassword);
		newPassword = await newPassword.replace(/[^\w]/g,'');
		confirmNewPassword = await DOMPurify.sanitize(confirmNewPassword);
		confirmNewPassword = await confirmNewPassword.replace(/[^\w]/g,'');
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

	//sanitize old password. Then checks the old password. If correct calls validateNewPassword. If it passes validation it then calls updatePasswordInDatabase.
	const sanitizeAndCheckOldPassword = async e => {
		e.preventDefault();
		setPasswordInputError('');
		let passwordCorrect;
		oldPassword = await DOMPurify.sanitize(oldPassword);
		oldPassword = await oldPassword.replace(/[^\w]/g,'');
		passwordCorrect = await props.checkPasswordInput(oldPassword);
		if(passwordCorrect && passwordCorrect !== 300) {
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
			<form onSubmit={ sanitizeAndCheckOldPassword } className={ styles.form }>
				<legend>Update Your Password</legend>
				<span>{passwordInputError}</span>
				<label htmlFor="oldPassword">Current Password</label>
				<input 
					className={ styles.input }
					type="password" 
					id="oldPassword" 
					name="oldPassword" 
					placeholder="Enter your current password"
					aria-label="Enter your current password"
					onChange={ e => setOldPassword(e.target.value) }
				/>
				<label htmlFor="newPassword">New Password</label>
				<input
					className={ styles.input } 
					type="password" 
					id="newPassword" 
					name="newPassword" 
					placeholder="Enter your new password"
					aria-label="Enter your new password"
					onChange={ e => setNewPassword(e.target.value) }
				/>
				<label htmlFor="confirmNewPassword">Confirm New Password</label>
				<input
					className={ styles.input } 
					type="password" 
					id="confirmNewPassword" 
					name="confirmNewPassword" 
					placeholder="Please confirm your new password"
					aria-label="Please confirm your new password"
					onChange={ e => setConfirmNewPassword(e.target.value) }
				/>
				<span role="alert" aria-label="Errors for entered data in the password form will display here">{passwordInputError}</span>
				<button aria-label="Click to proceed updating your password" className={ styles.submit }>Submit</button>
			</form>
		</motion.div>
	);
}

export default UpdatePasswordForm;