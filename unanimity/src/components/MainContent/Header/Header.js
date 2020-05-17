import React, { Component, Fragment } from 'react';
import styles from './Header.module.scss';
// import { render } from 'node-sass';

class Header extends Component{

        state = {
            openOptions: false,
            options: null
        }

            //switches options to open or close
        toggleOptions = () => {

            if(this.state.openOptions === true){
                this.setState( {openOptions: false} );
            }else if(this.state.openOptions === false){
                this.setState( {openOptions: true} );
            }

        }
        //options menu once open
        showOptions = () => {

            if(this.state.openOptions === true){
                
                this.setState( {options: 
                    
                        <ul className = { styles.optionsMenu } >
                            <li tabindex = " 0 " style = { { color: '#f44336' } } onClick = { () => { this.props.logout( true ) }  } onKeyDown = { ( e ) => { if ( e.key === 'Enter') { this.props.logout( true ); } } }>Logout</li>                       
                        </ul>
                 
                } ); //end of setState

            }else{
              this.setState( { options: null } );  
            }

        }
           
        render(){

            let burger = null;

                    //if props.showSidebar is true
            if( this.props.showSidebar ) {

                    //make the burger button a X
                burger = <div 
                            tabIndex = " 0 " 
                            onClick = { ( ) => { this.props.toggleSidebar( ); } } 
                            onKeyDown = { ( e ) => { if ( e.key === 'Enter' ) { this.props.toggleSidebar( ); } } }
                            className = { styles.close }
                            aria-label = " Close Sidebar button"
                            role = "button"  
                        
                        >

                                <div className = { styles.closeTop } ></div>
                                <div className = { styles.closeMiddle } ></div>
                                <div className = { styles.closeBottom } ></div>
                                
                    </div>;

            } else {
                        //if false then make the burger button 
                burger = <div 
                            tabIndex = " 0 "
                            onClick={ ( ) => { this.props.toggleSidebar( ); } } 
                            onKeyDown = { ( e ) => { if ( e.key === 'Enter' ) { this.props.toggleSidebar( ); } } }
                            className = { styles.burger }  
                            aria-label = "Open Sidebar button"
                            role = "button"
                         >

                            <div className = { styles.openTop } ></div>
                            <div className = { styles.openMiddle } ></div>
                            <div className = { styles.openBottom } ></div>
                
                        </div>;

            }
            
            return(

           <Fragment>
                    <header className = { styles.header } >
                    
                    { burger }
    
                    <h3 >
                        
                        { this.props.currentChatRoomName } 
    
                    </h3>

                    <div 
                        tabIndex = "0" 
                        className={styles.options} 
                        onClick={ ( ) => { this.toggleOptions( ); this.showOptions( ) } }
                        onKeyDown = { ( e ) => {if ( e.key === 'Enter' ) { this.toggleOptions( ); this.showOptions( ); } } }
                        aria-label = "Open options menu button"
                        role = "button"
                    >

                            <div className={styles.circle1}></div>
                            <div className={styles.circle2}></div>
                            <div className={styles.circle3}></div>

                    </div>
                    
                </header>
                {this.state.options}
           </Fragment>
                
            );//return

        }//render

}

export default Header;