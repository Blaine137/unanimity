import React from 'react';
import DOMPurify from 'dompurify';
import {
  FormControl, InputLabel, OutlinedInput, IconButton, Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import styles from './addChatRoomPopUpForm.module.scss';

/*
child component of sidebarOfConversations.
Form that takes in the name of the user they would like to start chatting with.
on Submit it closes out of itself and calls a function from props to create the chatroom.
*/
const addChatRoomPopUpForm = (props) => (
  <div className={styles.popUpContainer}>
    <form
      onSubmit={(e) => {
        props.addChatRoom(e, DOMPurify.sanitize(document.getElementById('newChatRoomName').value));
        // on submit of popup close the popup
        props.toggleIsAddChatRoomPopUpShowing();
      }}
      className={styles.form}
    >
      <IconButton
        tabIndex="0"
        onClick={() => props.toggleIsAddChatRoomPopUpShowing()}
        aria-label="Close add chat room pop up"
        size="small"
        className={styles.closeAddChatroomPopUp}
      >
        <CloseIcon color="primary" />
      </IconButton>
      <legend>Add a Chatroom.</legend>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel htmlFor="newChatRoomName">Recipient's Username</InputLabel>
        <OutlinedInput
          id="newChatRoomName"
          inputProps={{
            'aria-label': 'Enter the username of the recipient you would like to add a chatroom with', type: 'text', name: 'newChatRoomName', required: true,
          }}
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
    </form>
  </div>
);

export default addChatRoomPopUpForm;
