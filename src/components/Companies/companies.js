import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "../Shared/Button/button";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./../Shared/styles/react-bootstrap-table.module.scss";

class Companies extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rowData: [] };
		// make the async call to Firebase and pick it up in componentDidMount
		this.companiesPromise$ = this.props.firebase.getCollection("companies", "name", [
			"name",
			"city",
			"contact",
			"url",
			"address",
		]);
	}

	I18n = new I18n();

	getColumns = () => [
		{
			dataField: "name",
			text: this.I18n.get("COMPANIES.TABLE.HEADERS.NAME"),
			sort: true,
			headerStyle: { width: "20%" },
		},
		{
			dataField: "city",
			text: this.I18n.get("COMPANIES.TABLE.HEADERS.CITY"),
			sort: true,
			headerStyle: { width: "10%" },
			formatter: (cell, rowData) => <span title={rowData.address}>{cell}</span>,
		},
		{
			dataField: "contact",
			sort: true,
			text: this.I18n.get("COMPANIES.TABLE.HEADERS.CONTACT"),
			headerStyle: { width: "10%" },
		},
		{
			dataField: "actions",
			text: this.I18n.get("COMPANIES.TABLE.HEADERS.ACTIONS"),
			isDummyField: true,
			formatExtraData: this.deleteDocument,
			formatter: (cell, rowData, rowIndex, deleteDocument) => (
				<span
					className={styles.actionIcons}
					onClick={(e) => {
						deleteDocument(rowData.ID);
						e.stopPropagation();
					}}>
					<FontAwesomeIcon icon={["fa", "trash-alt"]} />
				</span>
			),
			headerStyle: { width: "5%" },
		},
	];

	table = {
		defaultSorted: [
			{
				dataField: "name",
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
		this.companiesPromise$.then((res) => this.setState({ rowData: res }));
	}

	handleNewCompany = () => {
		this.props.history.push(ROUTES.COMPANY);
	};

	onRowClick = (e, row, rowIndex) => {
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			state: { id: row.ID },
		});
	};

	deleteDocument = (ID) => {
		if (window.confirm(this.I18n.get("COMPANY.PROMPT.DELETE"))) {
			// delete company from fireStore
			this.props.firebase.deleteDocument("companies", ID);
			//remove from listView
			this.setState({ rowData: this.state.rowData.filter((row) => row.ID !== ID) });
		}
	};

	render() {
		return (
			<div>
				<BootstrapTable
					bootstrap4
					data={this.state.rowData}
					classes={styles.ReactBootstrapTable}
					columns={this.getColumns()}
					table={this.table}
					keyField='ID'
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>

				<div className='d-flex justify-content-end'>
					<Button onClick={this.handleNewCompany} text={this.I18n.get("BUTTON.NEW")} extraClasses='mr-3' />
				</div>
			</div>
		);
	}
}

export default withFirebase(Companies);
