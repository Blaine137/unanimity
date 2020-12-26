import React from "react";
import styles from "./addChatRoomPopUpForm.module.scss";
import DOMPurify from 'dompurify';
import { FormControl, InputLabel, OutlinedInput, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

/*
child component of sidebarOfConversations.
Form that takes in the name of the user they would like to start chatting with. 
on Submit it closes out of itself and calls a function from props to create the chatroom.
*/
const addChatRoomPopUpForm = props => {
	return(
		<div className={ styles.popUpContainer }>                                  
			<form 
				onSubmit={ e => {
						props.addChatRoom( e , DOMPurify.sanitize(document.getElementById( 'newChatRoomName' ).value) ) 
						//on submit of popup close the popup
						props.toggleIsAddChatRoomPopUpShowing();
				}}
				className={ styles.form } 
			>               
				<div 
					tabIndex="0" 
					aria-label="Close Add ChatRoom pop up button."   
					className={ styles.closeBurger }
					role="button"
					onClick={ () => props.toggleIsAddChatRoomPopUpShowing() } 
					onKeyDown={ e => { if(e.key === 'Enter') { props.toggleIsAddChatRoomPopUpShowing(); } } }
				>
					<div className={ styles.closeTop } ></div>
					<div className={ styles.closeBottom }></div>
				</div>
				<legend>Add a Chatroom.</legend>
				<fieldset>
					<FormControl fullWidth={true} variant="outlined" margin="normal">
						<InputLabel htmlFor="newChatRoomName">Recipient's Username</InputLabel>
						<OutlinedInput id="newChatRoomName" 
										inputProps={{ 'aria-label': 'Enter the username of the recipient you would like to add a chatroom with', 'type': 'text', 'name': 'newChatRoomName', 'required': 'true'}} 
										label="Recipient's Username"
							/>          
                    </FormControl> 
					<Button 
						type="submit" 
						aria-label="add chatroom with this user" 
						variant="contained" 
						color="primary"
						size="large"
						fullWidth 
					>
						Add Chatroom 
					</Button>
				</fieldset>
			</form>
        </div>
	);
}

export default addChatRoomPopUpForm;