import React, { Fragment, useState } from 'react';
import styles from './Header.module.scss';
import Switch from 'react-switch';
import AccountSettings from './AccountSettings/AccountSettings';

const Header = props => {
    const [openOptions, setOpenOptions] = useState(true);
    const [options, setOptions] = useState(null);
    const [lightTheme, setLightTheme] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const toggleTheme = () => {
        if(lightTheme) {
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
    const toggleOptions =  () => {
        if(openOptions === true) {
            setOptions(
                <ul role="menu" aria-label="option menu pop out" className={ styles.optionsMenu }>
                    <li role="menuitem">
                        <span>Theme: </span>
                        <Switch aria-label="Switch to change theme color of Unanimity" className={styles.switch} checked={lightTheme} onChange={() => { setLightTheme(!lightTheme);  setOptions(null)}} activeBoxShadow='0 0 2px 3px #365F88' onColor="#05386B" uncheckedIcon={false} checkedIcon={false} />   
                    </li>
                    <li 
                        tabIndex="0" 
                        role="button"
                        aria-label="Logout of unanimity"
                        style={ { color: '#f44336' } } 
                        onClick={ () => { props.logout(true) }  } 
                        onKeyDown={ e => { if(e.key === 'Enter') { props.logout(true); } } }
                    >
                        Logout
                    </li>
                    <li role="menuitem"
                        aria-label="click this link to go to account settings"
                        onClick={() => { setShowSettings(!showSettings); setOptions(null); }}>
                        Account Settings
                    </li>                       
                </ul>
            );          
        } else {
            setOptions(null);
        }
        setOpenOptions(!openOptions);
    }

   /*
        changes the sidebar opener between a x and a burger( the three lines ) 
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
    const toggleBurger = () => {
        if( props.showSidebar ) {
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

    const showSettingsMenu = () => {
        if(showSettings) {
            return <AccountSettings setShowSettings={setShowSettings} 
                                    authUID={ props.authUID } 
                                    showSettings={showSettings} 
                                    authUsername={props.authUsername}
                                    setNoticication={props.setShowNotification}/>;
        }
    }

    toggleTheme();
    let burger = toggleBurger();   
    return(
        <Fragment>
            <header className={ styles.header }>              
                { burger }
                <h3>{ props.currentChatRoomName }</h3>
                <div 
                    tabIndex="0" 
                    className={ styles.options } 
                    onClick={ () => toggleOptions() }
                    onKeyDown={ e => { if(e.key === 'Enter') { toggleOptions(); } } }
                    aria-label="Open options menu button"
                    aria-haspopup="true"
                    role="button"
                >
                    <div className={ styles.circle1 }></div>
                    <div className={ styles.circle2 }></div>
                    <div className={ styles.circle3 }></div>
                </div>     
            </header>
            { options }  
            { showSettingsMenu() }
        </Fragment>
    );
}

export default Header;