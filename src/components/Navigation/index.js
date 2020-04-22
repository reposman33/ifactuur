import React from "react";
import { AuthUserContext, withAuthentication, withAuthorization } from "../Session/index.js";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";
import { I18n } from "../../services/I18n/I18n";
import SignOut from "../Security/signout.js";
import * as styles from "./index.module.scss";

class NavigationForm extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();
		this.state = {};
		this.routes = {
			INVOICES: ["/invoice", "/invoices"],
			EXPENSES: ["/expense", "/expenses"],
			COMPANIES: ["/company", "/companies"],
			SETTINGS: ["/settings"],
			STATS: ["/stats"],
		};
	}

	setLanguage(lang) {
		this.I18n.setLanguage(lang);
		// force an idempotent setState to re-render...
		this.setState(this.state);
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
							<Link to={ROUTES.INVOICES}>{this.I18n.get("NAVIGATION.MENU_TITLE_INVOICES")}</Link>
						</li>
						<li
							id='nota'
							className={
								this.routes.EXPENSES.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.EXPENSES}>{this.I18n.get("NAVIGATION.MENU_TITLE_EXPENSES")}</Link>
						</li>
						<li
							id='bedrijf'
							className={
								this.routes.COMPANIES.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.COMPANIES}>{this.I18n.get("NAVIGATION.MENU_TITLE_COMPANIES")}</Link>
						</li>
						<li
							id='userSettings'
							className={
								this.routes.SETTINGS.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.SETTINGS}>{this.I18n.get("NAVIGATION.MENU_TITLE_SETTINGS")}</Link>
						</li>
						<li
							id='stats'
							className={
								this.routes.STATS.includes(this.props.location.pathname)
									? styles.navMenuItemSelected
									: ""
							}>
							<Link to={ROUTES.STATS}>{this.I18n.get("NAVIGATION.MENU_TITLE_STATS")}</Link>
						</li>
						<li> {this.props.authUser && this.props.authUser.authUser && <SignOut />}</li>
					</ul>
				</div>
				<div className={styles.languageButtons}>
					<button onClick={() => this.setLanguage("en")} disabled={this.I18n.getSelectedLanguage() === "en"}>
						engels
					</button>
					&nbsp;/
					<button onClick={() => this.setLanguage("nl")} disabled={this.I18n.getSelectedLanguage() === "nl"}>
						nederlands
					</button>
				</div>
			</div>
		);
	}
}

const AddAuthentication = (Component) => (props) => (
	<AuthUserContext.Consumer>{(authUser) => <Component authUser={authUser} {...props} />}</AuthUserContext.Consumer>
);

const authCondition = (authUser) => authUser && authUser.authUser !== null;

const Navigation = compose(withAuthentication, AddAuthentication)(NavigationForm);

export default withAuthorization(authCondition)(Navigation);
