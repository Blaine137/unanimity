import React, { useState } from "react";
import styles from '../AccountSettings.module.scss';
import DOMPurify from 'dompurify';
import axios from '../../../../../axios';

const UpdateUsernameForm = props => {
	let [newUsername, setNewUsername] = useState('');
	let [confirmUsername, setConfirmUsername] = useState('');
    let [errors, setErrors] = useState('');
	let [password, setPassword] = useState('');

	//calls checkUsername if correct then updates db to new username for auth user
	const handleUsernameSubmit = async e => {
        e.preventDefault();
        let sanitizedUsername;
        let passwordCorrect = await props.checkPwd(password);
        if(passwordCorrect) {      
            //change username in users db
            let oldUsername = await  axios.get('users/u' + props.authUID + '.json')
            .catch(err => console.log('username error: ', err));
            let updatedUsername = {...oldUsername.data};
			
			if(newUsername == confirmUsername){
				updatedUsername.userName = newUsername.toLowerCase();
				updatedUsername.userName = DOMPurify.sanitize(updatedUsername.userName);
				updatedUsername.userName.replace(/[^\w]/g,'');
				sanitizedUsername = updatedUsername.userName;
				axios.put('users/u' + props.authUID + '.json', updatedUsername)
				.then(res => {
					console.log('username successfully changed!!')
					props.setShowSettings(false);
				})
				.catch(err => console.log('username did not change: ', err));

				//change username in userIDByUsername
				const userIDByUsername = await axios.get('userIDByUsername.json');
				let updatedUserIDByUsername = {...userIDByUsername.data};
				delete updatedUserIDByUsername[props.authUsername];
				//add the new name with props.authUID as value
				updatedUserIDByUsername[sanitizedUsername] = props.authUID;
				
				axios.put('userIDByUsername.json', updatedUserIDByUsername)
				.then(res => props.setShowSettings(false))
				.catch(err => console.log('did not update userid db: ', err));
			}

        } else {
            setErrors('Your password or new username was incorrect.');
		}	
    }
    
	return(
		<div className={ styles.container }> 
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
				<span role="alert" aria-label="Errors with your form data will be displayed here.">{errors}</span>
				<button aria-label="Click to proceeding updating your account username." className={ styles.submit }>Submit</button>	
			</form>	
		</div>
	);
}

export default UpdateUsernameForm;																																																																																			