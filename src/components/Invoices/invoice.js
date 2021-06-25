import React from "react";
import { Button } from "../Shared/Button/button";
import { DateComponent } from "../Shared/Date/date";
import { Select } from "../Shared/Select/select";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import * as ROUTES from "../../constants/routes";
import { firebaseContextConsumer } from "../../Firebase";
import { PersistenceContextConsumer } from "../../constants/contexts";
import componentStyles from "./invoice.module.scss";

class Invoice extends React.Component {

	constructor(props) {
		super(props);

		this.Utils = new Utils();
		this.I18n = new I18n();
		this.isExistingInvoice = !!(!!this.props.location.state && this.props.location.state.id);
		this.nrOfDescriptionRows = 10;

		// initialize state
		this.state = {
			companies: [],
			companyName: undefined,
			dateTimeCreated: undefined,
			dateTimePaid: undefined,
			dateTimePrinted: undefined,
			dateTimeSent: undefined,
			invoiceNr: undefined,
			rows: [],
			invoiceTypes: [
				{ id: 1, type: "credit" },
				{ id: 2, type: "debet" },
			],
			// to display messages to user we use this construct. type equals any Bootstrap 4.4.1 color class for text: https://getbootstrap.com/docs/4.4/utilities/colors/
			settingsStatus: {
				type: undefined,
				message: "",
			},
			totals: {},
			VATRate: undefined,
			VatRates: [],
		};

		// Transformation functions for fieldvalues before storing.
		this.persistFields = {
			companyName: (fieldValue) => fieldValue, // return value as is
			dateTimeCreated: (date) => new Date(date),
			invoiceNr: parseInt,
			rows: (fieldValue) => fieldValue,
			totals: (fieldValue) => fieldValue,
			type: (fieldValue) => fieldValue,
			VATRate: parseInt,
		};

		// Use constants for fieldnames instead of literals
		this.FIELDNAMES = {
			DATECREATED: "dateTimeCreated",
			PERIOD_FROM: "periodFrom",
			PERIOD_TO: "periodTo",
			COMPANIES: "companies",
			COMPANYNAME: "companyName",
			DESCRIPTION: "omschrijving",
			HOURLYRATE: "uurtarief",
			HOURS: "uren",
			TAX: "tax",
			VATRATE: "VATRate",
			TYPE: "type",
			ROWS: "rows",
		};

		// To assert the validity of a value use this map with assertions for each invoiceField.
		this.assertFieldValid = {
			companyName: (value) => typeof value === "string" && value.length > 0,
			dateTimeCreated: (value) => typeof value === "string" && value.length > 0,
			// input type='date' is NOT a Date but nice to know how to check for it: Object.prototype.toString.call(value) === "[object String]",
			invoiceNr: (value) => typeof value === "number",
			rows: (value) => Array.isArray(value) && value.length > 0,
			totals: (value) => value === Object(value) && Object.keys(value).length > 0 && value.totalWithVat, // check a numeric value has been submit
			type: (value) => typeof value === "string",
			VATRate: (value) => typeof value === "string" && value.length > 0,
		};
	}

	componentDidMount = () => {
		if (this.isExistingInvoice) {
			this.props.firebase.getInvoice(this.props.location.state.id).then((invoice) => {
				// update state with retrieved invoice
				this.setState({
					...invoice,
					totals: this.getTotalInvoiceAmount(invoice.rows, invoice.VATRate),
				});
			});
		} else {
			const newInvoicePromises = [];
			// retrieve last invoiceNr
			newInvoicePromises.push(this.props.firebase.getNewInvoiceNr("invoices", "invoiceNr"));
			// retrieve companies
			newInvoicePromises.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			newInvoicePromises.push(this.props.firebase.getVatRates());

			Promise.all(newInvoicePromises).then((values) => {
				this.setState({ invoiceNr: values[0], companies: values[1], VatRates: values[2] });
			});
		}
		// store the state in (session)storage
		const storedState = this.props.storage.get("invoiceState");
		if (storedState) {
			this.setState(storedState);
		}
	};

	/**
	 * handle input of most input fields
	 * @param{string} name - name of the inputfield
	 * @param{string} value - value of the inputfield
	 */
	onChange = (name, value) => {
		this.setState(() => ({ [name]: value }));
	};

