import React from "react";
import styles from "./addChatRoom.module.scss";
import DOMPurify from 'dompurify';

/*
child component of sidebar.
Form that takes in the name of the user they would like to start chatting with. 
on Submit it closes out of itself and calls a function from props to create the chatroom.
*/
const addChatRoom = props => {
	return(
		<div className={ styles.popUpContainer }>                                  
			<form 
				onSubmit={ e => {
						props.addChatRoom( e , DOMPurify.sanitize(document.getElementById( 'newChatRoomName' ).value) ) 
						//on submit of popup close the popup
						props.togglePopUp();
				}}
				className={ styles.form } 
			>               
				<div 
					tabIndex="0" 
					aria-label="Close Add ChatRoom pop up button."   
					className={ styles.closeBurger }
					role="button"
					onClick={ () => props.togglePopUp() } 
					onKeyDown={ e => { if(e.key === 'Enter') { props.togglePopUp(); } } }
				>
					<div className={ styles.closeTop } ></div>
					<div className={ styles.closeBottom }></div>
				</div>
				<legend>Add a Chatroom.</legend>
				<fieldset>
					<label htmlFor="newChatRoomName">Recipient's Username</label>
					<input 
						type="text" 
						id="newChatRoomName" 
						name="newChatRoomName" 
						className={styles.input}
						aria-label="Enter the username of the recipient you would like to add a chatroom with."
						placeholder="enter user name of recipient!"
					/>
					<input aria-label="add chatroom with this user" type="submit" value="Add Chatroom" className={ styles.submit}/>
				</fieldset>
			</form>
        </div>
	);
}

export default addChatRoom;