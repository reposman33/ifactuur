import React from "react";
import { authorizationContextConsumer } from "../Session/index.js";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";
import { I18n } from "../../services/I18n/I18n";
import SignOut from "../SignOut/signout.js";
import { LanguagePicker } from "../LanguagePicker/languagePicker";
import * as styles from "./index.module.scss";

class NavigationForm extends React.Component {
	I18n = new I18n();

	routes = {
		INVOICES: ["/invoice", "/invoices"],
		EXPENSES: ["/expense", "/expenses"],
		COMPANIES: ["/company", "/companies"],
		SETTINGS: ["/settings"],
		STATS: ["/stats"],
	};

	setLanguage = (e) => {
		this.props.setLanguage(e.target.attributes["data-lang"].value);
	};

	render() {
		return (
			<div>
				<div className={styles.mainMenu}>
					<ul>
						<li
							id='factuur'
							className={
								this.routes.INVOICES.includes(this.props.location.pathname) ||
								this.props.location.pathname === "" ||
								this.props.location.pathname === "/"
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
						<li> <SignOut /></li>
					</ul>
				</div>
				<LanguagePicker setLanguage={this.props.setLanguage}></LanguagePicker>
			</div>
		);
	}
}

export default authorizationContextConsumer(NavigationForm);
