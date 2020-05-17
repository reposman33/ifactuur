import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import * as ROUTES from "../../constants/routes.js";
import Settings from "../Settings/settings";
import Expense from "../Expenses/expense";
import Expenses from "../Expenses/expenses";
import Companies from "../Companies/companies";
import Company from "../Companies/company";
import Invoices from "../Invoices/invoices";
import Invoice from "../Invoices/invoice";
import PasswordChange from "../PasswordChange";
import PasswordForget from "../PasswordForget";
import SignIn from "../Security/signin";
import SignUp from "../Security/signup";
import Stats from "../Stats";

const AppRouter = () => (
	<Switch>
		<Redirect exact from='' to={ROUTES.INVOICES} />
		<Route exact path={ROUTES.COMPANIES} component={Companies} />
		<Route exact path={ROUTES.COMPANY} component={Company} />
		<Route exact path={ROUTES.SETTINGS} component={Settings} />
		<Route exact path={ROUTES.EXPENSES} component={Expenses} />
		<Route exact path={ROUTES.EXPENSE} component={Expense} />
		<Route exact path={ROUTES.INVOICES} component={Invoices} />
		<Route exact path={ROUTES.INVOICE} component={Invoice} />
		<Route exact path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} />
		<Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
		<Route exact path={ROUTES.SIGN_IN} component={SignIn} />
		<Route exact path={ROUTES.SIGN_UP} component={SignUp} />
		<Route exact path={ROUTES.STATS} component={Stats} />
	</Switch>
);

export { AppRouter };
