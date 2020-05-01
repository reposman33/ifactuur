import React from "react";
import { withFirebase } from "../../Firebase/index.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as styles from "./signout.module.scss";

const SignOut = ({ firebase }) => (
	<div onClick={firebase.signOut}>
		<FontAwesomeIcon icon='door-open' size='lg' />
	</div>
);

export default withFirebase(SignOut);
