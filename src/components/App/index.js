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
import { config_dev, config_prod } from "../../environments.js";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

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

	componentDidMount() {
		document.title = `${config.documentTitle} - ${process.env.NODE_ENV}`;
	}

	render() {
		if (this.state.errorMessage) {
			return <div>An error occurred: {this.state.errorMessage}</div>;
		}
		return (
			<Router>
				<React.Fragment>
					<div className='navContainer'>
						<Navigation />
					</div>
					<div>
						<Route exact path={ROUTES.COMPANIES} component={Companies} />
						<Route exact path={ROUTES.COMPANY} component={Company} />
						<Route exact path={ROUTES.ADMIN} component={Admin} />
						<Route exact path={ROUTES.BILLS} component={Bills} />
						<Route exact path={ROUTES.BILL} component={Bill} />
						<Route exact path={ROUTES.INVOICES} component={Invoices} />
						<Route exact path={ROUTES.INVOICE} component={Invoice} />
						<Route exact path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
						<Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
						<Route exact path={ROUTES.SIGN_IN} component={SignIn} />
						<Route exact path={ROUTES.SIGN_UP} component={SignUp} />
						<Route exact path={ROUTES.STATS} component={Stats} />
					</div>
				</React.Fragment>
			</Router>
		);
	}
}

export default withAuthentication(App);
