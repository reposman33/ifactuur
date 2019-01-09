import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";

import "./index.scss";

class Navigation extends Component {
	render() {
		return (
			<div>
				<div>
					<div class='mainMenu'>
						<ul>
							<li id='factuur' class='navMenuItemSelected'>
								<Link to={ROUTES.INVOICES}>invoices</Link>
								<ul>
									<li>
										<a href='#' class='navMenuItemSelected'>
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
						<img alt='logout' src='/includes/img/logout.png' />
					</div>
				</div>
				<div id='topContentBar'>
					<div id='welcomeMessage'>
						Last login:&nbsp;07-01-2019 15:27:52
					</div>

					<div id='languageSwitch'>
						<a
							href='/index.cfm?event=factuur.list&amp;dir=desc&amp;order=id&amp;page=1&amp;ISOEndDate=&amp;ISOStartDate=&amp;language=en'
							class='active'>
							engels
						</a>
						&nbsp;/
						<a
							href='/index.cfm?event=factuur.list&amp;dir=desc&amp;order=id&amp;page=1&amp;ISOEndDate=&amp;ISOStartDate=&amp;language=nl'
							class=''>
							nederlands
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default Navigation;
