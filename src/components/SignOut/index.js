import React, { Component } from "react";
import { withFirebase } from "../Firebase/index.js";
import "./index.scss";

const SignOut = ({ firebase }) => {
	return (
		<img
			alt='logout'
			src='/includes/img/logout.png'
			onClick={this.props.firebase.SignOut}
		/>
	);
};

export default withFirebase(SignOut);
