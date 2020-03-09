import React from 'react';

const input = (props) => {
    return(
        <input type="text" placeholder="Press Enter to send Message" 
            onKeyDown={ (e) => {
                let userInput = e.target.value;
                props.newMessage(userInput);
            }}
        />
    );
}
export default input;