import React from "react";
import { AuthUserContext, withAuthentication, withAuthorization } from "../Session/index.js";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes.js";
import { Link, withRouter } from "react-router-dom";
import SignOut from "../SignOut/index.js";

import "./index.scss";

class NavigationForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div />
				<div>
					<div className='mainMenu'>
						<ul>
							<li id='factuur' className='navMenuItemSelected'>
								invoices
								<ul>
									<li>
										<Link to={ROUTES.INVOICES} className='navMenuItemSelected'>
											list invoices
										</Link>
									</li>
									<li>
										<Link to={ROUTES.INVOICE}>new invoice</Link>
									</li>
								</ul>
							</li>
							<li id='nota'>
								bills
								<ul>
									<li>
										<Link to={ROUTES.BILLS}>list bills</Link>
									</li>
									<li>
										<Link to={ROUTES.BILL}>new bill</Link>
									</li>
								</ul>
							</li>
							<li id='bedrijf'>
								Company
								<ul>
									<li>
										<Link to={ROUTES.COMPANIES}>list companies</Link>
									</li>
									<li>
										<Link to={ROUTES.COMPANY}>new company</Link>
									</li>
								</ul>
							</li>
							<li id='userSettings'>
								User settings
								<ul>
									<li>
										<Link to={ROUTES.ADMIN}>Settings</Link>
									</li>
								</ul>
							</li>
							<li id='stats'>
								overview
								<ul>
									<li>
										<Link to={ROUTES.STATS}>Income and expenses</Link>
									</li>
									<li>
										<a href='#'>revenue</a>
									</li>
								</ul>
							</li>
						</ul>
						{this.props.authUser && this.props.authUser.authUser && <SignOut />}
					</div>
				</div>
				<div id='topContentBar'>
					<div id='languageSwitch'>
						<a
							href='/index.cfm?event=factuur.list&amp;dir=desc&amp;order=id&amp;page=1&amp;ISOEndDate=&amp;ISOStartDate=&amp;language=en'
							className='active'>
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

const Navigation = compose(withAuthentication, AddAuthentication, withRouter)(NavigationForm);

export default withAuthorization(authCondition)(Navigation);
