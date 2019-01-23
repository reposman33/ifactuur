import React from "react";
import {
	AuthUserContext,
	withAuthentication,
	withAuthorization
} from "../Session/index.js";
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
								<Link to={ROUTES.INVOICES}>invoices</Link>
								<ul>
									<li>
										<a
											href='#'
											className='navMenuItemSelected'>
											list invoices
										</a>
									</li>
									<li>
										<a href='#'>new invoice</a>
									</li>
								</ul>
							</li>
							<li id='nota'>
								<Link to={ROUTES.BILLS}>bills</Link>
								<ul>
									<li>
										<a href='#'>list bills</a>
									</li>
									<li>
										<a href='#'>new bill</a>
									</li>
								</ul>
							</li>
							<li id='bedrijf'>
								<Link to={ROUTES.COMPANIES}>companies</Link>
								<ul>
									<li>
										<a href='#'>list companies</a>
									</li>
									<li>
										<a href='#'>new company</a>
									</li>
								</ul>
							</li>
							<li id='userSettings'>
								<Link to={ROUTES.ADMIN}>my data</Link>
								<ul>
									<li>
										<a href='#'>edit</a>
									</li>
								</ul>
							</li>
							<li id='stats'>
								<Link to={ROUTES.STATS}>overview</Link>
								<ul>
									<li>
										<a href='#'>Income and expenses</a>
									</li>
									<li>
										<a href='#'>revenue</a>
									</li>
								</ul>
							</li>
						</ul>
						{this.props.authUser &&
							this.props.authUser.authUser && <SignOut />}
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
	<AuthUserContext.Consumer>
		{authUser => <Component authUser={authUser} />}
	</AuthUserContext.Consumer>
);

const authCondition = authUser => authUser && authUser.authUser !== null;

const Navigation = compose(
	withAuthentication,
	AddAuthentication,
	withRouter
)(NavigationForm);

export default withAuthorization(authCondition)(Navigation);
