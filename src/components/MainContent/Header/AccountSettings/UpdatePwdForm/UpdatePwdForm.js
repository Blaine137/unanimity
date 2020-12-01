import React, { useState } from "react";
import DOMPurify from 'dompurify';
import styles from '../AccountSettings.module.scss';
import axios from '../../../../../axios';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash

const UpdatePwdForm = props => {
	let [oldPassword, setOldPassword] = useState('');
	let [newPassword, setNewPassword] = useState('');
	let [pwdError, setPwdError] = useState('');

	//calls checkPwd if correct then updates db to new pwd for auth user
	const handlePwdSubmit = async e => {
		e.preventDefault();
		let passwordCorrect;
		if(oldPassword.length > 5 && newPassword.length > 5) {	
			passwordCorrect = await props.checkPwd(oldPassword);
			if(passwordCorrect && passwordCorrect !== 300) {
				let newHashedPassword = passwordHash.generate(newPassword);
				//Cant not set pwd field to string becuase axios requires to pass object. So we have to pass the entire user object with the updated pwd.
				let oldUser = await  axios.get('users/u' + props.authUID + '.json')
				.catch(err => console.log(err));
				let updatedUser = {...oldUser.data};
				updatedUser.password = newHashedPassword;
			    axios.put('users/u' + props.authUID + '.json', updatedUser)
				.then(res => {
					if(res) {
						console.log('changed password!!!');
						props.setShowSettings(false);
					}
				})
				.catch(err => setPwdError(`${pwdError} Failed to update Password: ${err}`));			
			} else {
				setPwdError(`${pwdError} Incorrect current password.`);
			}
		} else {
			setPwdError(`${pwdError} Password must be at least five characters long.`);
		}
	}

	return(
		<form onSubmit={ handlePwdSubmit } className={ styles.form }>
			<legend>Update Your Password</legend>
			<label htmlFor="oldPassword">Current Password</label>
			<input 
				className={ styles.input }
				type="text" 
				id="oldPassword" 
				name="oldPassword" 
				placeholder="Enter your current password"
				onChange={ e => setOldPassword(e.target.value) }
			/>
			<label htmlFor="newPassword">New Password</label>
			<input
				className={ styles.input } 
				type="text" 
				id="newPassword" 
				name="newPassword" 
				placeholder="Enter your new password"
				onChange={ e => setNewPassword(e.target.value) }
			/>
			<span>{pwdError}</span>
			<button className={ styles.submit }>Submit</button>
		</form>	
	);
}

export default UpdatePwdForm;