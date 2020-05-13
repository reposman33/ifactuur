import React from "react";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { Utils } from "../../services/Utils";
import { withFirebase } from "../../Firebase";
import { Select } from "./../Shared/Select/select";
import { DateComponent } from "./../Shared/Date/date";
import { TextInput } from "./../Shared/TextInput/textInput";
import { Textarea } from "../Shared/Textarea/textarea";
import { Button } from "./../Shared/Button/button";
import styles from "./expense.module.scss";

class Expense extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: undefined,
			companies: [],
			company: undefined,
			date: undefined,
			description: undefined,
			id: undefined,
			vatrate: undefined,
			vatrates: [],
		};
		this.Utils = new Utils();
		this.I18n = new I18n();
		this.isExistingExpense = !!this.props.location.state && !!this.props.location.state.id;
		this.newExpensePromises$ = [];

		if (!this.isExistingExpense) {
			// retrieve the next id value
			this.newExpensePromises$.push(this.props.firebase.getNewFieldValue("bills", "id"));
			// retrieve companies
			this.newExpensePromises$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			this.newExpensePromises$.push(this.props.firebase.getCollection("vatrates", "rate", ["id", "rate"]));
		} else {
			// retrieve the expense
			this.newExpensePromises$.push(this.props.firebase.getExpense(this.props.location.state.id));
		}

		// conversion function per field to apply to state when persisting to fireStore
		this.persistFields = {
			amount: parseFloat,
			company: (fieldValue) => fieldValue,
			date: (date) => new Date(date),
			description: (fieldValue) => fieldValue,
			id: (fieldValue) => fieldValue,
			vatrate: parseInt,
		};
	}

	componentDidMount() {
		if (!this.isExistingExpense) {
			// new expense
			Promise.all(this.newExpensePromises$).then((values) => {
				this.setState({
					id: values[0],
					companies: values[1],
					vatrates: values[2],
				});
			});
		} else {
			/// existing expense
			Promise.all(this.newExpensePromises$).then((values) => {
				this.setState({
					amount: values[0].amount,
					company: values[0].company,
					date: this.Utils.dateFormat.format(values[0].date),
					description: values[0].description,
					id: values[0].id,
					vatrate: values[0].vatrate,
				});
			});
		}
	}

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
		this.props.firebase.saveExpense(expense).then((docRef) => console.log("document ", docRef.id, " added"));
	};

	/**
	 * handle input of most input fields
	 * @param{string} name - name of both the inputfield & stateKey
	 * @param{string} value - value of user input
	 */

	onChange = (name, value) => {
		console.log(name, "=", value);
		this.setState({ [name]: value }, () => console.log("state = ", this.state));
	};

	// navigate to invoices listView
	onListview = () =>
		this.props.history.push({
			pathname: ROUTES.EXPENSES,
		});

	render() {
		return (
			<div>
				<div className='row'>
					<div className='col d-flex flex-row justify-content-between '>
						<DateComponent
							labelText={this.I18n.get("EXPENSES.LABELS.DATE")}
							name='date'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.date}
							handleOnChange={this.onChange}
						/>
						<Select
							labelText={this.I18n.get("EXPENSES.LABELS.COMPANY")}
							name='company'
							displayValue={this.state.company}
							displayInput={!this.isExistingExpense}
							handleOnChange={this.onChange}
							data={this.state.companies}
							displayKey='name'
							valueKey='ID'
							buttonText={this.I18n.get("EXPENSES.BUTTONS.NEW_EXPENSE")}
							onButtonClick={() => this.props.history.push(ROUTES.COMPANY)}
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<Textarea
							name='description'
							labelText={this.I18n.get("EXPENSES.LABELS.ITEM")}
							cols='30'
							rows='10'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.description}
							handleOnChange={this.onChange}
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-row justify-content-between'>
						<TextInput
							type='number'
							displayInput={!this.isExistingExpense}
							displayValue={this.state.amount && this.Utils.currencyFormat.format(this.state.amount)}
							handleOnChange={this.onChange}
							name='amount'
							labelText={this.I18n.get("EXPENSES.LABELS.AMOUNT")}
						/>
						<Select
							labelText={this.I18n.get("EXPENSES.LABELS.TAX")}
							name='vatrate'
							displayValue={this.state.vatrate + " %"}
							displayInput={!this.isExistingExpense}
							handleOnChange={this.onChange}
							data={this.state.vatrates}
							displayKey='rate'
							valueKey='ID'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex justify-content-between'>
						<Button
							onClick={this.onListview}
							text={this.I18n.get("BUTTON.OVERVIEW")}
							styles={{ marginLeft: "0.8rem" }}
							classes='btn-primary'
						/>
						<Button
							disabled={this.isExistingInvoice}
							onClick={this.onSubmit}
							text={this.I18n.get("BUTTON.SAVE")}
							styles={{ marginRight: "0.8rem" }}
							classes='btn-primary'
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default withFirebase(Expense);
