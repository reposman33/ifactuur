import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase/index.js";
import "./index.scss";

class Invoices extends React.Component {
	constructor(props) {
		super(props);
		this.i18N = new I18n();
		this.PAGE = "INVOICES";
		this.state = { rowData: [] };
		this.emptyRowData = {
			id: "",
			date: "",
			client: "",
			sum: "",
			status: "",
		};
		this.columns = [
			{ dataField: "invoiceID", text: "#", sort: true },
			{ dataField: "dateTimeCreated", text: this.i18N.get("INVOICES.TABLE.HEADER_DATE"), sort: true },
			{ dataField: "companyName", text: this.i18N.get("INVOICES.TABLE.HEADER_CLIENT"), sort: true },
			{ dataField: "statustitle", text: this.i18N.get("INVOICES.TABLE.HEADER_STATUS"), sort: true },
		];
		this.handleNewInvoice = this.handleNewInvoice.bind(this);

		this.paginationConfig = {
			sizePerPage: 10,
			hideSizePerPage: true,
			hidePageListOnlyOnePage: true,
			showTotal: true,
			prePageTitle: this.i18N.get("PAGINATION.PREVIOUS_PAGE"),
			nextPageTitle: this.i18N.get("PAGINATION.NEXT_PAGE"),
			firstPageTitle: this.i18N.get("PAGINATION.FIRST_PAGE"),
			lastPageTitle: this.i18N.get("PAGINATION.LAST_PAGE"),
			paginationTotalRenderer: (from, to, size) => (
				<span className='react-bootstrap-table-pagination-total'>
					{this.i18N
						.get("PAGINATION.TOTAL")
						.split(" ")
						.map((word) =>
							word === "{from}" ? from : word === "{to}" ? to : word === "{size}" ? size : word
						)
						.join(" ")}
				</span>
			),
		};
	}

	componentDidMount() {
		this.props.firebase.getInvoices(this.columns, "dateTimeCreated").then((res) => this.setState({ rowData: res }));
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
					data={this.state.rowData}
					classes='table'
					columns={this.columns}
					keyField='invoiceID'
					bordered
					hover
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>
				<button className='btn btn-primary float-right' onClick={this.handleNewInvoice}>
					{this.i18N.get("INVOICES.BUTTONS.NEW_INVOICE")}
				</button>
			</div>
		);
	}
}

export default withFirebase(Invoices);
