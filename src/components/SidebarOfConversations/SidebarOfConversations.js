import React, { Component } from 'react';
import {
  FormControl, InputLabel, OutlinedInput, withStyles, Typography, IconButton, Hidden, FormHelperText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import DOMPurify from 'dompurify';
import axios from '../../axios';
import { LightTheme } from '../../Theme';

let ConversationNamesAlreadyInSidebar = [];
let reactKey = 0;

const styles = {
  sidebarContainer: {
    width: '100vw',
    height: '100vh',
    backgroundColor: LightTheme.palette.background.default,
    padding: '1rem',
    position: 'relative',
    transition: 'all 1s ease-in-out',
    textAlign: 'left',
  },
  logo: {
    maxWidth: '50%',
    maxHeight: '3rem',
    marginTop: '1rem',
    marginLeft: '1rem',
    marginRight: 'auto',
    display: 'inline-block',
  },
  closeSidebarContainer: {
    display: 'inline-flex',
    marginLeft: '1rem',
  },
  authenticatedUserContainer: {
    backgroundColor: LightTheme.palette.primary.light,
    height: '15vh',
    borderRadius: '15px',
    display: 'grid',
    alignContent: 'center',
    justifyContent: 'center',
    margin: '3rem 2rem',
    textAlign: 'center',
    maxWidth: '80vw',
  },
  conversationsTitle: {
    textAlign: 'left',
    marginLeft: '1rem',
  },
  chatroomContainer: {
    margin: '2rem',
    textTransform: 'capitalize',
    padding: '0 1rem',
    borderRadius: '15px',
    display: 'grid',
    gridAutoFlow: 'column',
    '&:hover, &:active': {
      backgroundColor: LightTheme.palette.primary.light,
    },
    '&:hover button, &:focus button': {
      opacity: 1,
    },
  },
  conversationCloseButton: {
    opacity: 1,
    transition: 'opacity .3s ease-in',
    marginLeft: '1rem',
    justifyContent: 'end',
  },
  chatroomName: {
    display: 'inline-block',
  },
  addChatroomContainer: {
    marginTop: '3rem',
    marginLeft: '2rem',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'left',
  },
  addChatroomButton: {
    backgroundColor: LightTheme.palette.secondary.main,
    marginRight: '1rem',
  },
  addChatroomIcon: {
    color: LightTheme.palette.background.default,
    '&:hover, &:focus': {
      color: LightTheme.palette.secondary.main,
    },
  },
  addChatroomInput: {
    border: 'none',
    /** margin bottom keeps error message from going behind the input. */
    marginBottom: '.25rem',
  },
  errorMessage: {
    /** line height 0 keeps from the error message making the input and submit button unentered. */
    lineHeight: '0',
  },
  [LightTheme.breakpoints.up('lg')]: {
    sidebarContainer: { width: 'auto' },
    conversationCloseButton: { opacity: '0' },
  },
  [LightTheme.breakpoints.up('sm')]: {
    authenticatedUserContainer: { maxWidth: '50vw' },
  },
  [LightTheme.breakpoints.up('md')]: {
    authenticatedUserContainer: { maxWidth: '30vw' },
  },
};

/**
* handles opening and closing the sidebar.
* Has the logic to get the authenticated user's chatroom's and display them inside of sidebar.
*/
class SidebarOfConversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfConversationsToOpenOrDelete: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.usersChatRoomsID.length !== this.props.usersChatRoomsID.length) {
      // if chatRooms/conversations have been added or deleted resetTheSideBarDisplay
      this.resetSidebarDisplay();
      return true;
    } if (nextState !== this.state || nextProps !== this.props) {
      // normal render
      return true;
    }
    // don't re-render if nothing has changed
    return false;
  }

  /**
  * causes the component to update and resets the sidebar. the reset is required so that when it compares/uses
  * chatRoomsIdsArray.length and this.state.listOfConversationsToOpenOrDelete.length both start at 0. otherwise when the number of chatroom's
  * changes(deleted or added) it wont display them properly.
  */
  resetSidebarDisplay = () => {
    this.setState({ listOfConversationsToOpenOrDelete: [] });
    ConversationNamesAlreadyInSidebar = [];
  };

  /* adds a single chatroom to the listOfConversationsToOpenOrDelete. This is the jsx and styles for each recipient/chatroom */
  addChatRoomToListOfConversations = (recipientsName, chatRoomsIdsArray, currentChatRoomID) => {
    const newConversation = [...this.state.listOfConversationsToOpenOrDelete];
    newConversation.push((
      <div aria-label={`options for chatroom ${recipientsName}`} role="menuitem" key={reactKey} className={this.props.classes.chatroomContainer}>
        <h3
          className={this.props.classes.chatroomName}
          tabIndex="0"
          onClick={() => {
            /** if on md or smaller toggle sidebar else do not toggle sidebar */
            if (window.innerWidth < 1280) {
              this.props.toggleSidebar(true);
            }

            this.props.setCurrentChatRoomID(currentChatRoomID);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              /** if on md or smaller toggle sidebar else do not toggle sidebar */
              if (window.innerWidth < 1280) {
                this.props.toggleSidebar(true);
              }
              this.props.setCurrentChatRoomID(currentChatRoomID);
            }
          }}
          role="button"
          aria-label={`click here to open the chatroom with ${recipientsName}`}
        >
          {recipientsName}
        </h3>
        <IconButton
          className={this.props.classes.conversationCloseButton}
          tabIndex="0"
          onClick={() => this.props.deleteChatRoom(currentChatRoomID)}
          onKeyDown={e => {
            if (e.key === 'Enter') { this.props.deleteChatRoom(currentChatRoomID); }
          }}
          aria-label={`Delete ${recipientsName} chatroom button`}
          size="small"
        >
          <CloseIcon color="primary" fontSize="large" />
        </IconButton>
      </div>
    ));
    reactKey++;
    // prevents from  infinite loop
    if (chatRoomsIdsArray.length > this.state.listOfConversationsToOpenOrDelete.length) {
      if (!ConversationNamesAlreadyInSidebar.includes(recipientsName)) {
        ConversationNamesAlreadyInSidebar.push(recipientsName);
        this.setState({ listOfConversationsToOpenOrDelete: newConversation });
      }
    }
  };

  /** Gets the recipients name and calls addChatRoomToSidebar(). */
  getRecipientsNameForChatRooms = () => {
    if (this.props.usersChatRoomsID) {
      // All the chat rooms ids that the current authenticated user is in.
      const chatRoomIDs = { ...this.props.usersChatRoomsID };
      const chatRoomsIDsArray = Object.entries(chatRoomIDs);
      // eslint-disable-next-line consistent-return
      chatRoomsIDsArray.forEach(async (singleChatRoomID) => {
        try {
          const currentChatRoomID = singleChatRoomID[1];
          const chatroomData = await axios.get(`chatRoomsUsers/cru${currentChatRoomID}.json`);
          if (chatroomData.data !== null) {
            // [1][1] navigates to userID in the response. [1][1] has the auth user id and recipients id.
            const recipientAndAuthUserIdsArray = Object.entries(chatroomData.data)[1][1];
            // For each of the users in the chatroom get that recipients username
            recipientAndAuthUserIdsArray.forEach(async userID => {
              if (userID !== this.props.userID) {
                // axios get username for the current chatRoom user
                let recipientsName = await axios.get(`users/u${userID}/userName.json`);
                recipientsName = recipientsName.data;
                // takes the data and puts it into jsx for display
                this.addChatRoomToListOfConversations(recipientsName, chatRoomsIDsArray, currentChatRoomID);
              }
            });
          }
        } catch (error) {
          return 300;
        }
      });
    }
  };

  render() {
    this.getRecipientsNameForChatRooms();
    return (
      <>
        <aside
          className={this.props.classes.sidebarContainer}
          style={{ transform: `translateX( ${this.props.isSidebarOpen ? '0%' : '-100%'} )` }}
        >
          <img src="../../../logolarge.svg" alt="Unanimity Messenger Logo. Harmony through words." className={this.props.classes.logo} />
          <Hidden lgUp>
            <span className={this.props.classes.closeSidebarContainer}>
              <IconButton size="small" onClick={() => this.props.toggleSidebar()}>
                <CloseIcon fontSize="large" color="secondary" />
              </IconButton>
            </span>
          </Hidden>
          <div className={this.props.classes.authenticatedUserContainer}>
            <Typography variant="h6">
              {this.props.authenticatedUsername}
              <span>
                <IconButton onClick={() => this.props.setAreSettingsShowing(true)}>
                  <SettingsIcon />
                </IconButton>
              </span>
            </Typography>
          </div>
          <div>
            <Typography variant="body1" className={this.props.classes.conversationsTitle}>Active Conversations</Typography>
          </div>
          <div role="menu" aria-label="list of all chatroom's that you are in and can send messages in.">
            {this.state.listOfConversationsToOpenOrDelete}
          </div>
          <div className={this.props.classes.addChatroomContainer}>
            <div>
              <IconButton
                className={this.props.classes.addChatroomButton}
                tabIndex="0"
                onClick={(e) => this.props.addChatRoom(e, DOMPurify.sanitize(document.getElementById('newChatRoomName').value))}
                aria-label="Add a chatroom button"
                size="small"
              >
                <AddIcon className={this.props.classes.addChatroomIcon} fontSize="large" />
              </IconButton>
            </div>
            <div>
              <form onSubmit={(e) => this.props.addChatRoom(e, DOMPurify.sanitize(document.getElementById('newChatRoomName').value))}>
                <FormControl fullWidth variant="outlined" margin="normal" error={this.props.isAddChatroomErrors}>
                  <InputLabel htmlFor="newChatRoomName">Add chatroom</InputLabel>
                  <OutlinedInput
                    className={this.props.classes.addChatroomInput}
                    id="newChatRoomName"
                    inputProps={{
                      'aria-label': 'Enter the username of the recipient you would like to add a chatroom with', type: 'text', name: 'newChatRoomName', required: true,
                    }}
                    label="Add chatroom"
                  />
                  <FormHelperText id="newChatRoomName" className={this.props.classes.errorMessage}>{this.props.addChatroomErrorFeedback}</FormHelperText>
                </FormControl>
              </form>
            </div>
          </div>
        </aside>
      </>
    );
  }
}

export default withStyles(styles)(SidebarOfConversations);
