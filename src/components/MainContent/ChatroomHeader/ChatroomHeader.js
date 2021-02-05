import React, { Fragment, useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography, Grid } from '@material-ui/core';
import styles from './ChatroomHeader.module.scss';
import HeaderOptionMenu from './HeaderOptionMenu/HeaderOptionMenu';
/*
User interface component that is located above the chatroom.
this component displays the burger button, current Chat room name,
and the toggle options button. It contains logics for showing/hiding the sidebar and the option menu.
*/
const ChatroomHeader = (props) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(true);
  const [optionsMenuElements, setOptionsMenuElements] = useState(null);

  const toggleAppTheme = () => {
    if (!props.isAppLightTheme) {
      document.documentElement.style.setProperty('--main-bg', '#585d63');
      document.documentElement.style.setProperty('--main-text', 'white');
      document.documentElement.style.setProperty('--off-text', '#f6f6f6');
      document.documentElement.style.setProperty('--light-accent-bg', '#2C2F33');
      document.documentElement.style.setProperty('--dark-accent-bg', '#23272A');
      document.documentElement.style.setProperty('--light-action', 'white');
      document.documentElement.style.setProperty('--dark-action', '#d4d4d4');
    } else {
      document.documentElement.style.setProperty('--main-bg', 'white');
      document.documentElement.style.setProperty('--main-text', 'black');
      document.documentElement.style.setProperty('--off-text', '#313639');
      document.documentElement.style.setProperty('--light-accent-bg', '#F6F6F6');
      document.documentElement.style.setProperty('--dark-accent-bg', '#e8e8e8');
      document.documentElement.style.setProperty('--light-action', '#365F88');
      document.documentElement.style.setProperty('--dark-action', '#05386B');
    }
  };

  // shows & hides the options menu. triggered by the three dots in the top right of the header
  const toggleOptionsMenu = () => {
    if (isOptionsMenuOpen === true) {
      setOptionsMenuElements(
        <HeaderOptionMenu
          styles={styles.optionsMenu}
          isAppLightTheme={props.isAppLightTheme}
          setIsAppLightTheme={props.setIsAppLightTheme}
          setOptionsMenuElements={setOptionsMenuElements}
          setAreSettingsShowing={props.setAreSettingsShowing}
          intentionalAndForcedUserLogout={props.intentionalAndForcedUserLogout}
        />,
      );
    } else {
      setOptionsMenuElements(null);
    }
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

  /*
        changes the sidebar opener between a x and a burger( the three lines )
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
  const toggleSidebarButtonStyles = () => {
    if (props.isSidebarOpen) {
      // make the burger button a X
      return (
        <IconButton
          tabIndex="0"
          onClick={() => props.toggleSidebar()}
          aria-label="Close sidebar"
          size="small"
          className={styles.menu}
        >
          <CloseIcon color="primary" />
        </IconButton>
      );
    }
    // sidebar is closed show the burger (three lines) to open it.
    return (
      <IconButton
        tabIndex="0"
        onClick={() => props.toggleSidebar()}
        aria-label="Open sidebar"
        size="small"
        className={styles.menu}
      >
        <MenuIcon color="primary" />
      </IconButton>
    );
  };

  toggleAppTheme();
  const burger = toggleSidebarButtonStyles();
  return (
    <>
      <header className={styles.header}>
        <Grid container justify="flex-start" alignContent="center" alignItems="center">
          <Grid item xs={2}>
            {burger}
          </Grid>
          <Grid item xs={2}>
            <IconButton
              tabIndex="0"
              className={styles.options}
              onClick={() => toggleOptionsMenu()}
              aria-label="Open options menu button"
              aria-haspopup="true"
              size="small"
            >
              <MoreVertIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </header>
      { optionsMenuElements}
    </>
  );
};

export default ChatroomHeader;
