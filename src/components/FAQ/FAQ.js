import React from 'react';
import Nav from '../Nav/Nav';
import styles from './FAQ.module.scss';
import {motion} from 'framer-motion';

const FAQ = props => {
    return(
        <>
            <Nav/>
            <main>
                <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={props.pageVariants}
                transition={props.pageTransition}>
                    <img src="../../../unanimity-large-logo.svg" alt="Unanimity Messenger Logo. Harmony through words."/>
                    <h1>Frequently asked questions</h1>
                    <dl>
                        <dt className={styles.question}>How do I add a chatroom?</dt>
                        <dd>Once logged in, click on the green cross in the top left of the sidebar. Enter the username of who you want to chat with and chat away!</dd>
                        <dt className={styles.question}>How do I delete a chatroom?</dt>
                        <dd>Login and click on the "X" next to the chatroom you would click to delete.</dd>
                        <dt className={styles.question}>How do I send a message?</dt>
                        <dd>Once logged in, click on a chatroom of your choice, then click in the white box on the bottom of the screen. Type your message then press the enter key on the keyboard!</dd>
                        <dt className={styles.question}>How do I send an emoji in a message?</dt>
                        <dd>Simply type out a colon ":" followed by the emoji name you would like to use followed by another colon ":". Example ":smile:". <a href="https://github.com/tommoor/react-emoji-render/blob/HEAD/data/aliases.js" target="_blank" rel="noreferrer">View all emojis!</a></dd>
                        <dt className={styles.question}>How do I change the color scheme?</dt>
                        <dd>Once logged in, in the top right corner click on the three dots. This will open a option menu, where their will be a option titled theme. Click the switch beside theme to change the color scheme. </dd>
                        <dt className={styles.question}>How do I change my username?</dt>
                        <dd>Login and click on the options button (three dots) in the top right corner. Click on "update username" to enter your new username, however, you must enter your current password!</dd>
                        <dt className={styles.question}>How do I change my password?</dt>
                        <dd>Login and click on the options button (three dots) in the top right corner. Click on "update password" to enter your current password and your new password twice to confirm it!</dd>
                    </dl>
                </motion.div>
            </main>
        </>
    );
};

export default FAQ;