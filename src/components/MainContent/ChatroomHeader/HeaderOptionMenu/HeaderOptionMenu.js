import React from 'react';
import {List, ListItem, ListItemText, FormControlLabel, Switch} from '@material-ui/core';
const HeaderOptionMenu = props => {
    return(
        <List role="menu" aria-label="option menu pop out" className={ props.styles }>
            {/* The switch has padding that we can't remove. So to make all the ListItems have equal space we added space to all ListItem except this one. */}
            <ListItem role="menuitem" style={{padding: 0, margin: 0}} >
                <FormControlLabel
                    label="Theme"
                    labelPlacement="start"
                    control={
                        <Switch
                            aria-label="Switch to change theme color of Unanimity" 
                            checked={!props.isAppLightTheme}
                            onChange={() => { props.setIsAppLightTheme(!props.isAppLightTheme);  props.setOptionsMenuElements(null)}}
                            name="themColor"
                            color="primary"
                            margin="dense"
                        />
                    }                                                 
                />                          
            </ListItem>
            <ListItem 
                tabIndex="0" 
                role="button"
                aria-label="Logout of unanimity"
                onClick={ () => { props.intentionalAndForcedUserLogout(true) }} 
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
};

export default HeaderOptionMenu;