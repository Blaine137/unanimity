import React from 'react';
import {
  List, ListItem, ListItemText,
} from '@material-ui/core';

const HeaderOptionMenu = (props) => (
  <List role="menu" aria-label="option menu pop out">
    <ListItem
      tabIndex="0"
      role="button"
      aria-label="Logout of unanimity"
      onClick={() => { props.intentionalAndForcedUserLogout(true); }}
    >
      <ListItemText>Logout</ListItemText>
    </ListItem>
    <ListItem
      role="menuitem"
      aria-label="click this link to go to account settings"
      onClick={() => { props.setAreSettingsShowing(!props.areSettingsShowing); props.setOptionsMenuElements(null); }}
    >
      <ListItemText>Account Settings</ListItemText>
    </ListItem>
  </List>
);

export default HeaderOptionMenu;
