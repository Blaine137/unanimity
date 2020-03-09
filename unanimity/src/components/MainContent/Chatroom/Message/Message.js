import React, { Fragment } from 'react';
const message = (props) => {
    return(
        <Fragment>
            <h4>{ props.currentMessageUsername }</h4>
            <p>{ props.currentMessage }</p>
        </Fragment>
    );
}
export default message;