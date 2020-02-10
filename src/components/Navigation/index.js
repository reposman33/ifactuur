import React from "react";
import { AuthUserContext, withAuthentication, withAuthorization } from "../Session/index.js";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { Link } from "react-router-dom";
import SignOut from "../SignOut/index.js";
import * as index from "./index.module.scss";

class NavigationForm extends React.Component {
	render() {
		return (
			<div>
				<div className={index.mainMenu}>
					<ul>
						<li id='factuur' className={index.navMenuItemSelected}>
							<Link to={ROUTES.INVOICES}>Invoices</Link>
						</li>
						<li id='nota'>
							<Link to={ROUTES.BILLS}>Bills</Link>
						</li>
						<li id='bedrijf'>
							<Link to={ROUTES.COMPANIES}>Companies</Link>
						</li>
						<li id='userSettings'>
							<Link to={ROUTES.ADMIN}>Settings</Link>
						</li>
						<li id='stats'>
							<Link to={ROUTES.STATS}>Income and expenses</Link>
						</li>
					</ul>
					{this.props.authUser && this.props.authUser.authUser && <SignOut />}
				</div>
				<div className={index.topContentBar}>
					<div className={index.languageSwitch}>
						<a
							href='/index.cfm?event=factuur.list&amp;dir=desc&amp;order=id&amp;page=1&amp;ISOEndDate=&amp;ISOStartDate=&amp;language=en'
							className={index.active}>
							engels
						</a>
						&nbsp;/
						<a href='/index.cfm?event=factuur.list&amp;dir=desc&amp;order=id&amp;page=1&amp;ISOEndDate=&amp;ISOStartDate=&amp;language=nl'>
							nederlands
						</a>
					</div>
				</div>
			</div>
		);
	}
}

const AddAuthentication = Component => props => (
	<AuthUserContext.Consumer>{authUser => <Component authUser={authUser} />}</AuthUserContext.Consumer>
);

const authCondition = authUser => authUser && authUser.authUser !== null;

const Navigation = compose(withAuthentication, AddAuthentication)(NavigationForm);

export default withAuthorization(authCondition)(Navigation);
