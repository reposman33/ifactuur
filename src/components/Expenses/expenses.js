import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./expenses.scss";

class Expenses extends React.Component {
	render() {
		return <div>Expenses work!</div>;
	}
}

export { Expenses };
