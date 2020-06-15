import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./signout.module.scss";

const SignOut = ({ firebase }) => (
	<div className={styles.actionIcons} onClick={firebase.signOut}>
		<FontAwesomeIcon icon='times-circle' size='lg' />
	</div>
);

export default withFirebase(SignOut);
