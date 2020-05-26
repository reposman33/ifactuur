import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "./../../services/Utils";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../Shared/Button/button";
import styles from "./../Shared/styles/react-bootstrap-table.module.scss";

/**
 * a document from Bills has the following fields
 * amount - company - date - description - id - vatrate
 */
class Expenses extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rowData: [] };
		this.Utils = new Utils();
		// Retrieve the expenses from fireStore
		this.expensesPromise$ = this.props.firebase.getCollection("bills", "date", ["date", "company", "amount"]);
	}

	I18n = new I18n();

	componentDidMount() {
		this.expensesPromise$.then((data) => {
			this.setState({ rowData: data });
		});
	}

	// define the columns for the table
	getColumns = () => [
		{ dataField: "id", text: "#", headerStyle: { width: "8%" }, sort: true },
		{
			dataField: "date",
			text: this.I18n.get("EXPENSES.TABLE.HEADERS.DATE"),
			sort: true,
			sortFunc: this.Utils.dateSortFunction,
		},
		{
			dataField: "company",
			text: this.I18n.get("EXPENSES.TABLE.HEADERS.COMPANY"),
			sort: true,
		},
		{
			dataField: "amount",
			text: this.I18n.get("EXPENSES.TABLE.HEADERS.AMOUNT"),
			formatter: (cell, row) => this.Utils.currencyFormat.format(cell),
			sort: true,
		},
		{
			dataField: "actions",
			text: this.I18n.get("INVOICES.TABLE.HEADERS.ACTIONS"),
			isDummyField: true,
			formatter: () => (
				<span className={styles.actionIcons}>
					<FontAwesomeIcon icon='print' />
					<FontAwesomeIcon icon='edit' />
				</span>
			),
			headerStyle: { width: "10%" },
		},
	];

	table = {
		defaultSorted: [
			{
				dataField: "date",
				order: "desc",
			},
		],
		defaultSortDirection: "desc",
	};

	paginationConfig = {
		sizePerPage: 10,
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
	};

	handleNewExpense = () => this.props.history.push(ROUTES.EXPENSE);

	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({
			pathname: ROUTES.EXPENSE,
			state: { id: row.ID },
		});
	};

	render() {
		return (
			<>
				<BootstrapTable
					bootstrap4
					data={this.state.rowData}
					classes={styles.ReactBootstrapTable}
					columns={this.getColumns()}
					table={this.table}
					keyField='ID'
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>

				<Button
					extraClasses='btn btn-primary float-right mr-3'
					onClick={this.handleNewExpense}
					text={this.I18n.get("BUTTON.NEW")}
				/>
			</>
		);
	}
}

export default withFirebase(Expenses);
