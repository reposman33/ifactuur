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
import styles from "./../Shared/styles/react-bootstrap-table.module.scss";

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
		{ dataField: "invoiceNr", text: "#", headerStyle: { width: "8%" }, sort: true },
		{
			dataField: "dateTimeCreated",
			formatter: (cell, row, rowIndex) => this.Utils.dateFormat.format(row.dateTimeCreated),
			text: this.I18n.get("INVOICES.TABLE.HEADERS.DATE"),
			sort: true,
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
			formatter: (cell, row, rowIndex) => (
				<span className={styles.actionIcons}>
					<FontAwesomeIcon icon='print' onClick={(e) => this.handlePrint(e, cell, row, rowIndex)} />
					<FontAwesomeIcon icon='edit' onClick={(e) => this.handleEdit(e, cell, row, rowIndex)} />
				</span>
			),
			headerStyle: { width: "10%" },
		},
	];

	/**
	 * ReactBootstrapTable2 Table configuration
	 */
	table = {
		defaultSorted: [
			{
				dataField: "dateTimeCreated",
				order: "asc",
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
				.getDocumentFromCollectionByField("invoices", "invoiceNr", this.state.invoiceNr)
				.then((invoice) =>
					this.props.firebase
						.getDocumentFromCollectionByField("companies", "name", invoice.companyName)
						.then((company) =>
							this.props.firebase.getUserSettings().then((userSettings) =>
								this.props.firebase
									.getDocumentFromCollectionByField("companies", "id", userSettings.companyId)
									.then((usersCompany) =>
										this.setState({
											// prevent this to run for the same invoiceNr
											prevInvoiceNr: this.state.invoiceNr,
											invoice: invoice,
											company: company,
											userSettings: userSettings,
											usersCompany: usersCompany,
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
						content={
							<InvoicePrint
								Utils={this.Utils}
								invoiceNr={this.state.invoiceNr}
								invoice={this.state.invoice}
								company={this.state.company}
								userSettings={this.state.userSettings}
								usersCompany={this.state.usersCompany}
							/>
						}
						printButton={<Button text='Print factuur' onClick={this.hideModal} />}
						show={this.state.modal}
					/>
				)}
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
					extraClasses='float-right mr-3'
					onClick={this.handleNewInvoice}
					text={this.I18n.get("INVOICES.BUTTON.NEW")}
				/>
			</>
		);
	}
}

export default withFirebase(Invoices);
