import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "../Shared/Button/button";
import { Utils } from "../../services/Utils";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./companies.module.scss";

class Companies extends React.Component {
	constructor(props) {
		super(props);
		this.state = { rowData: [] };
		this.Utils = new Utils();
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
			formatter: () => (
				<span className={styles.actionIcons}>
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
					hover
					rowEvents={{ onClick: this.onRowClick }}
					pagination={paginationFactory(this.paginationConfig)}></BootstrapTable>

				<Button
					onClick={this.handleNewCompany}
					text={this.I18n.get("BUTTON.NEW")}
					classes='btn btn-primary float-right'
				/>
			</div>
		);
	}
}

export default withFirebase(Companies);
