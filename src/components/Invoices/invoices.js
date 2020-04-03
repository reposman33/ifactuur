import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import I18n from "../../services/I18n/I18n";
import { state } from "../../constants/dummyState";
import * as ROUTES from "../../constants/routes";
import "./index.scss";
//import API from "../../services/API/API";

class Invoices extends React.Component {
	constructor(props) {
		super(props);
		this.PAGE = "INVOICES";
		this.state = { ...state };
		this.emptyRowData = {
			id: "",
			date: "",
			client: "",
			sum: "",
			status: ""
		};
		this.columns = [
			{ dataField: "id", text: "" },
			{ dataField: "date", text: I18n.get("INVOICES.TABLE.HEADER_DATE") },
			{ dataField: "client", text: I18n.get("INVOICES.TABLE.HEADER_CLIENT") },
			{ dataField: "sum", text: I18n.get("INVOICES.TABLE.HEADER_SUM") },
			{ dataField: "status", text: I18n.get("INVOICES.TABLE.HEADER_STATUS") }
		];
		this.handleNewInvoice = this.handleNewInvoice.bind(this);
		//		const paginationReplacer = (_, p) => (p === "{from}" ? from : p === "{to}" ? to : p === "{size}" ? size : "");
		this.paginationConfig = {
			sizePerPage: 10,
			hideSizePerPage: true,
			hidePageListOnlyOnePage: true,
			showTotal: true,
			prePageTitle: I18n.get("PAGINATION.PREVIOUS_PAGE"),
			nextPageTitle: I18n.get("PAGINATION.NEXT_PAGE"),
			firstPageTitle: I18n.get("PAGINATION.FIRST_PAGE"),
			lastPageTitle: I18n.get("PAGINATION.LAST_PAGE"),
			paginationTotalRenderer: (from, to, size) => (
				<span className='react-bootstrap-table-pagination-total'>
					{I18n.get("PAGINATION.TOTAL")
						.split(" ")
						.map(word =>
							word === "{from}" ? from : word === "{to}" ? to : word === "{size}" ? size : word
						)
						.join(" ")}
				</span>
			)
		};
	}

	handleNewInvoice() {
		this.props.history.push(ROUTES.INVOICE);
	}

	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({ pathname: ROUTES.INVOICE, state: { id: state.rowData[rowIndex].id } });
	};

	render() {
		return (
			<div>
				<BootstrapTable
					data={state.rowData}
					classes='table'
					columns={this.columns}
					keyField='id'
					bordered
					hover
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}>
					{/* <thead>
						<tr>
							<th></th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_DATE")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_CLIENT")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_SUM")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_STATUS")}</th>
							<th></th>
						</tr>
					</thead> */}
				</BootstrapTable>
				<button className='btn btn-primary float-right' onClick={this.handleNewInvoice}>
					{I18n.get("INVOICES.BUTTONS.NEW_INVOICE")}
				</button>
			</div>
		);
	}
}

export { Invoices };
