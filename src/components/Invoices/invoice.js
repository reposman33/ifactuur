import React from "react";
import { I18n } from "../../services/I18n/I18n";
import { withFirebase } from "../../Firebase";
import "./index.scss";

class Invoice extends React.Component {
	constructor(props) {
		super(props);
		// make the async call to Firebase and pick it up in componentDidMount
		this.isExistingInvoice = !!this.props.location.state.id;
		this.invoicePromise = this.props.firebase.getInvoice(this.props.location.state.id);
		this.I18n = new I18n();
		//		this.Utils = new Utils();
		this.DECIMAL_SIGN = this.I18n.getLocale() === "en" ? "." : ",";
		this.currencyFormat = new Intl.NumberFormat(this.I18n.getLocale(), { style: "currency", currency: "EUR" });
		this.dateTimeFormat = new Intl.DateTimeFormat(this.I18n.getLocale(), {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		this.totalBeforeTax = undefined;
		this.tax = undefined;
		this.nrOfDescriptionRows = 10;
		this.invoiceRows = undefined;
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
		this.taxFormatted = undefined;
		this.totalBeforeTaxFormatted = undefined;
		this.totalFormatted = undefined;
		this.state = {
			id: this.props.location.state.id, // invoiceId
			[this.FIELDNAMES.HOURLYRATE]: undefined,
			[this.FIELDNAMES.HOURS]: undefined,
			[this.FIELDNAMES.TAX]: undefined,
			totalBeforeTax: null,
			tax: undefined,
		};
	}

	componentDidMount() {
		this.invoicePromise.then((doc) => {
			this.invoiceData = doc.data();

			console.log(this.invoiceData);

			this.invoiceDescription = JSON.parse(this.invoiceData.rows);
			this.setState({
				[this.FIELDNAMES.HOURLYRATE]: undefined,
				[this.FIELDNAMES.HOURS]: undefined,
				[this.FIELDNAMES.TAX]: undefined,
				[this.FIELDNAMES.DATE]: undefined,
				rows: [],
			});
		});
	}

	handleOnBlur = (event) => {
		let { name, value } = event.target;
		value =
			name === this.FIELDNAMES.HOURS || name === this.FIELDNAMES.HOURLYRATE || name === this.FIELDNAMES.TAX
				? value.replace(".", ",")
				: value;

		if (
			name === this.FIELDNAMES.DESCRIPTION ||
			name === this.FIELDNAMES.HOURLYRATE ||
			name === this.FIELDNAMES.HOURS
		) {
			const rowIndex = parseInt(name.substr(name.length - 1, 1));
			const fieldName = name.substr(0, name.length - 1);
			name = "rows";
			const rows = [...this.state.rows];
			rows[rowIndex][fieldName] = value;
			value = rows;
		}
		this.setState(
			(state) => ({ [name]: value }),
			() => {
				this.calculateTotal();
			}
		);
	};

	// calculate total sum by multiplying hours with rate and tax
	calculateTotal() {
		// calculate number
		const hourlyRate = this.state.hourlyRateInt ? parseInt(this.state.hourlyRate) : 0;
		const hours = this.state.hours ? parseInt(this.state.hours) : 0;

		this.setState({
			totalBeforeTax: hourlyRate * hours,
		});
		const taxAmount = this.state.tax ? parseInt(this.state.tax) / 100 : 0;
		this.setState({
			tax: taxAmount * this.state.totalBeforeTax,
		});
	}

	formatNumberAsCurrency(number) {
		return new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		}).format(number);
	}

	render() {
		const descriptionRows = [];

		if (this.invoiceDescription) {
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
								this.invoiceDescription[row]
									? this.invoiceDescription[row][this.FIELDNAMES.DESCRIPTION]
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
								this.invoiceDescription[row]
									? this.invoiceDescription[row][this.FIELDNAMES.HOURLYRATE]
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
								this.invoiceDescription[row] ? this.invoiceDescription[row][this.FIELDNAMES.HOURS] : ""
							}
						/>
						<span className='total'>
							{this.invoiceDescription[row]
								? this.currencyFormat.format(
										this.invoiceDescription[row].uurtarief * this.invoiceDescription[row].uren
								  )
								: ""}
						</span>
					</div>
				);
			}
		}

		return this.invoiceData ? (
			<React.Fragment>
				<div className='row'>
					<div className='col'>
						<div>
							<label htmlFor='date' className='mb-2'>
								{this.I18n.get("INVOICE.INPUT_INVOICE_DATE")}
							</label>
							{this.isExistingInvoice ? (
								this.dateTimeFormat.format(new Date(this.invoiceData.dateTimeCreated))
							) : (
								<input type='date' className='inputDate' id={this.FIELDNAMES.DATE} />
							)}
						</div>
					</div>

					<div className='col'>
						<div>
							<label htmlFor='companies'>{this.I18n.get("INVOICE.INPUT_COMPANY")}</label>
							{this.isExistingInvoice ? (
								this.invoiceData.companyName
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
									this.invoiceData.periodFrom ? (
										this.dateTimeFormat.format(new Date(this.invoiceData.periodFrom))
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
									this.invoiceData.periodTo ? (
										this.dateTimeFormat.format(new Date(this.invoiceData.periodTo))
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
								{this.I18n.get("INVOICE.TOTAL")}: <span>{this.totalBeforeTaxFormatted}</span>
								{this.taxFormatted ? "+" : ""}
								<span>{this.taxFormatted}</span>
								{this.totalFormatted ? "=" : ""}
								<span>{this.totalFormatted}</span>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		) : null;
	}
}

export default withFirebase(Invoice);
