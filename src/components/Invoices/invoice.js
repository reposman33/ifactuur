import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { withFirebase } from "../../Firebase";
import * as styles from "./invoice.module.scss";
import { withAuthentication } from "../Session";

class Invoice extends React.Component {
	constructor(props) {
		super(props);
		// these fields contain the data and transform functions for data to be stored
		this.persistFields = {
			VatRate: parseInt,
			companyName: null,
			dateTimeCreated: (date) => new Date(date),
			dateTimePaid: (date) => new Date(date),
			dateTimePrinted: (date) => new Date(date),
			dateTimeSent: (date) => new Date(date),
			invoiceNr: parseInt, // <=== Genereren!
			notes: null,
			rows: null,
			statusTitle: null, // <=== verstuurd betaald etc
			type: parseInt, // <=== debet /credit nog niet geimp;ementeerd
		};

		// initialize state
		this.state = {
			companies: [],
			companyName: "",
			dateTimeCreated: undefined,
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
			type: "",
			totals: {},
			VatRate: undefined,
			VatRates: [],
		};

		this.newInvoicePromises = [];
		this.isExistingInvoice = !!this.props.location.state && this.props.location.state.id;
		// display VATRate with this id by default in select
		this.defaultSelectedVatRate = 3;
		// retrieve invoice from db
		this.invoice$ = this.isExistingInvoice
			? this.props.firebase.getInvoice(this.props.location.state.id)
			: undefined;
		// new invoice!
		if (!this.isExistingInvoice) {
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
	}

	componentDidMount() {
		if (this.invoice$) {
			this.invoice$.then((invoice) => {
				// update state with retrieved invoice
				this.setState({
					companies: [],
					companyName: invoice.companyName,
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
					totals: this.getTotalInvoiceAmount(invoice.rows),
					VatRate: invoice.VATRate,
					VatRates: [],
				});
			});
		} else {
			// initialize state to undefined
			// retrieve companies, VatRates
			// Promise.all() resolves the provided array of promises. Values are in array order: Companies and VatRates
			Promise.all(this.newInvoicePromises).then((values) => {
				// retrieve all companies and update state
				values[0].forEach((doc) => this.setState({ companies: [...this.state.companies, doc.data()] }));
				// retrieve all VatRates and update state
				values[1].forEach((doc) => this.setState({ VatRates: [...this.state.VatRates, doc.data()] }));
			});
		}
	}

	/**
	 * handle input in input fields
	 */
	onChange = (event) => {
		let { name, value } = event.target;
		this.setState((state, props) => {
			return { [name]: value };
		});
	};

	/**
	 * when selecting a VatRate from the select
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
	 * handle input in description, hourly rate or hours worked
	 */
	handleDescriptionInput = (event) => {
		let { name, value } = event.target;
		if (!!!value) {
			return;
		}
		let _rows = this.state.rows;
		// IF input is from one of the descriptionrows...
		if (
			name.startsWith(this.FIELDNAMES.DESCRIPTION) ||
			name.startsWith(this.FIELDNAMES.HOURLYRATE) ||
			name.startsWith(this.FIELDNAMES.HOURS)
		) {
			// ...get index nr...
			const rowIndex = parseInt(name.substr(name.indexOf("_") + 1, 1));
			// ...get property name...
			const strippedFieldName = name.substr(0, name.indexOf("_"));
			// ... we're going to mutate
			_rows = [...this.state.rows];
			// catch usecase where user skips data in 1st line
			_rows[rowIndex] = _rows[rowIndex] ? _rows[rowIndex] : {};
			_rows[rowIndex] =
				_rows.length >= rowIndex + 1
					? Object.defineProperty(_rows[rowIndex], strippedFieldName, { value: value, writable: true })
					: { [strippedFieldName]: value };
		}
		this.setState((state, props) => {
			return { rows: _rows, totals: this.getTotalInvoiceAmount(_rows, this.state.VatRate) };
		});
	};

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

	formatNumberAsCurrency = (number) => {
		return new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		}).format(number);
	};

	onSubmit = () => {
		const storageData = {};
		Object.keys(this.persistFields).map(
			// filter keys and optionally convert state prop values
			(key) =>
				(storageData[key] = this.persistFields[key]
					? this.persistFields[key](this.state[key]) // convert...
					: this.state[key]) // store as is (string)
		);
		this.props.firebase
			.saveInvoice(storageData)
			.then((docRef) => console.log("document with ref ", docRef, " added"));
	};

	render() {
		const descriptionRows = [];
		for (let row = 0; row < this.nrOfDescriptionRows; row++) {
			descriptionRows.push(
				<div key={row} className={styles.descriptionRow}>
					<input
						type='text'
						name={`${this.FIELDNAMES.DESCRIPTION}_${row}`}
						className={styles.description}
						onBlur={this.handleDescriptionInput}
						disabled={this.isExistingInvoice}
						defaultValue={this.state.rows[row] ? this.state.rows[row][this.FIELDNAMES.DESCRIPTION] : ""}
					/>
					<span className={styles.currency}>&euro;</span>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className={styles.hourlyrateInt}
						disabled={this.isExistingInvoice}
						onBlur={this.handleDescriptionInput}
						defaultValue={this.state.rows[row] ? this.state.rows[row][this.FIELDNAMES.HOURLYRATE] : ""}
					/>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className={styles.hours}
						disabled={this.isExistingInvoice}
						onBlur={this.handleDescriptionInput}
						defaultValue={this.state.rows[row] ? this.state.rows[row][this.FIELDNAMES.HOURS] : ""}
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
										title={this.I18n.get("INVOICE.INPUT_COMPANY")}
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
								{this.state.type ? (
									this.state.type
								) : (
									<select name='type' onChange={this.onChange}>
										<option value=''>...</option>
										<option value='credit'>credit</option>
										<option value='debet'>debet</option>
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
						<label className={styles.descriptionRowLabel}>{this.I18n.get("INVOICE.TOTAL")}</label>
						{descriptionRows}
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className={styles.vatRatesRow}>
							<label>
								{" "}
								<span>{this.I18n.get("INVOICE.LABEL_VATRATE")}:</span>
							</label>
							{!this.isExistingInvoice ? (
								<React.Fragment>
									<span>{this.I18n.get("INVOICE.INPUT_VATRATE")}:</span>
									<select
										className={styles.VatRates}
										name={this.FIELDNAMES.VATRATE}
										onChange={this.onVatRateChange}>
										<option value=''>...</option>
										{this.state.VatRates.map((rate) => (
											<option key={rate.id} value={rate.rate}>
												{rate.rate}
											</option>
										))}
									</select>
								</React.Fragment>
							) : (
								<label>{this.state.VatRate} &nbsp;%</label>
							)}
						</div>
						<div className={styles.inputRow}>
							<div className={styles.totals}>
								<span>{this.I18n.get("INVOICE.TOTAL")}</span>
								<span className={styles.totalBeforeVat}>
									{this.state.totals.totalBeforeVat &&
										this.formatNumberAsCurrency(this.state.totals.totalBeforeVat)}
								</span>
								<span className={styles.VatRate}>
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
								</span>
								{!!this.state.totals.totalVatAmount && <span>&plus;</span>}
								<span className={styles.totalWithVat}>
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalWithVat)}
								</span>
							</div>
						</div>
						<button
							className='btn btn-primary float-right'
							disabled={this.isExistingInvoice}
							onClick={this.onSubmit}>
							Save
						</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withAuthentication(withFirebase(Invoice));
