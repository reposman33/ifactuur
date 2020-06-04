import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { withFirebase } from "../../Firebase";
import { DateComponent } from "../Shared/Date/date";
import { Button } from "../Shared/Button/button";
import { Select } from "../Shared/Select/select";
import { Input } from "../Shared/Input/input";
import styles from "./../Shared/styles/react-bootstrap-table.module.scss";
import componentStyles from "./stats.module.scss";

class Stats extends React.Component {
	constructor(props) {
		super(props);
		this.Utils = new Utils();
		this.state = { startDate: undefined, endDate: undefined, years: [] };
		this.I18n = new I18n();
	}

	componentDidMount() {
		// get a unique array of all years invoices exist
		this.props.firebase
			.getUniqueYears("invoices")
			.then((years) => this.setState({ years: years, year: years[0].value }));
	}
	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	getColumns = (type) =>
		type === "invoices"
			? [
					{
						dataField: "invoiceNr",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.ID"),
						headerStyle: { width: "3%", fontSize: "0.9rem" },
					},
					{
						dataField: "dateTimeCreated",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.DATETIMECREATED"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "companyName",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.COMPANY"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "total",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.AMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
					{
						dataField: "VAT",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.TOTALVATAMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
			  ]
			: [
					{
						dataField: "id",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.ID"),
						headerStyle: { width: "3%", fontSize: "0.9rem" },
					},
					{
						dataField: "date",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.DATETIMECREATED"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "company",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.COMPANY"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "amount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.AMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
					{
						dataField: "expenseVatAmount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.TOTALVATAMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
			  ];

	getPaginationConfig = () => ({
		sizePerPage: 3,
		hideSizePerPage: true,
		hidePageListOnlyOnePage: true,
		showTotal: true,
		prePageTitle: this.I18n.get("PAGINATION.PREVIOUS_PAGE"),
		nextPageTitle: this.I18n.get("PAGINATION.NEXT_PAGE"),
		firstPageTitle: this.I18n.get("PAGINATION.FIRST_PAGE"),
		lastPageTitle: this.I18n.get("PAGINATION.LAST_PAGE"),
		paginationTotalRenderer: (from, to, size) => (
			<span className='react-bootstrap-table-pagination-total'>
				{this.I18n.get("PAGINATION.TOTAL")
					.split(" ")
					.map((word) => (word === "{from}" ? from : word === "{to}" ? to : word === "{size}" ? size : word))
					.join(" ")}
			</span>
		),
	});

	onCalculateTurnover = (startDate, endDate) => {
		// calculate total turnover over period
		startDate = this.state.startDate || startDate;
		endDate = this.state.endDate || endDate;

		// Retrieve all invoices.
		this.props.firebase.getInvoicesInPeriod(startDate, endDate).then((res) => {
			let totalTurnover = 0;
			// For each invoice...
			const invoicesInPeriod = res.map((invoice) => {
				// ...calculate the turnover...
				const total = invoice.rows.reduce((acc, row) => {
					if (row.uren && row.uurtarief) {
						acc += row.uren * row.uurtarief;
						// ...calculate total turnover of all invoices...
						totalTurnover += acc;
					}
					return acc;
				}, 0);
				// ...enrich invoice with VAT payed over invoice amount and format as currency.
				invoice.VAT = this.Utils.currencyFormat.format((invoice.VATRate / 100) * total);
				// Format amount as currency.
				invoice.total = this.Utils.currencyFormat.format(total);
				return invoice;
			});
			// Add invoices and total turnover over period to state
			this.setState({
				invoices: invoicesInPeriod,
				totalTurnover: totalTurnover,
			});
		});

		// get total for expenses
		// added field 'expenseVatAmount'
		this.props.firebase.getExpensesInPeriod(startDate, endDate).then((expenses) => {
			let totalVAT = 0;
			const expensesInPeriod = expenses.map((expense) => {
				const expenseVatAmount = expense.amount * (expense.vatrate / 100);
				totalVAT += expenseVatAmount;
				expense.expenseVatAmount = this.Utils.currencyFormat.format(expenseVatAmount);
				expense.amount = this.Utils.currencyFormat.format(expense.amount);
				return expense;
			});
			this.setState({
				expenses: expensesInPeriod,
				totalVAT: this.Utils.currencyFormat.format(totalVAT),
			});
		});
	};

	onCalculateTurnoverByquarter = () => {
		let startDate;
		let endDate;
		switch (this.state.quarter) {
			case "Q1":
				startDate = "01-01";
				endDate = "03-31";
				break;
			case "Q2":
				startDate = "04-01";
				endDate = "06-31";
				break;
			case "Q3":
				startDate = "07-01";
				endDate = "09-30";
				break;
			case "Q4":
				startDate = "10-01";
				endDate = "12-31";
				break;
			default:
				startDate = "";
				endDate = "";
		}
		this.onCalculateTurnover(`${this.state.year}-${startDate}`, `${this.state.year}-${endDate}`);
	};

	table = {
		defaultSorted: [
			{
				dataField: "name",
				order: "asc",
			},
		],
		defaultSortDirection: "desc",
	};

	render() {
		return (
			<>
				<div className='row'>
					<div className='col d-flex flex-row align-items-center'>
						<div className='d-flex flex-column w-50'>
							<div className='d-flex flex-row'>
								<DateComponent
									container={false}
									displayInput={true}
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText={this.I18n.get("STATS.LABELS.DATE.FROM")}
									name='startDate'
								/>
								<DateComponent
									container={false}
									displayInput={true}
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText={this.I18n.get("STATS.LABELS.DATE.TO")}
									name='endDate'
								/>
							</div>
							<Button
								disabled={!(this.state.startDate && this.state.endDate)}
								extraClasses='ml-3 mt-3'
								onClick={this.onCalculateTurnover}
								text={this.I18n.get("STATS.BUTTONS.SHOWTURNOVER")}
							/>
						</div>
						<div className='d-flex flex-column w-50'>
							<div className='d-flex flex-row'>
								<Select
									container={false}
									extraClasses='w-25'
									labelText={this.I18n.get("STATS.BUTTONS.YEAR")}
									name='year'
									displayInput={true}
									data={this.state.years}
									displayKey='value'
									valueKey='id'
									handleOnChange={this.onChange}
								/>
								<Input
									container={false}
									displayInput={true}
									displayValue='Q1'
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText='Q1'
									name='quarter'
									type='radio'
								/>
								<Input
									container={false}
									displayInput={true}
									displayValue='Q2'
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText='Q2'
									name='quarter'
									type='radio'
								/>
								<Input
									container={false}
									displayInput={true}
									displayValue='Q3'
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText='Q3'
									name='quarter'
									type='radio'
								/>
								<Input
									container={false}
									displayInput={true}
									displayValue='Q4'
									extraClasses='mx-3'
									handleOnChange={this.onChange}
									labelText='Q4'
									name='quarter'
									type='radio'
								/>
							</div>
							<Button
								disabled={!this.state.quarter}
								extraClasses='mt-3 align-self-center'
								onClick={this.onCalculateTurnoverByquarter}
								text={this.I18n.get("STATS.BUTTONS.SHOWTURNOVERFORQUARTER")}
							/>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						{!!this.state.invoices ? (
							<>
								<span className={componentStyles.title}>{this.I18n.get("STATS.BUTTONS.TURNOVER")}</span>
								<BootstrapTable
									bootstrap4
									bordered={false}
									data={this.state.invoices}
									classes={styles.ReactBootstrapTable}
									columns={this.getColumns("invoices")}
									table={this.table}
									keyField='ID'
									rowEvents={{ onClick: this.onRowClick }}
									pagination={paginationFactory(this.getPaginationConfig())}></BootstrapTable>
								<div className={componentStyles.totalRow + " d-flex flex-row"}>
									<span>{this.I18n.get("STATS.LABELS.TOTALTURNOVER")}:</span>
									<span className='ml-3'>
										{this.Utils.currencyFormat.format(this.state.totalTurnover)}
									</span>
								</div>
							</>
						) : (
							""
						)}
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						{!!this.state.expenses ? (
							<>
								<span className={componentStyles.title}>
									{this.I18n.get("STATS.BUTTONS.SHOWEXPENSES")}
								</span>
								<BootstrapTable
									bootstrap4
									bordered={false}
									data={this.state.expenses}
									classes={styles.ReactBootstrapTable}
									columns={this.getColumns("expenses")}
									table={this.table}
									keyField='ID'
									rowEvents={{ onClick: this.onRowClick }}
									pagination={paginationFactory(this.getPaginationConfig())}></BootstrapTable>
								<div className={componentStyles.totalRow + " d-flex flex-row"}>
									<span>{this.I18n.get("STATS.LABELS.TOTALEXPENSESVAT")}:</span>
									<span className='ml-3'>{this.state.totalVAT}</span>
								</div>
							</>
						) : (
							""
						)}
					</div>
				</div>
			</>
		);
	}
}

export default withFirebase(Stats);
