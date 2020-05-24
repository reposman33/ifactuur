import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { DateComponent } from "../Shared/Date/date";
import { Button } from "../Shared/Button/button";
import styles from "./../Shared/styles/react-bootstrap-table.module.scss";
import componentStyles from "./stats.module.scss";

class Stats extends React.Component {
	constructor(props) {
		super(props);
		this.Utils = new Utils();
		this.state = { dateFrom: undefined, dateTo: undefined };
		this.I18n = new I18n();
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
						text: this.I18n.get("STATS.TABLE.HEADERS.INVOICENR"),
						headerStyle: { width: "3%" },
					},
					{
						dataField: "dateTimeCreated",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.DATETIMECREATED"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "companyName",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.COMPANY"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "total",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.AMOUNT"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "totalVatAmount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.TOTALVATAMOUNT"),
						headerStyle: { width: "10%" },
					},
			  ]
			: [
					{
						dataField: "id",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.ID"),
						headerStyle: { width: "3%" },
					},
					{
						dataField: "date",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.DATETIMECREATED"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "company",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.COMPANY"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "amount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.AMOUNT"),
						headerStyle: { width: "10%" },
					},
					{
						dataField: "expenseVatAmount",
						sort: true,
						text: this.I18n.get("STATS.TABLE.HEADERS.TOTALVATAMOUNT"),
						headerStyle: { width: "10%" },
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

	onCalculateTurnover = () => {
		// get total for invoices
		// added fields 'total' and 'totalVatAmount'
		this.props.firebase.getInvoicesInPeriod(this.state.dateFrom, this.state.dateTo).then((res) => {
			// get VATamount, total amount per invoice
			const invoicesInPeriod = res.map((invoice) => {
				const total = invoice.rows.reduce((acc, row) => {
					if (row.uren && row.uurtarief) {
						acc += row.uren * row.uurtarief;
					}
					return acc;
				}, 0);
				invoice.totalVatAmount = this.Utils.currencyFormat.format((invoice.VATRate / 100) * total);
				invoice.total = this.Utils.currencyFormat.format(total);
				return invoice;
			});
			this.setState({ invoices: invoicesInPeriod });
		});

		// get total for expenses
		// added field 'expenseVatAmount'
		this.props.firebase.getExpensesInPeriod(this.state.dateFrom, this.state.dateTo).then((expenses) => {
			const expensesInPeriod = expenses.map((expense) => {
				const expenseVatAmount =
					expense.amount &&
					Number.isInteger(expense.amount) &&
					expense.vatrate &&
					Number.isInteger(expense.vatrate)
						? expense.amount * (expense.vatrate / 100)
						: 0;
				expense.expenseVatAmount = this.Utils.currencyFormat.format(expenseVatAmount);
				expense.amount = this.Utils.currencyFormat.format(expense.amount);
				return expense;
			});
			this.setState({ expenses: expensesInPeriod });
		});
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
					<div className='col d-flex flex-row'>
						<DateComponent
							container={false}
							displayInput={true}
							extraClasses='mx-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("STATS.LABELS.DATE.FROM")}
							name='dateFrom'
						/>
						<DateComponent
							container={false}
							displayInput={true}
							extraClasses='mx-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("STATS.LABELS.DATE.TO")}
							name='dateTo'
						/>
						<div className='d-flex justify-content-end align-items-end'>
							<Button
								onClick={this.onCalculateTurnover}
								text={this.I18n.get("STATS.BUTTONS.CALCULATE")}
								extraClasses='mr-3'
							/>
						</div>
					</div>
				</div>
				<div className={componentStyles["minwidth-33"] + " row"}>
					<div className='col'>
						{!!this.state.invoices ? (
							<BootstrapTable
								bootstrap4
								data={this.state.invoices}
								classes={styles.table}
								columns={this.getColumns("invoices")}
								table={this.table}
								keyField='ID'
								bordered
								hover
								rowEvents={{ onClick: this.onRowClick }}
								pagination={paginationFactory(this.getPaginationConfig())}></BootstrapTable>
						) : (
							""
						)}
					</div>
				</div>
				<div className={componentStyles["minwidth-33"] + " row"}>
					<div className='col'>
						{!!this.state.expenses ? (
							<BootstrapTable
								bootstrap4
								data={this.state.expenses}
								classes={styles.table}
								columns={this.getColumns("expenses")}
								table={this.table}
								keyField='ID'
								bordered
								hover
								rowEvents={{ onClick: this.onRowClick }}
								pagination={paginationFactory(this.getPaginationConfig())}></BootstrapTable>
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
