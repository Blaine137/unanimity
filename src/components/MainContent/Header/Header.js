import React, { Component, Fragment } from 'react';
import styles from './Header.module.scss';
import Switch from 'react-switch';

class Header extends Component{
    state = {
        openOptions: false,
        options: null,
        lightTheme: false
    }
    //shows & hides the options menu. triggered by the three dots in the top right of the header
    toggleOptions = () => {
         if(this.state.openOptions === true) {
            this.setState({      
                    options:                
                        <ul className={ styles.optionsMenu }>
                            <li>
                                <span>Theme: </span>
                                <Switch className={styles.switch} checked={this.state.lightTheme} onChange={() => this.toggleTheme()} activeBoxShadow='0 0 2px 3px #365F88' onColor="#05386B" uncheckedIcon={false} checkedIcon={false} />   
                            </li> 
                            <li 
                                tabIndex="0" 
                                style={ { color: '#f44336' } } 
                                onClick={ () => { this.props.logout(true) }  } 
                                onKeyDown={ e => { if(e.key === 'Enter') { this.props.logout(true); } } }
                            >
                                Logout
                            </li>                      
                        </ul>,
                    openOptions: !this.state.openOptions,         
            });
        } else {
            this.setState({ options: null, openOptions: !this.state.openOptions });  
        }
    }
    /*
        changes the sidebar opener between a x and a burger( the three lines ) 
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
    toggleBurger = () => {
        if( this.props.showSidebar ) {
            //make the burger button a X
            return(
                    <div 
                        tabIndex="0" 
                        onClick={ () => { this.props.toggleSidebar(); } } 
                        onKeyDown={ e => { if(e.key === 'Enter') { this.props.toggleSidebar(); } } }
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
                        onClick={ () => { this.props.toggleSidebar( ); } } 
                        onKeyDown={e => { if(e.key === 'Enter') { this.props.toggleSidebar(); } } }
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
    
    toggleTheme = () => {
        this.setState({ lightTheme: !this.state.lightTheme})
        if(this.state.lightTheme === true) {
            //#3c4045
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
    
    render() {
        let burger = this.toggleBurger();   
        return(
            <Fragment>
                <header className={ styles.header }>              
                    { burger }
                    <h3>{ this.props.currentChatRoomName }</h3>
                    <div 
                        tabIndex="0" 
                        className={ styles.options } 
                        onClick={ () => { this.toggleOptions( ) } }
                        onKeyDown={ e => { if(e.key === 'Enter') { this.toggleOptions(); } } }
                        aria-label="Open options menu button"
                        role="button"
                    >
                        <div className={ styles.circle1 }></div>
                        <div className={ styles.circle2 }></div>
                        <div className={ styles.circle3 }></div>
                    </div>     
                </header>
                { this.state.options }  
            </Fragment>
        );
    }
}

export default Header;