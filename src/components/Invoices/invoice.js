import React from "react";
import { I18n } from "../../services/I18n/I18n";
import * as ROUTES from "../../constants/routes";

import { withFirebase } from "../../Firebase";
import { withAuthentication } from "../Session";

import * as styles from "./invoice.module.scss";

class Invoice extends React.Component {
	constructor(props) {
		super(props);
		// these fields contain the data and transform functions for data to be stored
		this.persistFields = {
			VatRate: parseInt,
			companyName: (fieldValue) => fieldValue, // return value as is
			dateTimeCreated: (date) => new Date(date),
			periodFrom: (date) => (date ? new Date(date) : undefined),
			periodTo: (date) => (date ? new Date(date) : undefined),
			invoiceNr: parseInt,
			rows: (fieldValue) => fieldValue,
			statusTitle: () => "created",
			type: (fieldValue) => fieldValue,
		};

		// initialize state
		this.state = {
			companies: [],
			companyName: "",
			dateTimeCreated: new Date().toISOString().split("T")[0],
			dateTimePaid: undefined,
			dateTimePrinted: undefined,
			dateTimeSent: undefined,
			id: undefined,
			invoiceNr: undefined,
			notes: "",
			periodFrom: undefined,
			periodTo: undefined,
			rows: [],
			statusTitle: "",
			type: "debet",
			totals: {},
			VatRate: undefined,
			VatRates: [],
		};

		this.newInvoicePromises = [];
		this.isExistingInvoice = !!this.props.location.state && this.props.location.state.id;
		// retrieve invoice from db
		this.invoice$ = this.isExistingInvoice
			? this.props.firebase.getInvoice(this.props.location.state.id)
			: undefined;
		// new invoice!
		if (!this.isExistingInvoice) {
			// retrieve last invoiceNr
			this.newInvoicePromises.push(this.props.firebase.getLastInvoicenr());
			// retrieve companies
			this.newInvoicePromises.push(this.props.firebase.getCompanies());
			// retrieve VatRates
			this.newInvoicePromises.push(this.props.firebase.getVatRates());
		}
		this.I18n = new I18n();
		this.currencyFormat = new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		});
		this.dateTimeFormat = new Intl.DateTimeFormat(this.I18n.getLocale(), {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		this.nrOfDescriptionRows = 10;

		this.FIELDNAMES = {
			DATE: "dateTimeCreated",
			PERIOD_FROM: "periodFrom",
			PERIOD_TO: "periodTo",
			COMPANIES: "companies",
			COMPANYNAME: "companyName",
			DESCRIPTION: "omschrijving",
			HOURLYRATE: "uurtarief",
			HOURS: "uren",
			TAX: "tax",
			VATRATE: "VatRate",
		};
		// bind it or 'this' scope in function is undefined...
		this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
	}

	componentDidMount() {
		if (this.invoice$) {
			this.invoice$.then((invoice) => {
				// update state with retrieved invoice
				this.setState({
					companies: [],
					companyName: invoice.companyName,
					// only format dates if not undefined
					dateTimeCreated: invoice.dateTimeCreated
						? this.dateTimeFormat.format(invoice.dateTimeCreated)
						: invoice.dateTimeCreated,
					dateTimePaid: invoice.dateTimePaid
						? this.dateTimeFormat.format(invoice.dateTimePaid)
						: invoice.dateTimePaid,
					dateTimePrinted: invoice.dateTimePrinted
						? this.dateTimeFormat.format(invoice.dateTimePrinted)
						: invoice.dateTimePrinted,
					dateTimeSent: invoice.dateTimeSent
						? this.dateTimeFormat.format(invoice.dateTimeSent)
						: invoice.dateTimeSent,
					id: invoice.id,
					invoiceNr: invoice.invoiceNr,
					rows: invoice.rows,
					notes: invoice.notes,
					periodFrom: invoice.periodFrom
						? this.dateTimeFormat.format(invoice.periodFrom)
						: invoice.periodFrom,
					periodTo: invoice.periodTo ? this.dateTimeFormat.format(invoice.periodTo) : invoice.periodTo,
					statusTitle: invoice.statusTitle,
					type: invoice.type,
					totals: this.getTotalInvoiceAmount(invoice.rows, invoice.VATRate),
					VatRate: invoice.VATRate,
					VatRates: [],
				});
			});
		} else {
			// retrieve last invoiceNr,companies and VatRates
			const companies = [];
			const VatRates = [];
			Promise.all(this.newInvoicePromises).then((values) => {
				// retrieve last invoice number
				values[0].forEach((doc) => this.setState({ invoiceNr: doc.data().invoiceNr + 1 }));
				// retrieve all companies and update state
				values[1].forEach((doc) => companies.push(doc.data()));
				// retrieve all VatRates and update state
				values[2].forEach((doc) => VatRates.push(doc.data()));
				this.setState({ companies: companies, VatRates: VatRates });
			});
		}
	}

	/**
	 * handle input of most input fields
	 */
	onChange = (event) => {
		let { name, value } = event.target;
		this.setState((state, props) => {
			return { [name]: value };
		});
	};

	/**
	 * when selecting a VatRate also calculate totals
	 */
	onVatRateChange = (event) => {
		const value = event.target.value;
		// update state.VatRate
		this.onChange(event);
		this.setState((state, props) => {
			return { totals: this.getTotalInvoiceAmount(this.state.rows, value) };
		});
	};

	/**
	 * handle input in fields 'description', 'hourlyRrate' or 'hours'
	 */
	handleDescriptionInput(event) {
		// let { name, value } = { name: "description", value: "direct ly set value" };
		let { name, value } = event.target;
		if (!!!value) {
			return;
		}

		// IF input is from one of the descriptionrows...
		// ...get index nr...
		const rowIndex = parseInt(name.substr(name.indexOf("_") + 1, 1));
		// ...get property name...
		const strippedFieldName = name.substr(0, name.indexOf("_"));
		// ... we're going to mutate so clone...
		const rows = [...this.state.rows];
		// ...parse stringified nrs to numbers
		const val = isNaN(parseInt(value)) ? value : parseInt(value);

		// prevent gaps in the rows array when user allows for empty lines
		if (rowIndex > rows.length) {
			for (let i = rowIndex; i > rows.length; i--) {
				rows.push({ omschrijving: "", uurtaried: undefined, uren: undefined });
			}
		}
		// Check: object @ index exists? add key-value to existing object : add new object to array
		rows[rowIndex] = rows[rowIndex]
			? Object.assign(rows[rowIndex], { [strippedFieldName]: val })
			: { [strippedFieldName]: val };
		//store stuff
		this.setState({
			rows: rows,
			totals: this.getTotalInvoiceAmount(rows, this.state.VatRate),
		});
	}

	/**
	 * calculate amounts for totalBeforeVat, totalVatAmount and totalWithVat from the description array
	 * @param {string} invoiceData - stringified object array 1 object containing description, hourlyRate and hours for at least the first row
	 * @returns {object} with amounts calculated
	 */
	getTotalInvoiceAmount(rows, VatRate) {
		if (!rows) {
			return;
		}
		const _VatRate = parseInt(VatRate);
		const total = rows.reduce((total, row) => {
			// watch out - user can inintially skip 1st line and start typing in lower lines to later add data in 1st line
			total = row && row.uren && row.uurtarief ? total + parseFloat(row.uren) * parseFloat(row.uurtarief) : total;
			return total;
		}, 0);
		const totalVatAmount = total * (_VatRate / 100);
		return {
			totalBeforeVat: !!total ? total : "",
			totalVatAmount: !!totalVatAmount ? totalVatAmount : false,
			totalWithVat: !!totalVatAmount ? total + totalVatAmount : false,
		};
	}

	// formatNumberAsCurrency
	formatNumberAsCurrency = (number) => {
		return new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		}).format(number);
	};

	// onListview
	onListview = () =>
		this.props.history.push({
			pathname: ROUTES.INVOICES,
		});

	// onSubmit
	onSubmit = () => {
		const invoice = {};
		// The keys to be stored and their conversion function are defined in persistFields. Apply here
		Object.keys(this.persistFields).map(
			// filter keys and optionally convert state prop values
			(key) => {
				if (this.state[key]) {
					invoice[key] = this.persistFields[key](this.state[key]);
				}
				return null;
			}
		);

		this.props.firebase.saveInvoice(invoice).then((docRef) => console.log("document added"));
	};

	render() {
		if (!this.state.rows) {
			return;
		}
		const descriptionRows = [];
		for (let row = 0; row < this.nrOfDescriptionRows; row++) {
			descriptionRows.push(
				<div key={row} className={styles.descriptionRow}>
					<input
						type='text'
						name={`${this.FIELDNAMES.DESCRIPTION}_${row}`}
						className={styles.description}
						onChange={this.handleDescriptionInput}
						disabled={this.isExistingInvoice}
						// only retrieve existing row values from the state
						value={row <= this.state.rows.length - 1 ? this.state.rows[row]["omschrijving"] : ""}
					/>
					<span className={styles.currency}>&euro;</span>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className={styles.hourlyrateInt}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						value={row <= this.state.rows.length - 1 ? this.state.rows[row]["uurtarief"] : ""}
					/>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className={styles.hours}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						value={row <= this.state.rows.length - 1 ? this.state.rows[row]["uren"] : ""}
					/>
					<span className={styles.total}>
						{this.state.rows[row] &&
						this.state.rows[row].uurtarief &&
						this.state.rows[row] &&
						this.state.rows[row].uren
							? this.currencyFormat.format(this.state.rows[row].uurtarief * this.state.rows[row].uren)
							: ""}
					</span>
				</div>
			);
		}
		if (this.isExistingInvoice && !this.state.id) {
			return null;
		}
		return (
			<React.Fragment>
				<div className='row'>
					<div className='col'>
						<div>
							<label htmlFor='date' className='mb-2'>
								{this.I18n.get("INVOICE.LABEL_INVOICE_DATE")}
							</label>
							{this.isExistingInvoice ? (
								<span>{this.state.dateTimeCreated}</span>
							) : (
								<input
									type='date'
									value={this.state.dateTimeCreated} // default value is today
									className={styles.inputDate}
									name={this.FIELDNAMES.DATE}
									onChange={this.onChange}
								/>
							)}
						</div>
					</div>

					<div className='col'>
						<div>
							<label htmlFor='companies'>{this.I18n.get("INVOICE.LABEL_COMPANY")}</label>
							{this.isExistingInvoice ? (
								<span> {this.state.companyName}</span>
							) : (
								<React.Fragment>
									<select
										name={this.FIELDNAMES.COMPANYNAME}
										className={styles.selectCompanies}
										onChange={this.onChange}>
										<option value=''>{this.I18n.get("INVOICE.INPUT_COMPANY")}</option>
										{this.state.companies.map((company) => (
											<option key={company.id} value={company.name}>
												{company.name}
											</option>
										))}
									</select>
									<button className='btn btn-primary slateGrey mx-3'>
										{this.I18n.get("INVOICE.BUTTONS.NEW_COMPANY")}
									</button>
								</React.Fragment>
							)}
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label htmlFor='invoice-period'>{this.I18n.get("INVOICE.LABEL_PERIOD")}</label>
						<div className='d-flex justify-content-between mt-2' id='invoice-period'>
							<div className={styles.periodBlock}>
								<div className='mr-3'>
									<label className='mb-1'>{this.I18n.get("INVOICE.LABEL_PERIOD_FROM")}</label>
									{this.isExistingInvoice ? (
										this.state.periodFrom ? (
											this.state.periodFrom
										) : (
											"--"
										)
									) : (
										<input
											type='date'
											name={this.FIELDNAMES.PERIOD_FROM}
											onChange={this.onChange}></input>
									)}
								</div>
								<div className='ml-3'>
									<label className='mb-1'>{this.I18n.get("INVOICE.LABEL_PERIOD_TO")}</label>
									{this.isExistingInvoice ? (
										this.state.periodTo ? (
											this.state.periodTo
										) : (
											"--"
										)
									) : (
										<input
											type='date'
											name={this.FIELDNAMES.PERIOD_TO}
											onChange={this.onChange}></input>
									)}
								</div>
							</div>
							<div className='ml-3'>
								<label className='mb-1'>Factuur type</label>
								{this.isExistingInvoice ? (
									this.state.type
								) : (
									<select name='type' value={this.state.type} onChange={this.onChange}>
										<option value='debet'>debet</option>
										<option value='credit'>credit</option>
									</select>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER_SERVICES")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER_RATE")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER_HOURS")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER_TOTAL")}
						</label>

						{descriptionRows}

						<div className={styles.totals}>
							<label>{this.I18n.get("INVOICE.LABEL_SUBTOTAL")}</label>
							<span className={styles.totalBeforeVat}>
								{this.state.totals.totalBeforeVat &&
									this.formatNumberAsCurrency(this.state.totals.totalBeforeVat)}
							</span>
						</div>

						{!this.isExistingInvoice ? (
							<div className={styles.totals}>
								<div className={styles.VatRatesDropdown}>
									<label>{this.I18n.get("INVOICE.INPUT_VATRATE")}:</label>
									<select name={this.FIELDNAMES.VATRATE} onChange={this.onVatRateChange}>
										{this.state.VatRates.map((rate) => (
											<option key={rate.id} value={rate.rate}>
												{rate.rate}
											</option>
										))}
									</select>
								</div>
								<span className={styles.VatRate}>
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
								</span>
							</div>
						) : (
							<div className={styles.totals}>
								<label>{this.I18n.get("INVOICE.LABEL_VATRATE")}:</label>
								<span>{this.state.VatRate} % </span>
								<span className={styles.VatRate}>
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
								</span>
							</div>
						)}
						<div className={styles.totals}>
							<label>{this.I18n.get("INVOICE.LABEL_TOTAL")}</label>

							<span className={styles.totalWithVat}>
								{!!this.state.totals.totalVatAmount &&
									this.formatNumberAsCurrency(this.state.totals.totalWithVat)}
							</span>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className={styles.inputRow}></div>
						<button className='btn btn-primary float-left' onClick={this.onListview}>
							{this.I18n.get("BUTTONS.OVERVIEW")}
						</button>
						<button
							className='btn btn-primary float-right'
							disabled={this.isExistingInvoice}
							onClick={this.onSubmit}>
							{this.I18n.get("BUTTONS.SAVE")}
						</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withAuthentication(withFirebase(Invoice));