	/**
	 * when selecting a VatRate also calculate totals
	 * @param{string} elementName - name of the DOM element: VATRate
	 * @param{string} elementValue - value of the DOM element: the chosen vat rate (0,9,21)
	 * @ returns void. Sets state key 'totals'
	 */
	onVatRateChange = (elementName, elementValue) => {
		// update state.VatRate
		this.onChange(elementName, elementValue);
		this.setState((state, props) => {
			return { totals: this.getTotalInvoiceAmount(this.state.rows, elementValue) };
		});
	};

	/**
	 * handle input in fields 'description', 'hourlyRrate' or 'hours'
	 * @param{object} event - the event fired when changing one of the row imputs
	 * @returns void - Sets state keys 'rows' and 'totals'
	 */
	handleDescriptionInput = (event) => {
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

		// prevent gaps in the rows array when user leaves empty rows
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
			totals: this.getTotalInvoiceAmount(rows, this.state.VATRate),
		});
	};

	// TODO: when vatrate ==== 0 also disklpoay toatalVatAmount & totalWithVat
	/**
	 * calculate amounts for totalBeforeVat, totalVatAmount and totalWithVat from the description array
	 * @param {array} rows - object array with rows
	 * @param {string} vatrate - the chosemn vatrate (0,9,21)
	 * @returns {object} with amounts / vatvalue calculated
	 */
	getTotalInvoiceAmount(rows, vatrate) {
		const _vatrate = parseInt(vatrate);
		// calculate
		const total = rows.reduce((total, row) => {
			// calculate total amount by adding uren * uurtarief for rows
			total = row.uren && row.uurtarief ? total + parseFloat(row.uren) * parseFloat(row.uurtarief) : total;
			return total;
		}, 0);

		const totalVatAmount = total * (_vatrate / 100);

		return {
			totalBeforeVat: total,
			totalVatAmount: totalVatAmount,
			totalWithVat: total + totalVatAmount,
		};
	}

	/**
	 * @param{number} number - the number to prefix with EUR
	 * @returns {string} - the number with currenctsymbol
	 * */
	formatNumberAsCurrency = (number) => {
		return new Intl.NumberFormat(this.I18n.getLocale(), {
			style: "currency",
			currency: "EUR",
		}).format(number);
	};

	/**
	 * Return to the listview of invoices
	 */
	onListview = () => {
		// remove the temporary state
		this.props.storage.remove("invoiceState");
		this.props.history.push({
			pathname: ROUTES.INVOICES,
		});
	};

	/**
	 * When user clicks 'New company' store current state and switch to Company component
	 */
	handleNewCompany = () => {
		// copy the state values that will be eventually stored to temporary storage. To be picked up when returning from creating a new company
		const persistFields = Object.keys(this.persistFields);
		// store curernt state under key in (session)Storage
		this.props.storage.set(
			"invoiceState",
			persistFields.reduce((acc, persistField) => {
				acc[persistField] = this.state[persistField];
				return acc;
			}, {})
		);
		// render Company component
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			params: { prevLocation: this.props.location.pathname, prevLocationName: "ROUTENAME.INVOICE" },
		});
	};

	/**
	 * submit the invoice
	 */
	onSubmit = () => this.storeInvoice(this.checkInvoice(this.onCreateInvoice()));

	/**
	 * Check is all fields are valid, convert to correct type
	 * @returns{object} invoice - the invoice, optionally with an error key
	 */
	onCreateInvoice = () => {
		return Object.keys(this.persistFields).reduce(
			(acc, key) => {
				acc = this.assertFieldValid[key](this.state[key]) // check if field is valid...
					? Object.assign(acc, { [key]: this.persistFields[key](this.state[key]) }) // if so, convert string to correct type
					: Object.assign(acc, { error: { status: true, keys: [...acc.error.keys, key] } }); // else error
				return acc;
			},
			{ error: { status: false, keys: [] } }
		);
	};

	/**
	 * @param{object} invoice - the invoice. Pass if no error, setState if error
	 * @returns{boolean|object} - false in case of error | invoice if no error
	 * @sideEffect - calls setStatusMessage if invoice is not valid
	 */
	checkInvoice = (invoice) => {
		if (invoice.error.status) {
			this.setStatusMessage(
				"danger",
				this.I18n.get("USERSETTINGS.SUBMIT.ERROR.MISSINGFIELDVALUES") +
					" [ " +
					invoice.error.keys.join(", ") +
					" ]"
			);
			return invoice;
		} else {
			return invoice;
		}
	};

	/**
	 * @param{object} invoice - the invoice.
	 * @returns void - calls fireStore as an sideEffect
	 */
	storeInvoice = (invoice) => {
		if (invoice.error.status === false) {
			// delete the error info
			delete invoice.error;
			// add the userId
			invoice.userId = this.props.firebase.auth.currentUser.uid;
			// set the initial status
			invoice.statustitle = this.I18n.get("INVOICE.STATUSTITLE.CREATED");
			this.props.firebase
				.addDocumentToCollection("invoices", invoice)
				.then((docRef) => {
					console.log(`document ${docRef.id} added}`);
					// remove the temporary state
					this.props.storage.remove("invoiceState");
					// update statusMessage
					this.setStatusMessage("success", this.I18n.get("STATUSMESSAGE.DOCUMENTADDED"));
				})
				.catch((e) => {
					console.log("ERROR: ", e);
					this.setStatusMessage("danger", e.message);
				});
		}
	};

	/**
	 * After an action, display message to user
	 *
	 * @param{string} type - the type of the message error-info-warn
	 * @param{string} message - te message to display
	 */
	setStatusMessage = (type, message) => {
		this.setState({
			settingsStatus: {
				type: type,
				message: message,
			},
		});
	};

	onCancel = (e) => {
		this.props.storage.remove("invoiceState");
		// React-Router has no Refresh functionality. This hack solves it
		this.props.history.push("/temp");
		this.props.history.goBack();
	};

	render() {
		if (!this.state.rows) {
			return;
		}
		const descriptionRows = [];
		for (let row = 0; row < this.nrOfDescriptionRows; row++) {
			descriptionRows.push(
				<div key={row} className={componentStyles.descriptionRow}>
					<input
						type='text'
						name={`${this.FIELDNAMES.DESCRIPTION}_${row}`}
						className={componentStyles.description}
						onChange={this.handleDescriptionInput}
						disabled={this.isExistingInvoice}
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["omschrijving"]
								: ""
						}
					/>
					<span className={componentStyles.currency}>&euro;</span>
					<input
						type='text'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className={componentStyles.hourlyrateInt}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["uurtarief"]
								: undefined
						}
					/>
					<input
						type='text'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className={componentStyles.hours}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["uren"]
								: undefined
						}
					/>
					<span className={componentStyles.total}>
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
		return (
			<div className={componentStyles.invoiceComponent}>
				<div className='row'>
					<div className='col d-flex flex-row'>
						<DateComponent
							labelText={this.I18n.get("INVOICE.LABEL.INVOICE_DATE")}
							name={this.FIELDNAMES.DATECREATED}
							displayInput={!this.isExistingInvoice}
							displayValue={this.state.dateTimeCreated}
							handleOnChange={this.onChange}
						/>
						<Select
							labelText={this.I18n.get("INVOICE.LABEL.INVOICETYPE")}
							name={this.FIELDNAMES.TYPE}
							displayValue={this.state.type}
							displayInput={!this.isExistingInvoice}
							data={this.state.invoiceTypes}
							displayKey='type'
							valueKey='id'
							handleOnChange={this.onChange}
						/>
					</div>

					<div className='col'>
						<Select
							buttonText={this.I18n.get("INVOICE.BUTTON.NEW_COMPANY")}
							data={this.state.companies}
							displayInput={!this.isExistingInvoice}
							displayKey='name'
							displayValue={this.state.companyName}
							handleOnChange={this.onChange}
							labelText={this.I18n.get("INVOICE.LABEL.COMPANY")}
							name={this.FIELDNAMES.COMPANYNAME}
							onButtonClick={this.handleNewCompany}
							valueKey='ID'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-column'>
						<div className='d-flex flex-row justify-content-start'>
							<label className={componentStyles.columnHeader}>
								{this.I18n.get("INVOICE.COLUMNHEADER.SERVICES")}
							</label>
							{/* use a dummy label to line other labels out above their columns*/}
							<label className={componentStyles.columnHeader}>
								{this.I18n.get("INVOICE.COLUMNHEADER.RATE")}
							</label>
							<label className={componentStyles.columnHeader}>
								{this.I18n.get("INVOICE.COLUMNHEADER.HOURS")}
							</label>
							<label className={componentStyles.columnHeader}>
								{this.I18n.get("INVOICE.COLUMNHEADER.TOTAL")}
							</label>
						</div>

						{descriptionRows}

						<div className={componentStyles.totals}>
							{/* DISPLAY SUBTOTAL */}
							<label>{this.I18n.get("INVOICE.LABEL.SUBTOTAL")}</label>
							<span className={componentStyles.totalBeforeVat}>
								{this.state.totals.totalBeforeVat
									? this.formatNumberAsCurrency(this.state.totals.totalBeforeVat)
									: null}
							</span>
						</div>

						{this.isExistingInvoice ? (
							// EXISTING INVOICE
							<div className={componentStyles.totals}>
								<label>{this.I18n.get("INVOICE.LABEL.VATRATE")}:</label>
								<span>{this.state.VATRate} % </span>
								<span className={componentStyles.VatRate}>
									{/* DISPLAY TOTAL VAT AMOUNT */}

									{/* display only when totalVatAmount is number  */}
									{this.state.totals.totalVatAmount
										? this.formatNumberAsCurrency(this.state.totals.totalVatAmount)
										: null}
								</span>
							</div>
						) : (
							// NEW INVOICE
							<div className={componentStyles.totals}>
								{/* DISPLAY VAT SELECT */}
								<Select
									container={false}
									labelText={this.I18n.get("INVOICE.LABEL.VATRATE")}
									name={this.FIELDNAMES.VATRATE}
									displayValue={this.state.VATRate}
									displayInput={!this.isExistingInvoice}
									extraClasses='d-flex flex-row'
									extraStyles={{ height: "fit-content" }}
									data={this.state.VatRates}
									displayKey='rate'
									columnView={false}
									valueKey='id'
									handleOnChange={this.onVatRateChange}
								/>

								{/* DISPLAY TOTAL VAT AMOUNT */}
								<span className={componentStyles.VatRate}>
									{/* display only when totalVatAmount is number  */}
									{!isNaN(this.state.totals.totalVatAmount)
										? this.formatNumberAsCurrency(this.state.totals.totalVatAmount)
										: null}
								</span>
							</div>
						)}
						<div className={componentStyles.totals}>
							<label>{this.I18n.get("INVOICE.LABEL.TOTAL")}</label>

							{/* DISPLAY SUBTOTAL + VAT */}
							<span className={componentStyles.totalWithVat}>
								{!isNaN(this.state.totals.totalVatAmount) && // Display only when total vat amount is defined...
								this.state.totals.totalBeforeVat !== 0 && // ...there is a subtotal amount...
								!isNaN(this.state.totals.totalWithVat) // ... and total is defined.
									? this.formatNumberAsCurrency(this.state.totals.totalWithVat)
									: null}
							</span>
						</div>
					</div>
				</div>

				<div className='row align-items-baseline flex-nowrap pr-2 pt-3'>
					<Button
						extraClasses='mr-auto'
						onClick={this.onListview}
						text={this.I18n.get("INVOICE.BUTTON.BACK")}
						extraStyles={{ marginLeft: "0.8rem" }}
					/>

					<div className='bg-light ml-3'>
						{this.state.settingsStatus.message ? (
							<span className={"text-" + this.state.settingsStatus.type}>
								{this.state.settingsStatus.message}
							</span>
						) : null}
					</div>
					{!this.isExistingInvoice && (
						<>
							<div className=' mx-3'>
								<Button
									onClick={this.onCancel}
									text={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TEXT")}
									title={this.I18n.get("USERSETTINGS.BUTTON.CANCEL.TITLE")}
								/>
							</div>
							<div>
								<Button
									onClick={this.onSubmit}
									text={this.I18n.get("USERSETTINGS.BUTTON.SAVE.TEXT")}
									title={this.I18n.get("USERSETTINGS.BUTTON.UPDATE.TITLE")}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		);
	}
}

export default PersistenceContextConsumer(firebaseContextConsumer(Invoice));
