import React from "react";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { Utils } from "../../services/Utils";
import { withFirebase } from "../../Firebase";
import { Select } from "./../Shared/Select/select";
import { DateComponent } from "./../Shared/Date/date";
import "./expense.scss";

class Expense extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			amount: undefined,
			companies: undefined,
			company: undefined,
			date: undefined,
			description: undefined,
			id: undefined,
			vatrate: undefined,
		};
		this.Utils = new Utils();
		this.I18n = new I18n();
		this.isExistingExpense = !!this.props.location.state && !!this.props.location.state.id;
		this.newExpensePromises$ = [];

		if (!this.isExistingExpense) {
			// retrieve companies
			this.newExpensePromises$.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			this.newExpensePromises$.push(this.props.firebase.getCollection("vatrates", "rate", ["id", "rate"]));
		} else {
			// retrieve the expense
			this.newExpensePromises$.push(this.props.firebase.getExpense(this.props.location.state.id));
		}
	}

	componentDidMount() {
		if (!this.isExistingExpense) {
			// new expense
			Promise.all(this.newExpensePromises$).then((values) => {
				this.setState(
					{
						companies: values[0],
						vatrate: values[1],
					},
					() => this.setState({ companies: values[0] })
				);
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

	render() {
		return (
			<div>
				<div className='row'>
					<div className='col'>
						<DateComponent
							labelText={this.I18n.get("EXPENSES.LABELS.DATE")}
							name='date'
							existingValue={this.state.date}
						/>
					</div>
					<div className='col'>
						<Select
							labelText={this.I18n.get("EXPENSES.LABELS.COMPANY")}
							name='companies'
							existingValue={this.state.company}
							data={this.state.companies}
							displayKey='name'
							valueKey='ID'
							newButtonText={this.I18n.get("EXPENSES.BUTTONS.NEW_EXPENSE")}
							onNewItem={() => this.props.history.push(ROUTES.COMPANY)}
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col'></div>
				</div>
				<div className='row'>
					<div className='col'></div>
				</div>
			</div>
		);
	}
}

export default withFirebase(Expense);
