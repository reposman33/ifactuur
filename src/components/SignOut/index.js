import React, { Component } from "react";
import "./index.scss";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";

class SignOut extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Link to={ROUTES.SIGN_IN}>
				<img alt='logout' src='/includes/img/logout.png' />
			</Link>
		);
	}
}

export default SignOut;
