import React, { Component, Fragment } from 'react';
import styles from './Header.module.scss';
// import { render } from 'node-sass';

class Header extends Component{

        state = {
            openOptions: false,
            options: null
        }

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
                            <li style = { { color: 'red' } } onClick = { () => { this.props.logout( true ) }  }>Logout</li>
                            <li>Test</li>
                            <li>Settings</li>
                            <li>Help Me</li>
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
                burger = <div onClick = { ( ) => { this.props.toggleSidebar( ) } } className = { styles.burger }  >

                                <div className = { styles.closeTop } ></div>
                                <div className = { styles.closeMiddle } ></div>
                                <div className = { styles.closeBottom } ></div>
                                
                    </div>;

            } else {
                        //if false then make the burger button 
                burger = <div onClick={ ( ) => { this.props.toggleSidebar( ) } } className = { styles.burger }  >

                            <div className = { styles.openTop } ></div>
                            <div className = { styles.openMiddle } ></div>
                            <div className = { styles.openBottom } ></div>
                
                        </div>;

            }
            
            return(

           <Fragment>
                    <header className = { styles.header } >
                    
                    { burger }
    
                    <h3 className = { styles.header3 } >
                        
                        { this.props.currentChatRoomName } 
    
                    </h3>

                    <div className={styles.options} onClick={ ( ) => { this.toggleOptions( ); this.showOptions( ) } }>
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