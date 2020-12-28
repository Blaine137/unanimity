import React, { useState } from "react";
import styles from "./AccountSettings.module.scss";
import UpdatePasswordForm from './UpdatePassworddForm/UpdatePasswordForm';
import UpdateUsernameForm from './UpdateUsernameForm/UpdateUsernameForm';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import DOMPurify from 'dompurify';
import axios from '../../../axios';
import { Button, IconButton, Grid, Typography } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CloseIcon from '@material-ui/icons/Close';

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
			return <IconButton 
				aria-label="Go back to account settings" 
				onClick={goToAccountSettingsHome} 
				className={styles.closeSettings}
				color="primary"
				style={{float: 'right'}}
				>
					<KeyboardBackspaceIcon/>
				</IconButton>
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
					<Grid container spacing={2}>
						<Grid item xs={12} justify="space-between">
							<Button 
								aria-label="open up a form where you can update your username" 
								onClick={ () => setIsUpdateUsernameFormShowing(true) }
								variant="contained"
								color="primary"
							>
									Update Username
							</Button>
						</Grid>
						<Grid item xs={12} justify="space-around">
							<Button 
								aria-label="open up a form where you can update your password" 
								onClick={ () => setIsUpdatePwdFormShowing(true) }
								variant="contained"
								color="primary"
							>
									Update Password
							</Button>
						</Grid>
					</Grid>
				</>
			);
		}
	}
	
	return(
		<div role="menu" className={ styles.container }> 
			<Grid container justify="center" alignItems="center">
				<Grid item xs={6}>
					{showBackBtn()}
					<IconButton 
						aria-label="close account settings menu" 
						className={ styles.closeSettings } 
						onClick={ () => props.setAreSettingsShowing(false) }
						color="primary"
						style={{float: "right"}}
					>
							<CloseIcon/>
					</IconButton>
				</Grid>
				<Grid item xs={6}>
					<Typography 
							variant="h6"
							style={{display: 'inline', float: "left"}}>
						Account settings
					</Typography>
				</Grid>
			</Grid>
			{showAccountSettingsForm()}
		</div>
	);
}

export default AccountSettings;