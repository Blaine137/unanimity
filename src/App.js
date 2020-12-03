import React, { Component } from 'react';
import './App.scss';
import Authentication from './containers/Authentication/Authentication';
import './fonts/Jost-VariableFont_ital,wght.ttf';
import './fonts/Montserrat-Regular.ttf';
import Landing from './components/landing/Landing';
import ContactForm from './components/ContactForm/ContactForm';
import FAQ from './components/FAQ/FAQ';
import { connect } from 'react-redux';
import { setLanding, setContactForm } from './redux/actions';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const mapStateToProps = state => {
  return {
      landing: state.setLanding.landing,
      contactForm: state.setContact.contactForm
  }
}

const mapDispatchToProps = {
  setLanding: landingStatus => setLanding(landingStatus),
  setContactForm: contactStatus => setContactForm(contactStatus),
}

class App extends Component {
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Switch>
						<Route exact path='/'>
							<Landing />
						</Route>
						<Route path='/contact'>
							<ContactForm />
						</Route> 
						<Route path='/login'>
							<Authentication/>
						</Route>
						<Route path='/help'>
							<FAQ/>
						</Route>						                             
						<Redirect to='/'/>
					</Switch>  				
				</BrowserRouter>
			</div>
		);
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);