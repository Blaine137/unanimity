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
import { AnimatePresence } from 'framer-motion';

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

		/* ANIMATION STYLES FOR FRAMER MOTION */
		const pageVariants = {
			initial: {
			  opacity: 0,
			  x: "-20vw",
			  scale: 0.8
			},
			in: {
			  opacity: 1,
			  x: 0,
			  scale: 1
			},
			out: {
			  opacity: 0,
			  x: "100vw",
			  scale: 1.2
			}
		  };
		  
		  const pageTransition = {
			type: "tween",
			ease: "anticipate",
			duration: 0.5
		  };

		return (
			<div className="App">
				<BrowserRouter>
					<Switch>
						<Route exact path='/'>
							<AnimatePresence>
								<Landing pageVariants={pageVariants} pageTransition={pageTransition}/>
							</AnimatePresence>
						</Route>
						<Route path='/contact'>
							<AnimatePresence>
								<ContactForm pageVariants={pageVariants} pageTransition={pageTransition}/>
							</AnimatePresence>
						</Route> 
						<Route path='/login'>
							<AnimatePresence>
								<Authentication pageVariants={pageVariants} pageTransition={pageTransition}/>
							</AnimatePresence>
						</Route>
						<Route path='/FAQ'>
							<AnimatePresence>
								<FAQ pageVariants={pageVariants} pageTransition={pageTransition}/>
							</AnimatePresence>
						</Route>						                             
						<Redirect to='/'/>
					</Switch>  				
				</BrowserRouter>
			</div>
		);
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);