import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import DropdownButton from "react-bootstrap/DropdownButton";
import I18n from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import API from "../../services/API/API";
import * as styles from "./index.module.scss";

function getDummyState() {
	return {
		rowData: [
			{
				id: "100",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "101",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "102",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "103",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "104",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			},
			{
				id: "105",
				date: "17 februari 2020",
				company: "Akzo",
				sum: "9.855, -",
				status: "open"
			}
		]
	};
}
class Invoices extends Component {
	constructor(props) {
		super(props);
		this.PAGE = "INVOICES";
		this.state = {};
		this.emptyRowData = {
			id: "",
			date: "",
			client: "",
			sum: "",
			status: ""
		};
		this.handleNewInvoice = this.handleNewInvoice.bind(this);
		// retrieve data to show in table view

		this.state = { ...getDummyState() }; //API.getPage(this.PAGE);
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

class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = { ...getDummyState() }; //API.getPage(this.PAGE);
	}

	render() {
		return (
			<React.Fragment>
				<div className='row'>
					<div className='col'>
						<div>
							<label htmlFor='date' className='mb-2'>
								{I18n.get("INVOICE.INPUT_INVOICE_DATE")}
							</label>
							<input type='date' className={styles.inputDate} id='date' />
						</div>
					</div>

					<div className='col'>
						<div>
							<label htmlFor='companies'>{I18n.get("INVOICE.INPUT_COMPANY")}</label>
							<select
								id='companies'
								className={styles.selectCompanies}
								title={I18n.get("INVOICE.INPUT_COMPANY")}>
								{this.state.rowData.map((row, index) => (
									<option key={index} value={row.company}>
										{row.company}
									</option>
								))}
							</select>
							<button className='btn btn-primary slateGrey mx-3'>
								{I18n.get("INVOICE.BUTTONS.NEW_COMPANY")}
							</button>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col'>
						<label htmlFor='invoice-period'>{I18n.get("INVOICE.INPUT_PERIOD")}</label>
						<div className='displayFlex mt-2' id='invoice-period'>
							<div className='mr-3'>
								<label htmlFor='invoice-period-from' className='mb-1'>
									{I18n.get("INVOICE.INPUT_PERIOD_FROM")}
								</label>
								<input type='date' name='invoice-period-from' id='invoice-period-from'></input>
							</div>
							<div className='ml-3'>
								<label htmlFor='invoice-period-to' className='mb-1'>
									{I18n.get("INVOICE.INPUT_PERIOD_TO")}
								</label>
								<input type='date' name='invoice-period-to' id='invoice-period-to'></input>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col'>
						<label htmlFor='description'>{I18n.get("INVOICE.INPUT_SERVICES")}</label>
						<textarea name='description' id='description' rows='10' className='mt-3'></textarea>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export { Invoices, Invoice };
