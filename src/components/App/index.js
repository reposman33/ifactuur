import React, { Component } from "react";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import { withAuthentication } from "../Session/index.js";
import * as ROUTES from "../../constants/routes.js";

import Admin from "../Admin/index.js";
import Bills from "../Bills/index.js";
import Companies from "../Companies/index.js";
import Invoices from "../Invoices/index.js";
import Navigation from "../Navigation/index.js";
import PasswordChange from "../PasswordChange/index.js";
import PasswordForget from "../PasswordForget/index.js";
import SignIn from "../SignIn/index.js";
import SignUp from "../SignUp/index.js";
import Stats from "../Stats/index.js";

class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Navigation />
					<Route exact path={ROUTES.ADMIN} component={Admin} />
					<Route exact path={ROUTES.BILLS} component={Bills} />
					<Route
						exact
						path={ROUTES.COMPANIES}
						component={Companies}
					/>
					<Route exact path={ROUTES.INVOICES} component={Invoices} />
					<Route
						exact
						path={ROUTES.PASSWORD_CHANGE}
						component={PasswordChange}
					/>
					<Route
						exact
						path={ROUTES.PASSWORD_FORGET}
						component={PasswordForget}
					/>
					<Route exact path={ROUTES.SIGN_IN} component={SignIn} />
					<Route exact path={ROUTES.SIGN_UP} component={SignUp} />
					<Route exact path={ROUTES.STATS} component={Stats} />
				</div>
			</Router>
		);
	}
}

export default withAuthentication(App);
