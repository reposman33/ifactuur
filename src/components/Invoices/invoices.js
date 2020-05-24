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

class Invoices extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rowData: [] };
		this.Utils = new Utils();
		// make the async call to Firebase and pick it up in componentDidMount
		this.invoicesPromise$ = this.props.firebase.getCollection("invoices", "dateTimeCreated", [
			"invoiceNr",
			"dateTimeCreated",
			"companyName",
			"type",
			"statustitle",
		]);
	}

	I18n = new I18n();

	getColumns = () => [
		{ dataField: "invoiceNr", text: "#", headerStyle: { width: "8%" }, sort: true },
		{
			dataField: "dateTimeCreated",
			text: this.I18n.get("INVOICES.TABLE.HEADERS.DATE"),
			sort: true,
			sortFunc: this.Utils.dateSortFunction,
		},
		{
			dataField: "companyName",
			text: this.I18n.get("INVOICES.TABLE.HEADERS.CLIENT"),
			sort: true,
		},
		{
			dataField: "type",
			text: this.I18n.get("INVOICES.TABLE.HEADERS.TYPE"),
			headerStyle: { width: "10%" },
		},
		{
			dataField: "statustitle",
			text: this.I18n.get("INVOICES.TABLE.HEADERS.STATUS"),
			headerStyle: { width: "10%" },
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
				dataField: "dateTimeCreated",
				order: "asc",
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

	componentDidMount() {
		this.invoicesPromise$.then((res) => this.setState({ rowData: res }));
	}

	handleNewInvoice = () => {
		this.props.history.push(ROUTES.INVOICE);
	};

	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({
			pathname: ROUTES.INVOICE,
			state: { id: this.state.rowData[rowIndex].ID },
		});
	};

	render() {
		return (
			<div>
				<BootstrapTable
					bootstrap4
					data={this.state.rowData}
					classes={styles.table}
					columns={this.getColumns()}
					table={this.table}
					keyField='ID'
					bordered
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>

				<Button
					onClick={this.handleNewInvoice}
					text={this.I18n.get("BUTTON.NEW")}
					extraClasses='float-right mr-3'
				/>
			</div>
		);
	}
}

export default withFirebase(Invoices);
