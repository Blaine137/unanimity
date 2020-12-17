import React, { useState } from "react";
import styles from '../AccountSettings.module.scss';
import DOMPurify from 'dompurify';
import axios from '../../../../axios';
import { motion } from "framer-motion";
/*
Child component of account settings. Is a form that takes the current password and the new username to update . 
Handles logic for updating the username in the database. 
*/
const UpdateUsernameForm = props => {
	let [newUsername, setNewUsername] = useState('');
	let [confirmUsername, setConfirmUsername] = useState('');
	let [password, setPassword] = useState('');

	//call check password function from props. If the password is correct it updated the database with new username.
	const handleUsernameSubmit = async e => {
        e.preventDefault();
        let sanitizedUsername;
        let passwordCorrect = await props.checkPasswordInput(password);
        if(passwordCorrect) {      
            //change username in users db
            let oldUsername = await  axios.get('users/u' + props.authUID + '.json')
            .catch(err => props.showHideCustomAlert('Failed to update username'));
            let updatedUsername = {...oldUsername.data};		
			if(newUsername === confirmUsername) {
				updatedUsername.userName = newUsername.toLowerCase();
				updatedUsername.userName = DOMPurify.sanitize(updatedUsername.userName);
				updatedUsername.userName.replace(/[^\w]/g,'');
				sanitizedUsername = updatedUsername.userName;
				axios.put('users/u' + props.authUID + '.json', updatedUsername)
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
			}
        } else {
            props.showHideCustomAlert('Your password was incorrect.');
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
				<form onSubmit={ handleUsernameSubmit } className={ styles.form }>
					<legend>Update Your Username</legend>
					<label htmlFor="newUsername">New Username</label>
					<input
						className={ styles.input } 
						type="text" 
						id="newUsername" 
						name="newUsername" 
						placeholder="Enter your new username"
						aria-label="Enter your new username"
						onChange={ e => setNewUsername(e.target.value) }
					/>
					<label htmlFor="confirmUsername">Confirm Username</label>
					<input
						className={ styles.input } 
						type="text" 
						id="confirmUsername" 
						name="confirmUsername" 
						placeholder="Confirm your new username"
						aria-label="confirm your new username"
						onChange={ e => setConfirmUsername(e.target.value) }
					/>
					<label htmlFor="password">Password</label>
					<input
						className={ styles.input } 
						type="password" 
						id="password" 
						name="password" 
						placeholder="Enter your password"
						aria-label="enter your password for your account"
						onChange={ e => setPassword(e.target.value) }
					/>
					<button aria-label="Click to proceeding updating your account username." className={ styles.submit }>Submit</button>	
				</form>	
			</motion.div>
	);
}

export default UpdateUsernameForm;																																																																																			