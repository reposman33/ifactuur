import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import { withAuthentication } from "../Session/index.js";
import Admin from "../Admin/index.js";
import { Bill, Bills } from "../Bills/index.js";
import { Company, Companies } from "../Companies/index.js";
import { Invoice, Invoices } from "../Invoices/index.js";
import Navigation from "../Navigation/index.js";
import PasswordChange from "../PasswordChange/index.js";
import PasswordForget from "../PasswordForget/index.js";
import SignIn from "../SignIn/index.js";
import SignUp from "../SignUp/index.js";
import Stats from "../Stats/index.js";
import "./index.scss";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: null
		};
	}
	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}
	render() {
		if (this.state.errorMessage) {
			return <div>An error occurred: {this.state.errorMessage}</div>;
		}
		return (
			<div className='container'>
				<Router>
					<React.Fragment>
						<Navigation></Navigation>
						<Route path={ROUTES.INVOICES} component={Invoices}></Route>
						<Route path={ROUTES.BILLS} component={Bills}></Route>
						<Route path={ROUTES.COMPANIES} component={Companies}></Route>
						<Route path={ROUTES.ADMIN} component={Admin}></Route>
						<Route path={ROUTES.STATS} component={Stats}></Route>
					</React.Fragment>
				</Router>
			</div>
		);
	}
}

export default withAuthentication(App);
