import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Languages from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import API from "../../services/API/API";
import * as styles from "./index.module.scss";

class Invoices extends Component {
	constructor(props) {
		super(props);
		this.PAGE = "INVOICES";
		this.emptyRowData = {
			id: "",
			date: "",
			client: "",
			sum: "",
			status: ""
		};
		this.rowData = [
			{
				id: "100",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "101",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "102",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "103",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "104",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "105",
				date: "17 februari 2020",
				client: "Akzo",
				sum: "9.855, -",
				status: "open"
			}
		];
		this.handleNewInvoice = this.handleNewInvoice.bind(this);
		// this.rowData = API.getPage(this.PAGE);
	}

	handleNewInvoice() {
		this.props.history.push(ROUTES.INVOICE);
	}
	renderRows() {
		const rows = [];
		for (let i = 0; i < 10; i++) {
			const rowData = this.rowData.length > i ? this.rowData[i] : this.emptyRowData;
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
	}
	render() {
		return (
			<div>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th></th>
							<th>{Languages.get("INVOICES.TABLE.HEADER_DATE")}</th>
							<th>{Languages.get("INVOICES.TABLE.HEADER_CLIENT")}</th>
							<th>{Languages.get("INVOICES.TABLE.HEADER_SUM")}</th>
							<th>{Languages.get("INVOICES.TABLE.HEADER_STATUS")}</th>
							<th></th>
						</tr>
					</thead>
					<tbody>{this.renderRows()}</tbody>
				</Table>
				<button className='btn btn-primary float-right' onClick={this.handleNewInvoice}>
					{Languages.get("INVOICES.BUTTONS.NEW_INVOICE")}
				</button>
			</div>
		);
	}
}

class Invoice extends Component {
	render() {
		return <div>Invoice works!</div>;
	}
}

export { Invoices, Invoice };
