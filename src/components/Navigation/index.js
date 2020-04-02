import React from "react";
import { AuthUserContext, withAuthentication, withAuthorization } from "../Session/index.js";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";
import SignOut from "../Security/signout.js";
import * as styles from "./index.module.scss";

class NavigationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { selectedLanguage: this.props.selectedLanguage };
		this.routes = {
			INVOICES: ["/invoice", "/invoices"],
			BILLS: ["/bill", "/bills"],
			COMPANIES: ["/company", "/companies"],
			SETTINGS: ["/settings"],
			STATS: ["/stats"]
		};
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
							className={
								this.routes.INVOICES.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.INVOICES}>Invoices</Link>
						</li>
						<li
							id='nota'
							className={
								this.routes.BILLS.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.BILLS}>Bills</Link>
						</li>
						<li
							id='bedrijf'
							className={
								this.routes.COMPANIES.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.COMPANIES}>Companies</Link>
						</li>
						<li
							id='userSettings'
							className={
								this.routes.SETTINGS.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.SETTINGS}>Settings</Link>
						</li>
						<li
							id='stats'
							className={
								this.routes.STATS.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.STATS}>Income and expenses</Link>
						</li>
						<li> {this.props.authUser && this.props.authUser.authUser && <SignOut />}</li>
					</ul>
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
