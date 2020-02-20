import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import { withAuthentication } from "../Session/";
import Settings from "../Settings";
import { Bill, Bills } from "../Bills/";
import { Company, Companies } from "../Companies/";
import { Invoice, Invoices } from "../Invoices/";
import Navigation from "../Navigation/";
import PasswordChange from "../PasswordChange/";
import PasswordForget from "../PasswordForget/";
import SignIn from "../SignIn/";
import SignUp from "../SignUp/";
import Stats from "../Stats/";
import I18n from "../../services/I18n/I18n";

import { config_dev, config_prod } from "../../environments.js";
import "./index.scss";

const config = process.env.NODE_ENV === "production" ? config_prod : config_dev;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.setLanguage = this.setLanguage.bind(this);
		this.getLanguageString = this.getLanguageString.bind(this);
		this.state = {
			language: I18n.getSelectedLanguage(),
			errorMessage: null
		};
	}

	componentDidCatch(error, info) {
		this.setState({ errorMessage: error.message });
	}

	componentDidMount() {
		document.title = `${config.documentTitle} - ${process.env.NODE_ENV}`;
		this.setState({ language: "en" });
	}

	setLanguage(lang) {
		I18n.setLanguage(lang);
		this.setState({ language: lang });
	}

	getLanguageString(token) {
		return I18n.get(token);
	}

	render() {
		if (this.state.errorMessage) {
			return <div>An error occurred: {this.state.errorMessage}</div>;
		}
		return (
			<Router>
				<React.Fragment>
					<div className='navContainer'>
						<Navigation setLanguage={this.setLanguage} selectedLanguage={I18n.getSelectedLanguage()} />
					</div>
					<div className='container'>
						<Route exact path={ROUTES.COMPANIES} component={Companies} />
						<Route exact path={ROUTES.COMPANY} component={Company} />
						<Route exact path={ROUTES.SETTINGS} component={Settings} />
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
