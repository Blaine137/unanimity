import React, { Component } from 'react';
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

        showOptions = () => {

            if(this.state.openOptions === true){
                
                this.setState( {options: 
                    <div className={styles.optionsContainer}>
                        <div className={styles.options}>
                            <span>Logout</span>
                        </div>
                    </div>
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
            let options = <div className={styles.options} onClick={ ( ) => { this.toggleOptions( ); this.showOptions( ) } }>
                                <div className={styles.circle1}></div>
                                <div className={styles.circle2}></div>
                                <div className={styles.circle3}></div>
                          </div>;
            return(

                <header className = { styles.header } >
                    
                    { burger }
    
                    <h3 className = { styles.header3 } >
                        
                        { this.props.currentChatRoomName } 
    
                    </h3>
    
                    { options }

                    {this.state.options}
                    
                </header>
                
            );//return

        }//render

}

export default Header;