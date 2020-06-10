import React, { Component } from 'react';
import './App.scss';
import Authentication from './containers/Authentication/Authentication';
import './fonts/Jost-VariableFont_ital,wght.ttf';
import './fonts/Montserrat-Regular.ttf';
import Landing from './components/landing/Landing';
import ContactForm from './components/ContactForm/ContactForm';

class App extends Component {

  state = {

    landing: true,
    contactForm: false

  }

  goToAuth = ( ) => {

    this.setState( { landing: false } );
    
  }

  goToContact = (  ) => {

    this.setState( { contactForm: true } );

  }

  render ( ) {

    let display;

    //if landing is true show landing page
    if ( this.state.landing ) {

      display = <Landing goToAuth = { this.goToAuth } goToContact={this.goToContact}/>;

    } else {

      //landing is false show auth page
      display = <Authentication />;

    }

       if(this.state.contactForm){

          display = <ContactForm />;

      }

    return (

      <div className = " App " >
          
        { display }

      </div>

    );//return

  }//render


}//app class

export default App;
