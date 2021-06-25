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
import PasswordForget from "../PasswordReset/passwordReset";
import SignIn from "../SignIn/signin";
import SignUp from "../SignUp/signup";
import NotFound from "../Error/notFound";
import { PersistenceContextProvider } from "../../constants/contexts";
import { Storage } from "../../services/API/storage";

import Stats from "../Stats/stats";
const storage = new Storage()
const AppRouter = () => (
	<PersistenceContextProvider value={storage}>
		<Switch>
			<Redirect exact from='' to={ROUTES.INVOICES} />
			<Route exact path={ROUTES.COMPANIES} render={(props) => <Companies {...props} />} />
			<Route exact path={ROUTES.COMPANY} render={(props) => <Company {...props} />} />
			<Route exact path={ROUTES.SETTINGS} render={(props) => <Settings {...props} />} />
			<Route exact path={ROUTES.EXPENSES} render={(props) => <Expenses {...props} />} />
			<Route exact path={ROUTES.EXPENSE} render={(props) => <Expense {...props} />} />
			<Route exact path={ROUTES.INVOICES} render={(props) => <Invoices {...props} />} />
			<Route exact path={ROUTES.INVOICE} render={(props) => <Invoice {...props} />} />
			<Route exact path={ROUTES.PASSWORD_CHANGE} render={(props) => <PasswordChange {...props} />} />
			<Route exact path={ROUTES.PASSWORD_FORGET} render={(props) => <PasswordForget {...props} />} />
			<Route exact path={ROUTES.SIGN_IN} render={(props) => <SignIn {...props} />} />
			<Route exact path={ROUTES.SIGN_UP} render={(props) => <SignUp {...props} />} />
			<Route exact path={ROUTES.STATS} render={(props) => <Stats {...props} />} />
			<Route exact path={ROUTES.NOTFOUND} render={(props) => <NotFound {...props} />} />
		</Switch>
	</PersistenceContextProvider>
);

export { AppRouter };
