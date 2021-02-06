import React from 'react';
import './App.scss';
import DOMPurify from 'dompurify';
import { ThemeProvider } from '@material-ui/core/styles';
import { AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';
import { setNotification } from './redux/actions';
import CheckIfAuthenticatedSwitch from './containers/CheckIfAuthenticatedSwitch/CheckIfAuthenticatedSwitch';
import CustomAlert from './components/CustomAlert/CustomAlert';
import { LightTheme } from './Theme';

const mapStateToProps = state => ({ notification: state.messenger.notification });

const mapDispatchToProps = { setNotification: notification => setNotification(notification) };

const App = (props) => {
  const showHideCustomAlert = (message, success) => {
    const closeNotification = () => props.setNotification(null);
    let sanitizedAlertMessage = DOMPurify.sanitize(message);
    // only allows words, spaces, !, ?, $
    sanitizedAlertMessage = sanitizedAlertMessage.replace(/[^\w\s!?$]/g, '');
    const alertComponent = <CustomAlert alertMessage={sanitizedAlertMessage} alertClose={closeNotification} isSuccess={success} />;
    props.setNotification(alertComponent);
  };

  /* Animation styles for Framer Motion */
  const pageAnimationVariants = {
    initial: {
      opacity: 0,
      x: '-20vw',
      scale: 0.8,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: '100vw',
      scale: 1.2,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <ThemeProvider theme={LightTheme}>
      <main
        className="App"
        style={{
          boxSizing: 'border-box',
          '*, *:before, *:after': {
            boxSizing: 'inherit',
          },
        }}
      >
        {props.notification}
        <AnimatePresence>
          <CheckIfAuthenticatedSwitch
            pageAnimationVariants={pageAnimationVariants}
            pageTransition={pageTransition}
            showHideCustomAlert={showHideCustomAlert}
          />
        </AnimatePresence>
      </main>
    </ThemeProvider>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
