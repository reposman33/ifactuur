import React from "react";
import { I18n } from "../../services/I18n/I18n";
import BootstrapTable from "react-bootstrap-table-next";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { DateComponent } from "../Shared/Date/date";
import { Button } from "../Shared/Button/button";
import * as styles from "./stats.module.scss";

class Stats extends React.Component {
	constructor(props) {
		super(props);
		this.state = { dateFrom: undefined, dateTo: undefined };
		this.I18n = new I18n();
	}

	onChange = (name, value) => {
		this.setState({ [name]: value });
	};

	getColumns = () => [];

	onCalculateTurnover = () => {
		this.props.firebase
			.getInvoicesInPeriod(this.state.dateFrom, this.state.dateTo)
			.then((res) => console.log("InvoicesInPeriod = ", res));

		this.props.firebase
			.getExpensesInPeriod(this.state.dateFrom, this.state.dateTo)
			.then((res) => console.log("ExpensesInPeriod = ", res));
	};

	table = {
		defaultSorted: [
			{
				dataField: "name",
				order: "asc",
			},
		],
		defaultSortDirection: "desc",
	};

	render() {
		return (
			<>
				<div className='row'>
					<div className='col d-flex flex-row'>
						<DateComponent
							container={false}
							displayInput={true}
							extraClasses='mx-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("STATS.LABELS.DATE.FROM")}
							name='dateFrom'
						/>
						<DateComponent
							container={false}
							displayInput={true}
							extraClasses='mx-3'
							handleOnChange={this.onChange}
							labelText={this.I18n.get("STATS.LABELS.DATE.TO")}
							name='dateTo'
						/>
						<div className='d-flex justify-content-end align-items-end'>
							<Button
								onClick={this.onCalculateTurnover}
								text={this.I18n.get("STATS.BUTTONS.CALCULATE")}
								extraClasses='mr-3'
							/>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						{/* <BootstrapTable
							bootstrap4
							data={this.state.rowData}
							classes={styles.table}
							columns={this.getColumns()}
							table={this.table}
							keyField='ID'
							bordered
							hover
							rowEvents={{ onClick: this.onRowClick }}></BootstrapTable> */}
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						{/* <BootstrapTable
							bootstrap4
							data={this.state.rowData}
							classes={styles.table}
							columns={this.getColumns()}
							table={this.table}
							keyField='ID'
							bordered
							hover
							rowEvents={{ onClick: this.onRowClick }}></BootstrapTable> */}
					</div>
				</div>
			</>
		);
	}
}

export default withFirebase(Stats);
