import React from "react";
import { DateComponent } from "../Shared/Date/date";
import { Select } from "../Shared/Select/select";
import { Button } from "../Shared/Button/button";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import * as ROUTES from "../../constants/routes";

import { withFirebase } from "../../Firebase";
import * as styles from "./invoice.module.scss";

class Invoice extends React.Component {
	constructor(props) {
		super(props);

		this.Utils = new Utils();
		this.I18n = new I18n();

		// these fields contain the data and transform functionsto apply
		this.persistFields = {
			VATRate: parseInt,
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
			invoiceTypes: [
				{ id: 1, type: "credit" },
				{ id: 1, type: "debet" },
			],
			totals: {},
			VATRate: undefined,
			VatRates: [],
		};

		this.newInvoicePromises = [];
		this.isExistingInvoice = !!this.props.location.state && this.props.location.state.id;
		// retrieve existing invoice from db
		this.invoice$ = this.isExistingInvoice
			? this.props.firebase.getInvoice(this.props.location.state.id)
			: undefined;
		// new invoice!
		if (!this.isExistingInvoice) {
			// retrieve last invoiceNr
			this.newInvoicePromises.push(this.props.firebase.getNewInvoicenr());
			// retrieve companies
			this.newInvoicePromises.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			this.newInvoicePromises.push(this.props.firebase.getCollection("vatrates", "rate", ["id", "rate"]));
		}
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

	componentDidMount = () => {
		if (this.invoice$) {
			this.invoice$.then((invoice) => {
				// update state with retrieved invoice
				this.setState({
					companies: [],
					companyName: invoice.companyName,
					// only format dates if not undefined
					dateTimeCreated: invoice.dateTimeCreated
						? this.Utils.dateFormat.format(invoice.dateTimeCreated)
						: invoice.dateTimeCreated,
					dateTimePaid: invoice.dateTimePaid
						? this.Utils.dateFormat.format(invoice.dateTimePaid)
						: invoice.dateTimePaid,
					dateTimePrinted: invoice.dateTimePrinted
						? this.Utils.dateFormat.format(invoice.dateTimePrinted)
						: invoice.dateTimePrinted,
					dateTimeSent: invoice.dateTimeSent
						? this.Utils.dateFormat.format(invoice.dateTimeSent)
						: invoice.dateTimeSent,
					id: invoice.id,
					invoiceNr: invoice.invoiceNr,
					rows: invoice.rows,
					notes: invoice.notes,
					periodFrom: invoice.periodFrom
						? this.Utils.dateFormat.format(invoice.periodFrom)
						: invoice.periodFrom,
					periodTo: invoice.periodTo ? this.Utils.dateFormat.format(invoice.periodTo) : invoice.periodTo,
					statusTitle: invoice.statusTitle,
					type: invoice.type,
					totals: this.getTotalInvoiceAmount(invoice.rows, invoice.VATRate),
					VatRate: invoice.VATRate,
					VatRates: [],
				});
			});
		} else {
			// retrieve last invoiceNr,companies and VatRates
			Promise.all(this.newInvoicePromises).then((values) => {
				this.setState({ invoiceNr: values[0], companies: values[1], VatRates: values[2] });
			});
		}
	};

	/**
	 * handle input of most input fields
	 * @param{string} name - name of both the inputfield & stateKey
	 * @param{string} value - value of user input
	 */
	onChange = (name, value) => {
		this.setState({ [name]: value });
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
							? this.Utils.currencyFormat.format(
									this.state.rows[row].uurtarief * this.state.rows[row].uren
							  )
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
						<DateComponent
							labelText={this.I18n.get("INVOICE.LABEL.INVOICE_DATE")}
							name='date'
							displayInput={!this.isExistingInvoice}
							displayValue={this.state.dateTimeCreated}
							handleOnChange={this.onChange}
						/>
					</div>

					<div className='col'>
						<Select
							labelText={this.I18n.get("INVOICE.LABEL.COMPANY")}
							name={this.FIELDNAMES.COMPANYNAME}
							existingValue={this.state.companyName}
							data={this.state.companies}
							displayKey='name'
							valueKey='id'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className='d-flex justify-content-between mt-2'>
							<Select
								labelText={this.I18n.get("INVOICE.LABEL.INVOICETYPE")}
								name='invoiceType'
								data={this.state.invoiceTypes}
								existingValue={this.state.type}
								displayKey='type'
								valuekey='id'
							/>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER.SERVICES")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER.RATE")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER.HOURS")}
						</label>
						<label className={styles.descriptionRowLabel}>
							{this.I18n.get("INVOICE.COLUMNHEADER.TOTAL")}
						</label>

						{descriptionRows}

						<div className={styles.totals}>
							<label>{this.I18n.get("INVOICE.LABEL.SUBTOTAL")}</label>
							<span className={styles.totalBeforeVat}>
								{this.state.totals.totalBeforeVat &&
									this.formatNumberAsCurrency(this.state.totals.totalBeforeVat)}
							</span>
						</div>

						{this.isExistingInvoice ? (
							<div className={styles.totals}>
								<label>{this.I18n.get("INVOICE.LABEL.VATRATE")}:</label>
								<span>{this.state.VatRate} % </span>
								<span className={styles.VatRate}>
									{/* display the amount */}
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
								</span>
							</div>
						) : (
							<div className={styles.totals}>
								<div className={styles.VatRatesDropdown}>
									<label>{this.I18n.get("INVOICE.LABEL.VATRATE")}:</label>

									<select name={this.FIELDNAMES.VATRATE} onChange={this.onVatRateChange}>
										<option value=''>{this.I18n.get("INVOICE.INPUT.VATRATE.DEFAUTVALUE")}</option>
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
						)}
						<div className={styles.totals}>
							<label>{this.I18n.get("INVOICE.LABEL.TOTAL")}</label>

							<span className={styles.totalWithVat}>
								{!!this.state.totals.totalVatAmount &&
									this.formatNumberAsCurrency(this.state.totals.totalWithVat)}
							</span>
						</div>
					</div>
				</div>
				<Button
					onClick={this.onListview}
					text={this.I18n.get("BUTTON.OVERVIEW")}
					styles={{ marginLeft: "0.8rem" }}
					classes='btn-primary float-left'
				/>

				<Button
					disabled={this.isExistingInvoice}
					onClick={this.onSubmit}
					text={this.I18n.get("BUTTON.SAVE")}
					styles={{ marginRight: "0.8rem" }}
					classes='btn-primary float-right'
				/>
			</React.Fragment>
		);
	}
}

export default withFirebase(Invoice);
