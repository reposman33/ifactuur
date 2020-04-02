import React from "react";
import Table from "react-bootstrap/Table";
import I18n from "../../services/I18n/I18n";
import { state } from "../../constants/dummyState";
import * as ROUTES from "../../constants/routes";
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
		this.handleNewInvoice = this.handleNewInvoice.bind(this);
	}

	handleNewInvoice() {
		this.props.history.push(ROUTES.INVOICE);
	}
	renderRows = () => {
		const rows = [];
		for (let i = 0; i < 10; i++) {
			const rowData = this.state.rowData.length > i ? this.state.rowData[i] : this.emptyRowData;
			rows.push(
				<tr key={i}>
					<td>{rowData.id}</td>
					<td>{rowData.date}</td>
					<td>{rowData.client}</td>
					<td>{rowData.sum}</td>
					<td>{rowData.status}</td>
					<td></td>
				</tr>
			);
		}
		return rows;
	};
	render() {
		return (
			<div>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th></th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_DATE")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_CLIENT")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_SUM")}</th>
							<th>{I18n.get("INVOICES.TABLE.HEADER_STATUS")}</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{this.renderRows()}</tbody>
				</Table>
				<button className='btn btn-primary float-right' onClick={this.handleNewInvoice}>
					{I18n.get("INVOICES.BUTTONS.NEW_INVOICE")}
				</button>
			</div>
		);
	}
}

export { Invoices };
