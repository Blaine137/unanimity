import React, { Component } from 'react';
import './App.scss';
import Authentication from './containers/Authentication/Authentication';
import './fonts/Jost-VariableFont_ital,wght.ttf';
import './fonts/Montserrat-Regular.ttf';
import Landing from './components/landing/Landing';

class App extends Component {

  state = {

    landing: true

  }

  goToAuth = ( ) => {

    this.setState( { landing: false } );
    
  }

  render ( ) {

    let display;

    //if landing is true show landing page
    if ( this.state.landing ) {

      display = <Landing goToAuth = { this.goToAuth } />;

    } else {

      //landing is false show auth page
      display = <Authentication />;

    }

    return (

      <div className = " App " >
          
        { display }

      </div>

    );//return

  }//render


}//app class

export default App;
