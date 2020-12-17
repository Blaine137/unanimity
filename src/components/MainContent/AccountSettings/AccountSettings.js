import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import UpdatePasswordForm from './UpdatePwdForm/UpdatePwdForm';
import UpdateUsernameForm from './UpdateUsernameForm/UpdateUsernameForm';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import DOMPurify from 'dompurify';
import axios from '../../../axios';

/*
This component is opened from the option menu and is loaded where the chatroom would be. This is a parent component that
shows a list of settings to users and is responsible for show/hiding child components like updatePwdForm and UpdateUsernameForm.

ps. This component is currently loaded into the header and not the chatroom section and is just styled to look like it is in the chatroom.
*/
const AccountSettings = props => {
	const [showUpdatePwdForm, setShowUpdatePwdForm] = useState(false);
	const [showUpdateUsernameForm, setShowUpdateUsernameForm] = useState(false);

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
		setShowUpdateUsernameForm(false);
		setShowUpdatePwdForm(false);
	}

	const showBackBtn = () => {
		if( showUpdateUsernameForm || showUpdatePwdForm) {
			return <button aria-label="Go back to account settings" onClick={goToAccountSettingsHome} className={styles.closeSettings}>&larr;</button>
		}
	}

	const showAccountSettingsForm = () => {
		if(showUpdateUsernameForm) {	
			return <UpdateUsernameForm 
						checkPasswordInput={ checkPasswordInput } 
						authUsername={ props.authUsername } 
						setAreSettingsShowing={ props.setAreSettingsShowing} 
						authUID={ props.authUID } 
						showHideCustomAlert={props.showHideCustomAlert}
					/>;
		} else if(showUpdatePwdForm) {
			return <UpdatePasswordForm 
						checkPasswordInput={ checkPasswordInput } 
						setAreSettingsShowing={ props.setAreSettingsShowing } 
						authUID={ props.authUID }
						showHideCustomAlert={props.showHideCustomAlert}
					/>;		
		} else {
			return (
				<>		
					<button aria-label="open up a form where you can update your username" className={styles.settingOptions} onClick={ () => setShowUpdateUsernameForm(true) }>Update Username</button>
					<button aria-label="open up a form where you can update your password" className={styles.settingOptions} onClick={ () => setShowUpdatePwdForm(true) }>Update Password</button>
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