import React from 'react';
import MessengerLayout from './containers/MessengerLayout/MessengerLayout';

function App() {
  return (
    
    <MessengerLayout>

      {/* components will be wrapped around this layout component */}
      <p>test - i am located in the app.js</p>
    </MessengerLayout>

  );
}

export default App;
