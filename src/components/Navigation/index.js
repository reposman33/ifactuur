import React from "react";
import { AuthUserContext, withAuthentication, withAuthorization } from "../Session/index.js";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";
import SignOut from "../SignOut/index.js";
import * as styles from "./index.module.scss";

class NavigationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { selectedLanguage: this.props.selectedLanguage };
	}

	setLanguage(lang) {
		this.props.setLanguage(lang);
		this.setState({ selectedLanguage: lang });
	}

	render() {
		return (
			<div>
				<div className={styles.mainMenu}>
					<ul>
						<li
							id='factuur'
							className={this.props.location.pathname === "/invoices" ? styles.navMenuItemSelected : ""}>
							<Link to={ROUTES.INVOICES}>Invoices</Link>
						</li>
						<li
							id='nota'
							className={this.props.location.pathname === "/bills" ? styles.navMenuItemSelected : ""}>
							<Link to={ROUTES.BILLS}>Bills</Link>
						</li>
						<li
							id='bedrijf'
							className={this.props.location.pathname === "/companies" ? styles.navMenuItemSelected : ""}>
							<Link to={ROUTES.COMPANIES}>Companies</Link>
						</li>
						<li
							id='userSettings'
							className={this.props.location.pathname === "/admin" ? styles.navMenuItemSelected : ""}>
							<Link to={ROUTES.ADMIN}>Settings</Link>
						</li>
						<li
							id='stats'
							className={this.props.location.pathname === "/stats" ? styles.navMenuItemSelected : ""}>
							<Link to={ROUTES.STATS}>Income and expenses</Link>
						</li>
					</ul>
					{this.props.authUser && this.props.authUser.authUser && <SignOut />}
				</div>
				<div className={styles.languageButtons}>
					<button onClick={() => this.setLanguage("en")} disabled={this.state.selectedLanguage === "en"}>
						engels
					</button>
					&nbsp;/
					<button onClick={() => this.setLanguage("nl")} disabled={this.state.selectedLanguage === "nl"}>
						nederlands
					</button>
				</div>
			</div>
		);
	}
}

const AddAuthentication = Component => props => (
	<AuthUserContext.Consumer>{authUser => <Component authUser={authUser} {...props} />}</AuthUserContext.Consumer>
);

const authCondition = authUser => authUser && authUser.authUser !== null;

const Navigation = compose(withAuthentication, AddAuthentication)(NavigationForm);

export default withAuthorization(authCondition)(Navigation);
