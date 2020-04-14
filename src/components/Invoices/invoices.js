import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import "./invoices.scss";

class Invoices extends React.Component {
	constructor(props) {
		super(props);
		this.I18n = new I18n();
		this.PAGE = "INVOICES";
		this.state = { rowData: [] };
		this.emptyRowData = {
			id: "",
			date: "",
			client: "",
			sum: "",
			status: ""
		};
		const DateSortFunction = (a, b, order, dataField, rowA, rowB) =>
			order === "asc" ? new Date(a) - new Date(b) : order === "desc" ? new Date(b) - new Date(a) : "";

		this.columns = [
			{ dataField: "invoiceNr", text: "#", headerStyle: { width: "8%" }, sort: true },
			{
				dataField: "dateTimeCreated",
				text: this.I18n.get("INVOICES.TABLE.HEADER_DATE"),
				sort: true,
				sortFunc: DateSortFunction
			},
			{ dataField: "companyName", text: this.I18n.get("INVOICES.TABLE.HEADER_CLIENT"), sort: true },
			{
				dataField: "invoiceType",
				text: this.I18n.get("INVOICES.TABLE.HEADER_TYPE"),
				headerStyle: { width: "10%" }
			},
			{
				dataField: "statusTitle",
				text: this.I18n.get("INVOICES.TABLE.HEADER_STATUS"),
				headerStyle: { width: "10%" }
			}
		];
		// make the async call to Firebase and pick it up in componentDidMount
		this.invoicesPromise = this.props.firebase.getInvoices(this.columns, "dateTimeCreated");

		this.table = {
			defaultSorted: [
				{
					dataField: "dateTimeCreated",
					order: "asc"
				}
			],
			defaultSortDirection: "desc"
		};
		this.handleNewInvoice = this.handleNewInvoice.bind(this);

		this.paginationConfig = {
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
						.map(word =>
							word === "{from}" ? from : word === "{to}" ? to : word === "{size}" ? size : word
						)
						.join(" ")}
				</span>
			)
		};
	}

	componentDidMount() {
		// ==> function that imports invoices as exported from MySQL db
		// this.props.firebase.importInvoices();
		// ==> function that converts specification field to an array with object, 1 per row
		// this.props.firebase.convertRows2JSON();
		// function that converts invoice.rows fiewld to type array
		// this.props.firebase.convertInvoiceRowsToArray();
		// convert specified field keys to datatypes
		// this.props.firebase.typeInvoices();
		// ==> retrieve the invoices to display in browser...
		this.invoicesPromise.then(res => this.setState({ rowData: res }));
	}

	handleNewInvoice() {
		this.props.history.push(ROUTES.INVOICE);
	}

	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({ pathname: ROUTES.INVOICE, state: { id: this.state.rowData[rowIndex].id } });
	};

	render() {
		return (
			<div>
				<BootstrapTable
					bootstrap4
					data={this.state.rowData}
					classes='table'
					columns={this.columns}
					table={this.table}
					keyField='id'
					bordered
					hover
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>

				<button className='btn btn-primary float-right' onClick={this.handleNewInvoice}>
					{this.I18n.get("INVOICES.BUTTONS.NEW_INVOICE")}
				</button>
			</div>
		);
	}
}

export default withFirebase(Invoices);
