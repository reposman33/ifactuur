import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import { WithFirebase } from "../Firebase/index.js";
import Admin from "../Admin/index.js";
import Bills from "../Bills/index.js";
import Companies from "../Companies/index.js";
import Invoices from "../Invoices/index.js";
import Navigation from "../Navigation/index.js";
import PasswordChange from "../PasswordChange/index.js";
import PasswordForget from "../PasswordForget/index.js";
import SignIn from "../SignIn/index.js";
import SignOut from "../SignOut/index.js";
import SignUp from "../SignUp/index.js";
import Stats from "../Stats/index.js";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { authenticatedUser: null };
	}

	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			authUser => {
				authUser
					? this.setState({
							authenticatedUser: authUser
					  })
					: this.setState({ authenticatedUser: null });
			}
		);
	}

	componentWillUnmount() {
		// this.listener();
	}

	render() {
		return (
			<Router>
				<div>
					<Navigation
						authenticatedUser={this.state.authenticatedUser}
					/>
					<Route exact path={ROUTES.ADMIN} component={Admin} />
					<Route path={ROUTES.BILLS} component={Bills} />
					<Route path={ROUTES.COMPANIES} component={Companies} />
					<Route path={ROUTES.INVOICES} component={Invoices} />
					<Route
						path={ROUTES.PASSWORD_CHANGE}
						component={PasswordChange}
					/>
					<Route
						path={ROUTES.PASSWORD_FORGET}
						component={PasswordForget}
					/>
					<Route path={ROUTES.SIGN_IN} component={SignIn} />
					<Route path={ROUTES.SIGN_OUT} component={SignOut} />
					<Route path={ROUTES.SIGN_UP} component={SignUp} />
					<Route path={ROUTES.STATS} component={Stats} />
				</div>
			</Router>
		);
	}
}

export default WithFirebase(App);
