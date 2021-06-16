import React from "react";
import { firebaseContextConsumer } from "../../Firebase/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./signout.module.scss";

const SignOut = ({ firebase }) => {
	const signOut = () => {
		sessionStorage.clear()
		firebase.signOut()
	}

	return (
		<div className={styles.actionIcons} onClick={signOut}>
		<FontAwesomeIcon icon='times-circle' size='lg' />
	</div>)
}

export default firebaseContextConsumer(SignOut);
