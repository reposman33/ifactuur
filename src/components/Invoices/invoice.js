import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { withFirebase } from "../../Firebase";
import * as styles from "./invoice.module.scss";

class Invoice extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			companies: [],
			companyName: "",
			dateTimeCreated: undefined,
			dateTimePaid: undefined,
			dateTimePrinted: undefined,
			dateTimeSent: undefined,
			id: undefined,
			invoiceNr: undefined,
			invoiceDescriptionRows: [],
			notes: "",
			periodFrom: undefined,
			periodTo: undefined,
			rows: [],
			statusTitle: "",
			type: "",
			totals: {},
			userId: "1",
			VatRate: undefined,
			VatRates: [],
		};
		this.newInvoicePromises = [];
		this.isExistingInvoice = !!this.props.location.state && this.props.location.state.id;
		this.defaultSelectedVatRate = 3;
		// new invoice?
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
			this.invoice$.then((doc) => {
				// update state with retrieved invoice
				const invoiceData = doc.data();
				this.setState({
					companies: [],
					companyName: invoiceData.companyName,
					dateTimeCreated: invoiceData.dateTimeCreated,
					dateTimePaid: invoiceData.dateTimePaid,
					dateTimePrinted: invoiceData.dateTimePrinted,
					dateTimeSent: invoiceData.dateTimeSent,
					id: parseInt(invoiceData.id),
					invoiceNr: parseInt(invoiceData.invoiceNr),
					invoiceDescriptionRows: JSON.parse(invoiceData.rows),
					notes: invoiceData.notes,
					periodFrom: invoiceData.periodFrom,
					periodTo: invoiceData.periodTo,
					rows: JSON.parse(invoiceData.rows),
					statusTitle: invoiceData.statusTitle,
					type: invoiceData.type,
					totals: this.getTotalInvoiceAmount(JSON.parse(invoiceData.rows)),
					userId: "1",
					VatRate: parseInt(invoiceData.VatRate),
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
		value =
			name === this.FIELDNAMES.HOURS || name === this.FIELDNAMES.HOURLYRATE || name === this.FIELDNAMES.TAX
				? value.replace(".", ",")
				: value;
		this.setState({ [name]: value });
	};

	/**
	 * when selecting a VatRate from the select
	 */
	onVatRateChange = (event) => {
		// update state.VatRate
		this.onChange(event);
		this.setState({ totals: this.getTotalInvoiceAmount(this.state.rows, event.target.value) });
	};

	/**
	 * handle input in description, hourly rate or hours worked
	 */
	handleDescriptionInput = (event) => {
		let { name, value } = event.target;
		let rows = this.state.rows;
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
			name = "rows";
			// ... we're going to mutate
			rows = [...this.state.rows];
			rows[rowIndex] = rows.length >= rowIndex + 1 ? rows[rowIndex] : {};
			rows[rowIndex][strippedFieldName] = value;
			value = rows;
		}
		this.getTotalInvoiceAmount(rows, this.state.VatRate);
		this.setState({ [name]: value, totals: this.getTotalInvoiceAmount(rows, this.state.VatRate) });
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
			total = row.uren && row.uurtarief ? total + parseFloat(row.uren) * parseInt(row.uurtarief) : total;
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
		console.log(this.state);
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
						defaultValue={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.DESCRIPTION]
								: ""
						}
					/>
					<span className={styles.currency}>&euro;</span>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className={styles.hourlyrateInt}
						disabled={this.isExistingInvoice}
						onBlur={this.handleDescriptionInput}
						defaultValue={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.HOURLYRATE]
								: ""
						}
					/>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className={styles.hours}
						disabled={this.isExistingInvoice}
						onBlur={this.handleDescriptionInput}
						defaultValue={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.HOURS]
								: ""
						}
					/>
					<span className={styles.total}>
						{this.state.invoiceDescriptionRows[row] &&
						this.state.invoiceDescriptionRows[row].uurtarief &&
						this.state.invoiceDescriptionRows[row] &&
						this.state.invoiceDescriptionRows[row].uren
							? this.currencyFormat.format(
									this.state.invoiceDescriptionRows[row].uurtarief *
										this.state.invoiceDescriptionRows[row].uren
							  )
							: ""}
					</span>
				</div>
			);
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
								<span>{this.dateTimeFormat.format(new Date(this.state.dateTimeCreated))}</span>
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
						<div className='displayFlex mt-2' id='invoice-period'>
							<div className='mr-3'>
								<label className='mb-1'>{this.I18n.get("INVOICE.LABEL_PERIOD_FROM")}</label>
								{this.isExistingInvoice ? (
									this.state.periodFrom ? (
										this.dateTimeFormat.format(new Date(this.state.periodFrom))
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
										this.dateTimeFormat.format(new Date(this.state.periodTo))
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
								<span>{this.I18n.get("INVOICE.INPUT_VATRATE")}:</span>
							</label>
							{!this.isExistingInvoice ? (
								<select
									className={styles.VatRates}
									name={this.FIELDNAMES.VATRATE}
									onChange={this.onVatRateChange}>
									<option value=''>{this.I18n.get("INVOICE.INPUT_VATRATE")}</option>
									{this.state.VatRates.map((rate) => (
										<option key={rate.id} value={rate.rate}>
											{rate.rate}
										</option>
									))}
								</select>
							) : (
								<label>{this.state.VatRate} &nbsp;%</label>
							)}
						</div>
						<div className={styles.inputRow}>
							<div className={styles.totals}>
								{this.I18n.get("INVOICE.TOTAL")}
								{this.state.totals.totalBeforeVat && (
									<span className={styles.totalBeforeVat}>
										{this.formatNumberAsCurrency(this.state.totals.totalBeforeVat)}
									</span>
								)}
								{!!this.state.totals.totalVatAmount && (
									<React.Fragment>
										<span className={styles.VatRate}>
											{this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
										</span>
										&#43;
										<span className={styles.totalWithVat}>
											{this.formatNumberAsCurrency(this.state.totals.totalWithVat)}
										</span>{" "}
									</React.Fragment>
								)}
							</div>
						</div>
						<button className='btn btn-primary float-right' onClick={this.onSubmit}>
							Save
						</button>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withFirebase(Invoice);
