import React from "react";
import { Button } from "./../Shared/Button/button";
import { DateComponent } from "./../Shared/Date/date";
import { Input } from "../Shared/Input/input";
import { Select } from "./../Shared/Select/select";
import { Textarea } from "../Shared/Textarea/textarea";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import { PersistenceContext } from "../../constants/contexts";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import componentStyles from "./expense.module.scss";

class Expense extends React.Component {
	static contextType = PersistenceContext;

	constructor(props) {
		super(props);
		this.Utils = new Utils();
		this.I18n = new I18n();
		this.storage = undefined; // to be set in componentDidMount

		// initialize state
		this.state = {
			amount: undefined,
			companies: [],
			company: undefined,
			date: undefined,
			description: undefined,
			vatrate: undefined,
			vatrates: [],
		};

		// Transformation functions for fieldvalues before storing.
		this.persistFields = {
			amount: parseFloat,
			company: (fieldValue) => fieldValue,
			date: (date) => new Date(date),
			description: (fieldValue) => fieldValue,
			vatrate: parseInt,
		};
		this.isExistingExpense = !!(!!this.props.location.state && !!this.props.location.state.id);
	}

	componentDidMount() {
		if (!this.isExistingExpense) {
			const newExpensePromises$ = [];
			// retrieve companies
			newExpensePromises$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			newExpensePromises$.push(this.props.firebase.getVatRates());
			Promise.all(newExpensePromises$).then((values) => {
				this.setState({
					companies: values[0],
					vatrates: values[1],
				});
			});
		} else {
			// retrieve the expense
			this.props.firebase.getExpense(this.props.location.state.id).then((expense) => {
				this.setState({
					amount: expense.amount,
					company: expense.company,
					date: expense.date,
					description: expense.description,
					vatrate: expense.vatrate,
				});
			});
		}
		// consume the persistence context
		this.storage = this.context;

		// overwrite the state when a previous state is stored
		const storedState = this.storage.get("expenseState");
		if (storedState) {
			this.setState(storedState);
		}
	}

	/**
	 * handle input of most input fields
	 * @param{string} name - name of the inputfield
	 * @param{string} value - value of the inputfield
	 */
	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	/**
	 * Return to the listview of expenses
	 */
	onListview = () => {
		// remove the temporary state
		this.storage.remove("expenseState");

		this.props.history.push({
			pathname: ROUTES.EXPENSES,
		});
	};

	/**
	 * When user clicks 'New company' store current state and switch to Company component
	 */
	handleNewCompany = () => {
		// copy the state values that will be eventually stored to temporary storage. To be picked up when returning from creating a new company
		const persistFields = Object.keys(this.persistFields);
		this.storage.set(
			"expenseState",
			persistFields.reduce((acc, persistField) => {
				acc[persistField] = this.state[persistField];
				return acc;
			}, {})
		);
		// render Company component
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			params: {
				prevLocation: this.props.location.pathname,
				prevLocationName: "LOCATION.INVOICE",
			},
		});
	};

	onSubmit = () => {
		const expense = {};
		Object.keys(this.persistFields).map(
			// filter keys and optionally convert state prop values
			(key) => {
				if (this.state[key]) {
					expense[key] = this.persistFields[key](this.state[key]);
				}
				return null;
			}
		);
		// add the current user id!
		expense.userId = this.props.firebase.auth.currentUser.uid;
		// save to fireStore
		this.props.firebase.addDocumentToCollection("bills", expense).then((docRef) => {
			console.log("document ", docRef.id, " added");
			this.onListview();
		});
		// remove the temporary state
		this.storage.remove("expenseState");
	};

	render() {
		return (
			<div>
				<div className='row'>
					<div className='col justify-content-center w-50'>
						<DateComponent
							displayInput={!this.isExistingExpense}
							displayValue={this.state.date}
							handleOnChange={this.onChange}
							labelText={this.I18n.get("EXPENSE.LABEL.DATE")}
							name='date'
						/>
					</div>
					<div className='col w-50'>
						<Select
							buttonText={this.I18n.get("INVOICE.BUTTON.NEW_COMPANY")}
							data={this.state.companies}
							displayKey='name'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.company}
							extraClasses='w-100 mr-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("EXPENSE.LABEL.COMPANY")}
							name='company'
							onButtonClick={this.handleNewCompany}
							valueKey='ID'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex justify-content-center p-3'>
						<Textarea
							cols='90'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.description}
							extraClasses='w-100 m-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("EXPENSE.LABEL.ITEM")}
							name='description'
							rows='10'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-row justify-content-between'>
						<Input
							type='number'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.amount}
							extraClasses={componentStyles.euroSignBefore}
							handleOnChange={this.onChange}
							name='amount'
							labelText={this.I18n.get("EXPENSE.LABEL.AMOUNT")}
						/>
						<Select
							labelText={this.I18n.get("EXPENSE.LABEL.TAX")}
							name='vatrate'
							displayValue={this.state.vatrate}
							displayInput={!this.isExistingExpense}
							extraClasses={componentStyles.percentSignAfter + " m-3"}
							handleOnChange={this.onChange}
							data={this.state.vatrates}
							displayKey='rate'
							valueKey='ID'
						/>
					</div>
				</div>
				<div className='d-flex justify-content-between'>
					<Button
						extraStyles={{ marginLeft: "0.8rem" }}
						extraClasses='m-3'
						onClick={this.onListview}
						text={this.I18n.get("EXPENSE.BUTTON.BACK")}
					/>
					<Button
						disabled={this.isExistingExpense}
						extraStyles={{ marginRight: "0.8rem" }}
						extraClasses='m-3'
						onClick={this.onSubmit}
						text={this.I18n.get("EXPENSE.BUTTON.SAVE")}
					/>
				</div>
			</div>
		);
	}
}

export default withFirebase(Expense);
