import React from "react";
import { Button } from "./../Shared/Button/button";
import { DateComponent } from "./../Shared/Date/date";
import { Input } from "../Shared/Input/input";
import { Select } from "./../Shared/Select/select";
import { Textarea } from "../Shared/Textarea/textarea";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import * as ROUTES from "../../constants/routes";
import { firebaseContextConsumer } from "../../Firebase";
import componentStyles from "./expense.module.scss";

class Expense extends React.Component {

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
			expenseStatus: {
				type: false,
				message: "",
			},
			vatrate: undefined,
			vatrates: [],
			id: undefined,
		};

		// Transformation functions for fieldvalues before storing.
		this.persistFields = {
			amount: parseFloat,
			company: (fieldValue) => fieldValue,
			date: (date) => new Date(date),
			description: (fieldValue) => fieldValue,
			id: parseInt,
			vatrate: parseInt,
		};
		this.isExistingExpense = !!(!!this.props.location.state && !!this.props.location.state.id);

		// Use constants for fieldnames instead of literals
		this.FIELDNAMES = {
			DATE: "date",
			COMPANY: "company",
			DESCRIPTION: "description",
			AMOUNT: "amount",
			VATRATE: "vatrate",
		};

		// To assert the validity of a value use this map with assertions for each invoiceField. Note: this is output from DOMelements. E.g. <input type="date"> returns a DOMString
		this.assertFieldOfType = {
			amount: (value) => typeof value === "string" && value.length > 0,
			company: (value) => typeof value === "string" && value.length > 0,
			date: (value) => typeof value === "string" && value.length > 0,
			description: (value) => typeof value === "string" && value.length > 0,
			id: (value) => typeof value === "number",
			vatrate: (value) => typeof value === "string" && value.length > 0,
		};
	}

	componentDidMount() {
		if (!this.isExistingExpense) {
			const newExpensePromises$ = [];
			// retrieve companies
			newExpensePromises$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			newExpensePromises$.push(this.props.firebase.getVatRates());
			// retrieve a new id
			newExpensePromises$.push(this.props.firebase.getNewId());
			Promise.all(newExpensePromises$).then((values) => {
				this.setState({
					companies: values[0],
					vatrates: values[1],
					id: values[2],
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
				prevLocationName: "ROUTENAME.EXPENSE",
			},
		});
	};

	/**
	 * submit the expense
	 */
	onSubmit = () => this.storeExpense(this.checkExpense(this.onCreateExpense()));

	/**
	 * Check is all fields are valid, convert to correct type
	 * @returns{object} expense - the expense, optionally with an error key
	 */
	onCreateExpense = () => {
		return Object.keys(this.persistFields).reduce(
			(acc, key) => {
				acc = this.assertFieldOfType[key](this.state[key]) // check if field is valid...
					? Object.assign(acc, { [key]: this.persistFields[key](this.state[key]) }) // if so, convert string to correct type
					: Object.assign(acc, { error: { status: true, keys: [...acc.error.keys, key] } }); // else error
				return acc;
			},
			{ error: { status: false, keys: [] } }
		);
	};

	/**
	 * @param{object} expense - the expense.
	 * @returns{boolean|object} - false in case of error | expense if no error
	 * @sideEffect - sets this.state.expenseStatus if expense is not valid
	 */
	checkExpense = (expense) => {
		if (expense.error) {
			this.setStatusMessage(
				"danger",
				this.I18n.get("USERSETTINGS.SUBMIT.ERROR.MISSINGFIELDVALUES") +
					" [ " +
					expense.error.keys.join(", ") +
					" ]"
			);
			return expense;
		}
	};

	/**
	 * @param{boolean|object} false|expense - this param is false if expense is invalid | param is the expense if expense is valid.
	 * @returns void - calls fireStore as an sideEffect
	 */
	storeExpense = (expense) => {
		if (!expense.error.status) {
			// we don't want to store the  error key
			delete expense.error;
			// add the current user id!
			expense.userId = this.props.firebase.auth.currentUser.uid;
			this.props.firebase
				.addDocumentToCollection("bills", expense)
				.then((docRef) => {
					console.log("document ", docRef.id, " added");
					// remove the temporary state
					this.storage.remove("expenseState");
					// update statusMessage
					this.setStatusMessage("success", this.I18n.get("STATUSMESSAGE.DOCUMENTADDED"));
					// show new expense in listView ;
					this.onListview();
				})
				.catch((e) => this.setStatusMessage("danger", e.message));
		}
	};

	/**
	 * After an action, display message to user
	 *
	 * @param{string} type - the type of the message error-info-warn
	 * @param{string} message - te message to display
	 */
	setStatusMessage = (type, message) => {
		this.setState({
			expenseStatus: {
				type: type,
				message: message,
			},
		});
	};

	onCancel = (e) => {
		this.storage.remove("expenseState");
		// React-Router has no Refresh functionality. This hack solves it
		this.props.history.push("/temp");
		this.props.history.goBack();
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
							name={this.FIELDNAMES.DATE}
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
							name={this.FIELDNAMES.COMPANY}
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
							name={this.FIELDNAMES.DESCRIPTION}
							rows='10'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-row justify-content-between'>
						<Input
							displayInput={!this.isExistingExpense}
							displayValue={this.state.amount}
							extraClasses={componentStyles.euroSignBefore}
							handleOnChange={this.onChange}
							labelText={this.I18n.get("EXPENSE.LABEL.AMOUNT")}
							name={this.FIELDNAMES.AMOUNT}
							type='number'
						/>
						<Select
							data={this.state.vatrates}
							displayInput={!this.isExistingExpense}
							displayKey='rate'
							displayValue={this.state.vatrate}
							extraClasses={componentStyles.percentSignAfter + " m-3"}
							handleOnChange={this.onChange}
							labelText={this.I18n.get("EXPENSE.LABEL.TAX")}
							name={this.FIELDNAMES.VATRATE}
							valueKey='id'
						/>
					</div>
				</div>

				<div className='row align-items-baseline flex-nowrap pr-2 pt-3'>
					<Button
						extraStyles={{ marginLeft: "0.8rem" }}
						extraClasses='mr-auto'
						onClick={this.onListview}
						text={this.I18n.get("EXPENSE.BUTTON.BACK")}
					/>

					<div className='bg-light ml-3'>
						{this.state.expenseStatus.message ? (
							<span className={"text-" + this.state.expenseStatus.type}>
								{this.state.expenseStatus.message}
							</span>
						) : null}
					</div>
					{!this.isExistingExpense && (
						<>
							<div className=' mx-3'>
								<Button
									onClick={this.onCancel}
									text={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TEXT")}
									title={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TITLE")}
								/>
							</div>
							<div>
								<Button
									disabled={this.isExistingExpense}
									onClick={this.onSubmit}
									text={this.I18n.get("EXPENSE.BUTTON.SAVE")}
								/>
							</div>
						</>
					)}
				</div>

				{/* <div className='d-flex mb-2 justify-content-between'>
				</div> */}
				<span className='d-block margin-auto text-center text-danger'>
					{this.state.expenseStatus.error && this.state.expenseStatus.message}
				</span>
			</div>
		);
	}
}

export default firebaseContextConsumer(Expense);
