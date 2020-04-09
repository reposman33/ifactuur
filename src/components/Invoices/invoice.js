import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { withFirebase } from "../../Firebase";
import "./index.scss";

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
			periodFrom: "",
			periodTo: "",
			rows: [],
			statusTitle: "",
			type: "",
			totals: [],
			totalInvoiceAmount: {},
			userId: "1",
			VatRate: undefined,
			VatRates: [],
		};
		this.newInvoicePromises = [];
		this.isExistingInvoice = !!this.props.location.state && this.props.location.state.id;

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
			PERIOD_FROM: "invoice-period-from",
			PERIOD_TO: "invoice-period-to",
			COMPANIES: "companies",
			DESCRIPTION: "omschrijving",
			HOURLYRATE: "uurtarief",
			HOURS: "uren",
			TAX: "tax",
		};
	}

	componentDidMount() {
		if (this.invoice$) {
			this.invoice$.then((doc) => {
				// update state with retrieved invoice
				const invoiceData = doc.data();
				this.setState({
					companies: [],
					companyName: invoiceData.VatRate,
					dateTimeCreated: invoiceData.dateTimeCreated,
					dateTimePaid: invoiceData.dateTimePaid,
					dateTimePrinted: invoiceData.dateTimePrinted,
					dateTimeSent: invoiceData.dateTimeSent,
					id: invoiceData,
					invoiceNr: invoiceData.invoiceNr,
					invoiceDescriptionRows: JSON.parse(invoiceData.rows),
					notes: invoiceData.notes,
					periodFrom: invoiceData.periodFrom,
					periodTo: invoiceData.periodTo,
					rows: JSON.parse(invoiceData.rows),
					statusTitle: invoiceData.statusTitle,
					type: invoiceData.type,
					totals: this.getTotalInvoiceAmount(JSON.parse(invoiceData.rows)),
					totalInvoiceAmount: this.getTotalInvoiceAmount(JSON.parse(doc.data().rows)),
					userId: "1",
					VatRate: invoiceData.VatRate,
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
				// retrieve all VatRates and update state=
				values[1].forEach((doc) => this.setState({ VatRates: [...this.state.VatRates, doc.data()] }));
			});
		}
	}

	/**
	 * calculate amounts for totalBeforeVat, totalVatAmount and totalWithVat from the description array
	 * @param {string} invoiceData - stringified object array 1 object containing description, hourlyRate and hours for at least the first row
	 * @returns object with amounts calculated
	 */
	getTotalInvoiceAmount(rows) {
		const total = rows.reduce((total, row) => {
			total = row.uren && row.uurtarief ? total + parseFloat(row.uren) * parseInt(row.uurtarief) : total;
			return total;
		}, 0);
		const totalVatAmount = total * (parseFloat(rows.VatRate) / 100);
		return {
			totalBeforeVat: total,
			totalVatAmount: totalVatAmount,
			totalWithVat: total + totalVatAmount,
		};
	}

	handleOnBlur = (event) => {
		let { name, value } = event.target;
		value =
			name === this.FIELDNAMES.HOURS || name === this.FIELDNAMES.HOURLYRATE || name === this.FIELDNAMES.TAX
				? value.replace(".", ",")
				: value;

		// IF input is from one of the descriptionrows...
		if (
			name === this.FIELDNAMES.DESCRIPTION ||
			name === this.FIELDNAMES.HOURLYRATE ||
			name === this.FIELDNAMES.HOURS
		) {
			// ...get index nr...
			const rowIndex = parseInt(name.substr(name.length - 1, 1));
			// ...get property name...
			const fieldName = name.substr(0, name.length - 1);
			name = "rows";
			// ... we're going to mutate
			const rows = [...this.state.rows];
			rows[rowIndex] = rows.length >= rowIndex + 1 ? rows[rowIndex] : {};
			rows[rowIndex][fieldName] = value;
			value = rows;
		}
		this.setState(
			(state) => ({ [name]: value }),
			() => {
				this.getTotalInvoiceAmount();
			}
		);
	};

	formatNumberAsCurrency(number) {
		return new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		}).format(number);
	}

	render() {
		const descriptionRows = [];
		for (let row = 0; row < this.nrOfDescriptionRows; row++) {
			descriptionRows.push(
				<div key={row} className='descriptionRow'>
					<input
						type='text'
						name={`${this.FIELDNAMES.DESCRIPTION}_${row}`}
						className='description'
						onBlur={this.handleOnBlur}
						disabled={this.isExistingInvoice}
						value={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.DESCRIPTION]
								: ""
						}
					/>
					<span className='currency'>&euro;</span>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className='hourlyrateInt'
						disabled={this.isExistingInvoice}
						onBlur={this.handleOnBlur}
						value={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.HOURLYRATE]
								: ""
						}
					/>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className='hours'
						disabled={this.isExistingInvoice}
						onBlur={this.handleOnBlur}
						value={
							this.state.invoiceDescriptionRows[row]
								? this.state.invoiceDescriptionRows[row][this.FIELDNAMES.HOURS]
								: ""
						}
					/>
					<span className='total'>
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
								{this.I18n.get("INVOICE.INPUT_INVOICE_DATE")}
							</label>
							{this.state.dateTimeCreated ? (
								this.dateTimeFormat.format(new Date(this.state.dateTimeCreated))
							) : (
								<input type='date' className='inputDate' id={this.FIELDNAMES.DATE} />
							)}
						</div>
					</div>

					<div className='col'>
						<div>
							<label htmlFor='companies'>{this.I18n.get("INVOICE.INPUT_COMPANY")}</label>
							{this.isExistingInvoice ? (
								this.state.companyName
							) : (
								<React.Fragment>
									<select
										id={this.FIELDNAMES.COMPANIES}
										className='selectCompanies'
										title={this.I18n.get("INVOICE.INPUT_COMPANY")}>
										{/* {this.state.rowData.map((row, index) => (
									<option key={index} value={row.company}>
										{row.company}
									</option> */}
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
						<label htmlFor='invoice-period'>{this.I18n.get("INVOICE.INPUT_PERIOD")}</label>
						<div className='displayFlex mt-2' id='invoice-period'>
							<div className='mr-3'>
								<label htmlFor='invoice-period-from' className='mb-1'>
									{this.I18n.get("INVOICE.INPUT_PERIOD_FROM")}
								</label>
								{this.isExistingInvoice ? (
									this.state.periodFrom ? (
										this.dateTimeFormat.format(new Date(this.state.periodFrom))
									) : (
										"--"
									)
								) : (
									<input
										type='date'
										disabled={this.isExistingInvoice}
										name={this.FIELDNAMES.PERIOD_FROM}></input>
								)}
							</div>
							<div className='ml-3'>
								<label htmlFor='invoice-period-to' className='mb-1'>
									{this.I18n.get("INVOICE.INPUT_PERIOD_TO")}
								</label>
								{this.isExistingInvoice ? (
									this.state.periodTo ? (
										this.dateTimeFormat.format(new Date(this.state.periodTo))
									) : (
										"--"
									)
								) : (
									<input
										type='date'
										disabled={this.isExistingInvoice}
										name={this.FIELDNAMES.PERIOD_TO}></input>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label className='descriptionRowLabel'>{this.I18n.get("INVOICE.INPUT_SERVICES")}</label>
						<label className='descriptionRowLabel'>{this.I18n.get("INVOICE.INPUT_RATE")}</label>
						<label className='descriptionRowLabel'>{this.I18n.get("INVOICE.INPUT_HOURS")}</label>
						<label className='descriptionRowLabel'>{this.I18n.get("INVOICE.TOTAL")}</label>
						{descriptionRows}
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className='inputRow'>
							<div className='rateInputs'></div>
							<div className='total'>
								{this.I18n.get("INVOICE.TOTAL")}:{" "}
								<span>{this.state.totalInvoiceAmount.totalBeforeVat}</span>
								{this.state.VatRate ? "+" : ""}
								<span>{this.state.VatRate}</span>
								{this.state.totalInvoiceAmount.totalVatAmount ? "=" : ""}
								<span>{this.state.totalInvoiceAmount.totalWithVatAmount}</span>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withFirebase(Invoice);
