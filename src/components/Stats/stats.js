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
						text: this.I18n.get("STATS.TABLE.HEADER.ID"),
						headerStyle: { width: "3%", fontSize: "0.9rem" },
					},
					{
						dataField: "dateTimeCreated",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.DATE"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "companyName",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.CHARGEDTO"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "total",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.AMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
					{
						dataField: "VAT",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.VATAMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
			  ]
			: [
					{
						dataField: "id",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.ID"),
						headerStyle: { width: "3%", fontSize: "0.9rem" },
					},
					{
						dataField: "date",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.DATE"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "company",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.PAYEDTO"),
						headerStyle: { width: "10%", fontSize: "0.9rem" },
					},
					{
						dataField: "amount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.AMOUNT"),
						headerStyle: { width: "5%", fontSize: "0.9rem" },
					},
					{
						dataField: "expenseVatAmount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADER.VATAMOUNT"),
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

	onExportTurnoverInPeriod = () => {
		const filename =
			"Turnover_" +
			(this.state.startDate && this.state.endDate
				? `${this.state.startDate}-${this.state.endDate}.xls`
				: `${this.state.quarter}-${this.state.year}.xls`);

		this.save(
			this.exportAsHTML(
				this.state.invoices,
				[
					this.I18n.get("STATS.TABLE.HEADER.INVOICENR"),
					this.I18n.get("STATS.TABLE.HEADER.DATE"),
					this.I18n.get("STATS.TABLE.HEADER.CHARGEDTO"),
					this.I18n.get("STATS.TABLE.HEADER.AMOUNT"),
					this.I18n.get("STATS.TABLE.HEADER.VATAMOUNT"),
				],
				["invoiceNr", "dateTimeCreated", "companyName", "total", "VAT"]
			),
			filename
		);
	};

	onExportExpensesInPeriod = () => {
		const filename =
			"Expenses_" +
			(this.state.startDate && this.state.endDate
				? `${this.state.startDate}-${this.state.endDate}.xls`
				: `${this.state.quarter}-${this.state.year}.xls`);

		this.save(
			this.exportAsHTML(
				this.state.expenses,
				[
					this.I18n.get("STATS.TABLE.HEADER.ID"),
					this.I18n.get("STATS.TABLE.HEADER.DATE"),
					this.I18n.get("STATS.TABLE.HEADER.PAYEDTO"),
					this.I18n.get("STATS.TABLE.HEADER.AMOUNT"),
					this.I18n.get("STATS.TABLE.HEADER.VATAMOUNT"),
				],
				["id", "date", "company", "amount", "expenseVatAmount"]
			),
			filename
		);
	};

	// Microsoft Excel 2016 will give a warning when reading a html file saved with .xls extension and UTF-8 character- encoded but it will at least display the Euro sign correctly and show a nicer (default) format.
	//https: //stackoverflow.com/questions/6002256/is-it-possible-to-force-excel-recognize-utf-8-csv-files-automatically
	exportAsHTML = (data, firstRowValues, columnNames) => {
		// create the table headers
		const firstRow = firstRowValues.reduce((tr, columnHeader) => {
			tr += `<th>${columnHeader}</th>`;
			return tr;
		}, "");

		//  create an array with all the cells
		const tableRows = data.map((ob) => {
			const cells = columnNames.reduce((cells, columnName) => {
				cells += `<td>${ob[columnName]}</td>`;
				return cells;
			}, "");
			return `<tr>${cells}</tr>`;
		});

		// add everything together
		return `<table><tr>${firstRow}</tr><tbody>${tableRows.join("")}</tbody></table>`;
	};

	// Microsoft Excel 2016 can not read UTF-8 csv files by default so the Euro sign is not displayed. correctly. Libre Office calc has no trouble reading csv in UTF-8 format by default...
	exportAsCSV = (data, firstRowValues, columnNames) => {
		// Create the first row of columnnames
		const acc = firstRowValues.join(";") + "\n";
		// return the CSV data to the caller
		return data.reduce((acc, row) => {
			// reduce the data by adding each row after the 1st row of columnanmes
			acc += columnNames.reduce((_acc, columnName) => {
				_acc += `${row[columnName]};`;
				return _acc;
			}, "");
			// after each row remove the last ";" and add a newline/linebreak
			return acc.substring(0, acc.length - 1) + "\n";
		}, acc);
	};

	save = (data, fileName) => {
		// simple trick to prompt te user to downlaod some data
		// c/o https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
		const element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
		element.setAttribute("download", fileName);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	render() {
		return (
			<div className={componentStyles.maxHeight + " d-flex flex-column"}>
				<div className='row flex-grow-2'>
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
								onClick={() => this.onCalculateTurnover(this.state.startDate, this.state.endDate)}
								text={this.I18n.get("STATS.BUTTON.SHOWTURNOVER")}
							/>
						</div>
						<div className='d-flex flex-column w-50'>
							<div className='d-flex flex-row'>
								<Select
									container={false}
									extraClasses='w-25'
									labelText={this.I18n.get("STATS.BUTTON.YEAR")}
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
								text={this.I18n.get("STATS.BUTTON.SHOWTURNOVERFORQUARTER")}
							/>
						</div>
					</div>
				</div>
				<div className='row flex-grow-1'>
					<div className='col'>
						{!!this.state.invoices ? (
							<>
								<span className={componentStyles.title}>
									{this.I18n.get("STATS.TABLE.TITLE.TURNOVERINPERIOD")}
								</span>
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
								<div className={componentStyles.totalRow + " d-flex flex-row justify-content-between"}>
									<span>{this.I18n.get("STATS.LABELS.TOTALTURNOVER")}:</span>
									<span className='ml-3'>
										{this.Utils.currencyFormat.format(this.state.totalTurnover)}
									</span>
									<Button
										disabled={!this.state.invoices}
										onClick={this.onExportTurnoverInPeriod}
										text={this.I18n.get("STATS.BUTTON.EXPORTDATA")}
									/>
								</div>
							</>
						) : (
							""
						)}
					</div>
				</div>
				<div className='row flex-grow-1'>
					<div className='col'>
						{!!this.state.expenses ? (
							<>
								<span className={componentStyles.title}>
									{this.I18n.get("STATS.TABLE.TITLE.EXPENSESINPERIOD")}
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
								<div className={componentStyles.totalRow + " d-flex flex-row justify-content-between"}>
									<span>{this.I18n.get("STATS.LABELS.TOTALEXPENSESVAT")}:</span>
									<span className='ml-3'>{this.state.totalVAT}</span>
									<Button
										disabled={!this.state.invoices}
										onClick={this.onExportExpensesInPeriod}
										text={this.I18n.get("STATS.BUTTON.EXPORTDATA")}
									/>
								</div>
							</>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default withFirebase(Stats);
