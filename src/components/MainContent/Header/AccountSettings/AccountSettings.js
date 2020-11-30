import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import DOMPurify from 'dompurify';
import axios from '../../../../axios';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash

const AccountSettings = props => {
	let [oldPassword, setOldPassword] = useState('');
	let [newPassword, setNewPassword] = useState('');

	const checkPwdForUserID = async ( checkPassword) => {
		checkPassword = DOMPurify.sanitize(checkPassword);
		checkPassword = checkPassword.replace(/[^\w^!?$]/g,'');
		 try {
			 let hashedPassword = await axios.get('users/u' + props.authUID + '/password.json')
			 .catch(err => console.log(err));
			 hashedPassword = hashedPassword.data;
			 if(passwordHash.verify(checkPassword, hashedPassword)) {    
				 return true;                     
			 } else {			 
				return false;
			 }
		 } catch {
			 return 300;
		 }  
	}

	const handleSubmit = async e => {
		e.preventDefault();
		let passwordCorrect;
		if(oldPassword.length > 5) {
			passwordCorrect = checkPwdForUserID(oldPassword);
			if(passwordCorrect){
				let newHashedPassword = passwordHash.generate(newPassword);
				let oldUser = await axios.get('users/u' + props.authUID + '.json')
				.catch(err => console.log(err));
				let updatedUser = {...oldUser.data};
				updatedUser.password = newHashedPassword;
				
			    axios.put('users/u' + props.authUID + '.json', updatedUser)
				.then(res => {
					if(res){
						console.log('changed password!!!')
					}
				})
				.catch(err => console.log('err..', err));
			}
		} else {
			/*


				TODO: Make this error work


			*/
			console.log('To short of password');
		}
		props.setShowSettings(false);
	}
	return(
		<div className={ styles.container }> 
			<button className={ styles.closeSettings } onClick={ () => props.setShowSettings(false) }>&times;</button>
			<h3 style={ { display: "inline" } }>Account settings</h3>
			<form onSubmit={ handleSubmit } className={ styles.form }>
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
				<button className={ styles.submit }>Submit</button>
			</form>	
		</div>
	);
}

export default AccountSettings;