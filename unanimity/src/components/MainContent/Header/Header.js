import React from 'react';
const header = (props) => {
    return(
        <header>
            <h3>{props.currentChatRoomName}</h3>
        </header>
    );
}
export default header;