import React, { Fragment, useState } from 'react';
import styles from './ChatroomHeader.module.scss';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton, Typography, List, ListItem, ListItemText, FormControlLabel, Switch } from '@material-ui/core';
/*
User interface component that is located above the chatroom. 
this component displays the burger button, current Chat room name, 
and the toggle options button. It contains logics for showing/hiding the sidebar and the option menu.
*/
const ChatroomHeader = props => {
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(true);
    const [optionsMenuElements, setOptionsMenuElements] = useState(null);
    const [isAppLightTheme, setIsAppLightTheme] = useState(false);
    
    const toggleAppTheme = () => {
        if(isAppLightTheme) {
            document.documentElement.style.setProperty("--main-bg","#585d63");
            document.documentElement.style.setProperty("--main-text","white");
            document.documentElement.style.setProperty("--off-text","#f6f6f6");
            document.documentElement.style.setProperty("--light-accent-bg","#2C2F33");
            document.documentElement.style.setProperty("--dark-accent-bg","#23272A");
            document.documentElement.style.setProperty("--light-action","white");
            document.documentElement.style.setProperty("--dark-action","#d4d4d4");
        } else {
            document.documentElement.style.setProperty("--main-bg","white");
            document.documentElement.style.setProperty("--main-text","black");
            document.documentElement.style.setProperty("--off-text","#313639");
            document.documentElement.style.setProperty("--light-accent-bg","#F6F6F6");
            document.documentElement.style.setProperty("--dark-accent-bg","#e8e8e8");
            document.documentElement.style.setProperty("--light-action","#365F88");
            document.documentElement.style.setProperty("--dark-action","#05386B");
        }
    }
    
    //shows & hides the options menu. triggered by the three dots in the top right of the header
    const toggleOptionsMenu =  () => {
        if(isOptionsMenuOpen === true) {
            setOptionsMenuElements(
                <List role="menu" aria-label="option menu pop out" className={ styles.optionsMenu }>
                    <ListItem role="menuitem">
                        <FormControlLabel
                            label="Theme"
                            labelPlacement="start"
                            control={
                                <Switch
                                    aria-label="Switch to change theme color of Unanimity" 
                                    checked={isAppLightTheme}
                                    onChange={() => { setIsAppLightTheme(!isAppLightTheme);  setOptionsMenuElements(null)}}
                                    name="themColor"
                                    color="primary"
                                />
                            }                           
                        />                          
                    </ListItem>
                    <ListItem 
                        tabIndex="0" 
                        role="button"
                        aria-label="Logout of unanimity"
                        style={ { color: '#f44336' } } 
                        onClick={ () => { props.intentionalAndForcedUserLogout(true) }} 
                        onKeyDown={ e => { if(e.key === 'Enter') { props.intentionalAndForcedUserLogout(true); } } }
                    >
                        <ListItemText>Logout</ListItemText>
                    </ListItem>
                    <ListItem role="menuitem"
                        aria-label="click this link to go to account settings"
                        onClick={() => { props.setAreSettingsShowing(!props.areSettingsShowing); setOptionsMenuElements(null); }}
                    >
                        <ListItemText>Account Settings</ListItemText>
                    </ListItem>                       
                </List>
            );          
        } else {
            setOptionsMenuElements(null);
        }
        setIsOptionsMenuOpen(!isOptionsMenuOpen);
    }

   /*
        changes the sidebar opener between a x and a burger( the three lines ) 
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
    const toggleSidebarButtonStyles = () => {
        if(props.isSidebarOpen) {
            //make the burger button a X
            return(
                <div 
                    tabIndex="0" 
                    onClick={ () => { props.toggleSidebar(); } } 
                    onKeyDown={ e => { if(e.key === 'Enter') { props.toggleSidebar(); } } }
                    className={ styles.close }
                    aria-label=" Close Sidebar button"
                    role="button"                      
                >
                    <div className={ styles.closeTop }></div>
                    <div className={ styles.closeMiddle }></div>
                    <div className={ styles.closeBottom }></div>                      
                </div>
            );
        } else {
            //sidebar is closed show the burger (three lines) to open it.
            return(
                <div 
                    tabIndex="0"
                    onClick={ () => { props.toggleSidebar( ); } } 
                    onKeyDown={e => { if(e.key === 'Enter') { props.toggleSidebar(); } } }
                    className={ styles.burger }  
                    aria-label="Open Sidebar button"
                    role="button"
                >
                    <div className={ styles.openTop }></div>
                    <div className={ styles.openMiddle }></div>
                    <div className={ styles.openBottom }></div>          
                </div>
            );
        }
    }

    toggleAppTheme();
    let burger = toggleSidebarButtonStyles();   
    return(
        <Fragment>
            <header className={ styles.header }>              
                { burger }
                <Typography variant="h5">{ props.currentChatRoomName }</Typography>
                <IconButton
                    tabIndex="0" 
                    className={ styles.options } 
                    onClick={ () => toggleOptionsMenu() }           
                    aria-label="Open options menu button"
                    aria-haspopup="true"
                    size="medium"
                >
                    <MoreVertIcon color="primary"/>
                </IconButton >     
            </header>
            { optionsMenuElements }  
        </Fragment>
    );
}

export default ChatroomHeader;