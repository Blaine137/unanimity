import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import UpdatePasswordForm from './UpdatePassworddForm/UpdatePasswordForm';
import UpdateUsernameForm from './UpdateUsernameForm/UpdateUsernameForm';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import DOMPurify from 'dompurify';
import axios from '../../../axios';

/*
This component is opened from the option menu and is loaded where the UserMessages would be. This is a parent component that
shows a list of settings to users and is responsible for show/hiding child components like updatePwdForm and UpdateUsernameForm.
*/
const AccountSettings = props => {
	const [isUpdatePwdFormShowing, setIsUpdatePwdFormShowing] = useState(false);
	const [isUpdateUsernameFormShowing, setIsUpdateUsernameFormShowing] = useState(false);

	//checks if current password entered is equal to auth user pwd on db.
	const checkPasswordInput = async checkPassword => {
		checkPassword = DOMPurify.sanitize(checkPassword);
		checkPassword = checkPassword.replace(/[^\w^!?$]/g,'');
		 try {
			 let hashedPassword = await axios.get('users/u' + props.authUID + '/password.json')
			 .catch(err => console.log(err));
			 hashedPassword = hashedPassword.data;
			 return passwordHash.verify(checkPassword, hashedPassword);   
		 } catch {
			 return 300;
		 }  
	}

	const goToAccountSettingsHome = () => {
		setIsUpdateUsernameFormShowing(false);
		setIsUpdatePwdFormShowing(false);
	}

	const showBackBtn = () => {
		if( isUpdateUsernameFormShowing || isUpdatePwdFormShowing) {
			return <button aria-label="Go back to account settings" onClick={goToAccountSettingsHome} className={styles.closeSettings}>&larr;</button>
		}
	}

	const showAccountSettingsForm = () => {
		if(isUpdateUsernameFormShowing) {	
			return <UpdateUsernameForm 
						checkPasswordInput={ checkPasswordInput } 
						authUsername={ props.authUsername } 
						setAreSettingsShowing={ props.setAreSettingsShowing} 
						authUID={ props.authUID } 
						showHideCustomAlert={props.showHideCustomAlert}
					/>;
		} else if(isUpdatePwdFormShowing) {
			return <UpdatePasswordForm 
						checkPasswordInput={ checkPasswordInput } 
						setAreSettingsShowing={ props.setAreSettingsShowing } 
						authUID={ props.authUID }
						showHideCustomAlert={props.showHideCustomAlert}
					/>;		
		} else {
			return (
				<>		
					<button aria-label="open up a form where you can update your username" className={styles.settingOptions} onClick={ () => setIsUpdateUsernameFormShowing(true) }>Update Username</button>
					<button aria-label="open up a form where you can update your password" className={styles.settingOptions} onClick={ () => setIsUpdatePwdFormShowing(true) }>Update Password</button>
				</>
			);
		}
	}
	
	return(
		<div role="menu" className={ styles.container }> 
			{showBackBtn()}
			<button aria-label="close account settings menu" className={ styles.closeSettings } onClick={ () => props.setAreSettingsShowing(false) }>&times;</button>
			<h3 style={ { display: "inline" } }>Account settings</h3>
			{showAccountSettingsForm()}
		</div>
	);
}

export default AccountSettings;