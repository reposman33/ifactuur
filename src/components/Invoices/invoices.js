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
import { InvoicePrint } from "../InvoicePrint/invoicePrint";
import { ModalComponent } from "../Shared/Modal/Modal";
import ReactBootstrapTableStyles from "./../Shared/styles/react-bootstrap-table.module.scss";
import componentStyles from "./invoices.module.scss";

class Invoices extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rowData: [], showModal: false };
		this.Utils = new Utils();
	}

	I18n = new I18n();

	/**
	 *  ReactBootstrapTable2 Columns configuration
	 */
	getColumns = () => [
		{ dataField: "invoiceNr", text: "id", headerStyle: { width: "8%" }, sort: true },
		{
			dataField: "dateTimeCreated",
			formatter: (cell, row, rowIndex) => this.Utils.dateFormat.format(row.dateTimeCreated),
			sort: true,
			text: this.I18n.get("INVOICES.TABLE.HEADERS.DATE"),
		},
		{
			dataField: "companyName",
			formatter: (cell, row, rowIndex) => <span className={componentStyles.textOverflow}>{cell}</span>,
			sort: true,
			text: this.I18n.get("INVOICES.TABLE.HEADERS.CLIENT"),
		},
		{
			dataField: "type",
			headerStyle: { width: "10%" },
			text: this.I18n.get("INVOICES.TABLE.HEADERS.TYPE"),
		},
		{
			dataField: "statustitle",
			headerStyle: { width: "10%" },
			text: this.I18n.get("INVOICES.TABLE.HEADERS.STATUS"),
		},
		{
			dataField: "actions",
			formatter: (cell, row, rowIndex) => (
				<span className={ReactBootstrapTableStyles.actionIcons}>
					<FontAwesomeIcon icon='print' onClick={(e) => this.handlePrint(e, cell, row, rowIndex)} />
					<FontAwesomeIcon icon='edit' onClick={(e) => this.handleEdit(e, cell, row, rowIndex)} />
				</span>
			),
			headerStyle: { width: "10%" },
			isDummyField: true,
			text: this.I18n.get("INVOICES.TABLE.HEADERS.ACTIONS"),
		},
	];

	/**
	 * ReactBootstrapTable2 Table configuration
	 */
	table = {
		defaultSorted: [
			{
				dataField: "invoiceNr",
				order: "desc",
			},
		],
		defaultSortDirection: "desc",
	};

	/**
	 * ReactBootstrapTable2 Pagination configuration
	 */
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
		this.props.firebase
			.getCollection("invoices", "dateTimeCreated", [
				"invoiceNr",
				"dateTimeCreated",
				"companyName",
				"type",
				"statustitle",
			])
			.then((res) => this.setState({ rowData: res }));
	}

	componentDidUpdate(prevProps) {
		// componentDidUpdate is triggred at every update. Only allow this to run when a new invoice print button is clicked by comparing the current invoiceNr with the last invoiceNr
		if (this.state.invoiceNr !== this.state.prevInvoiceNr) {
			this.props.firebase
				// get the invoice to print...
				.getDocumentFromCollectionByField("invoices", "invoiceNr", this.state.invoiceNr)
				.then((invoice) =>
					this.props.firebase
						// ...then get the company that's being charged...
						.getDocumentFromCollectionByField("companies", "name", invoice.companyName)
						.then((company) =>
							// ...get the user's settings---
							this.props.firebase.getUserSettings().then((userSettings) =>
								this.props.firebase
									// ...finally get the user's company
									.getDocumentFromCollectionByField("companies", "name", userSettings.companyName)
									.then((userCompany) =>
										this.setState({
											// prevent this to run for the same invoiceNr
											prevInvoiceNr: this.state.invoiceNr,
											invoice: invoice,
											company: company,
											userSettings: userSettings,
											userCompany: userCompany,
										})
									)
							)
						)
				);
		}
	}
	/**
	 * call when New button is clicked
	 */
	handleNewInvoice = () => {
		this.props.history.push(ROUTES.INVOICE);
	};

	/**
	 *  call when row is clicked
	 */
	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({
			pathname: ROUTES.INVOICE,
			state: { id: row.ID },
		});
	};

	/**
	 * call when editIcon is clicked
	 */
	handleEdit = (e, cell, row, rowIndex) => {
		e.stopPropagation();
		this.props.history.push({
			pathname: ROUTES.INVOICE,
			state: { id: row.ID },
		});
	};

	/**
	 * call when printIcon is clicked
	 */
	handlePrint = (e, cell, row, rowIndex) => {
		e.stopPropagation();
		this.setState({ modal: true, invoiceNr: row.invoiceNr });
	};

	/**
	 *  hide the modal
	 */
	hideModal = () => this.setState({ modal: false });

	render() {
		return (
			<>
				{this.state.invoice && (
					<ModalComponent
						closeModal={this.hideModal}
						body={
							<InvoicePrint
								company={this.state.company}
								invoiceNr={this.state.invoiceNr}
								invoice={this.state.invoice}
								userSettings={this.state.userSettings}
								userCompany={this.state.userCompany}
							/>
						}
						showModal={this.state.modal}
					/>
				)}
				<BootstrapTable
					bootstrap4
					classes={ReactBootstrapTableStyles.ReactBootstrapTable}
					columns={this.getColumns()}
					data={this.state.rowData}
					keyField='ID'
					pagination={paginationFactory(this.paginationConfig)}
					rowEvents={{ onClick: this.onRowClick }}
					table={this.table}></BootstrapTable>
				<Button
					extraClasses='float-right mr-3'
					onClick={this.handleNewInvoice}
					text={this.I18n.get("INVOICES.BUTTON.NEW")}
				/>
			</>
		);
	}
}

export default withFirebase(Invoices);
