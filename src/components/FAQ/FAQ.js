import React from 'react';
import Nav from '../Nav/Nav';
import styles from './FAQ.module.scss';

const FAQ = props => {

    return(
        <>
            <Nav/>
            <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
            <h3>Frequently asked questions</h3>
            <p className={styles.question}>how to add a chatroom?</p>
            <ul className={styles.answer}>
                <li>Once logged in, click on the green cross in the top left. Enter an existing user and chat away!</li>
            </ul>
            <p className={styles.question}>how to delete a chatroom?</p>
            <ul className={styles.answer}>
                <li>Login and click on the "X" next to the chatroom you would like to delete</li>
            </ul>
            <p className={styles.question}>how to send a message?</p>
            <ul className={styles.answer}>
                <li>Assuming you are logged in, click on a chatroom of your choice, then click in the white box on the bottom of the screen. Enter your message and hit enter!</li>
            </ul>
            <p className={styles.question}>how to send an emoji in a message?</p>
            <ul className={styles.answer}>
                <li>Simpily type out a colon ":" followed by the emoji you would like to use followed by another colon ":". <a href="https://github.com/tommoor/react-emoji-render/blob/HEAD/data/aliases.js" target="_blank">Here</a> is a link to all available emojis  </li>
            </ul>
            <p className={styles.question}>dont like our color sceme?</p>
            <ul className={styles.answer}>
                <li>You can change the theme to a dark theme by sliding the switch once you have logged in and clicked on the three dots in top right of your screen!</li>
            </ul>
        </>
    );

};

export default FAQ;