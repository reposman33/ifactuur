import React from "react";
import { DateComponent } from "../Shared/Date/date";
import { Select } from "../Shared/Select/select";
import { Button } from "../Shared/Button/button";
import { I18n } from "../../services/I18n/I18n";
import { Utils } from "../../services/Utils";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../../Firebase";
import { PersistenceContext } from "../../constants/contexts";
import styles from "./invoice.module.scss";

class Invoice extends React.Component {
	static contextType = PersistenceContext;

	constructor(props) {
		super(props);

		this.Utils = new Utils();
		this.I18n = new I18n();

		this.storage = undefined; // to be set in componentDidMount
		// When storing data all state values are strings. They have to be xformed to their respective types.
		// Below the state keys and their transform functions to apply.
		this.persistFields = {
			VATRate: parseInt,
			companyName: (fieldValue) => fieldValue, // return value as is
			dateTimeCreated: (date) => new Date(date),
			invoiceNr: parseInt,
			rows: (fieldValue) => fieldValue,
			totals: (fieldValue) => fieldValue,
			type: (fieldValue) => fieldValue,
		};

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
			invoiceStatus: {
				error: false,
				message: "",
			},
			totals: {},
			VATRate: undefined,
			VatRates: [],
		};

		this.isExistingInvoice = !!(!!this.props.location.state && this.props.location.state.id);
		this.nrOfDescriptionRows = 10;

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
			// retrieve last invoiceNr,companies and VatRates
			// retrieve last invoiceNr
			newInvoicePromises.push(this.props.firebase.getNewFieldValue("invoices", "invoiceNr"));
			// retrieve companies
			newInvoicePromises.push(this.props.firebase.getCollection("companies", "name", ["id", "name"]));
			// retrieve VatRates
			newInvoicePromises.push(this.props.firebase.getVatRates());

			Promise.all(newInvoicePromises).then((values) => {
				this.setState({ invoiceNr: values[0], companies: values[1], VatRates: values[2] });
			});
		}
		// consume the persistence context
		this.storage = this.context;

		// overwrite the state when a previous state is stored
		const storedState = this.storage.get("invoiceState");
		if (storedState) {
			this.setState(storedState);
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
	onVatRateChange = (elementName, elementValue) => {
		// update state.VatRate
		this.onChange(elementName, elementValue);
		this.setState((state, props) => {
			return { totals: this.getTotalInvoiceAmount(this.state.rows, elementValue) };
		});
	};

	/**
	 * handle input in fields 'description', 'hourlyRrate' or 'hours'
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

	/**
	 * calculate amounts for totalBeforeVat, totalVatAmount and totalWithVat from the description array
	 * @param {string} invoiceData - stringified object array 1 object containing description, hourlyRate and hours for at least the first row
	 * @returns {object} with amounts calculated
	 */
	getTotalInvoiceAmount(rows, vatrate) {
		const _vatrate = parseInt(vatrate);
		// calculate
		const total = rows.reduce((total, row) => {
			// calculate total amount by adding uren * uurtarief for rows
			total = row.uren && row.uurtarief ? total + parseFloat(row.uren) * parseFloat(row.uurtarief) : total;
			return total;
		}, 0);

		const totalVatAmount = _vatrate ? total * (_vatrate / 100) : 0;

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
	onListview = () => {
		// remove the temporary state
		this.storage.remove("invoiceState");
		this.props.history.push({
			pathname: ROUTES.INVOICES,
		});
	};

	handleNewCompany = () => {
		// copy the state values that will be eventually stored to temporary storage. To be picked up when returning from creating a new company
		const persistFields = Object.keys(this.persistFields);
		this.storage.set(
			"invoiceState",
			persistFields.reduce((acc, persistField) => {
				acc[persistField] = this.state[persistField];
				return acc;
			}, {})
		);
		this.props.history.push({
			pathname: ROUTES.COMPANY,
			params: { prevLocation: this.props.location.pathname, prevLocationName: "LOCATION.INVOICE" },
		});
	};

	// onSubmit
	onSubmit = () => this.storeInvoice(this.checkInvoice(this.onCreateInvoice()));

	onCreateInvoice = () => {
		return Object.keys(this.persistFields).reduce(
			// filter keys and optionally convert state prop values
			(acc, key) => {
				if (
					// check the state value before adding to invoice object:
					this.state[key] && // it should be defined...
					((Array.isArray(this.state[key]) && this.state[key].length > 0) || // ...if Array it should be filled...
					(this.state[key] === Object(this.state[key]) && Object.keys(this.state[key]).length > 0) || // ...if Object it should have keys...
					(typeof this.state[key] === "string" && this.state[key]).length > 0 || // ...it should not be ""...
					typeof this.state[key] === "number" || // ... it can be any Number...
						Object.prototype.toString.call(this.state[key]) === "[object Date]") // ... it can be a Date
				) {
					acc[key] = this.persistFields[key](this.state[key]);
				} else {
					acc.error = true;
				}
				return acc;
			},
			{}
		);
	};
	checkInvoice = (invoice) => {
		if (invoice.error) {
			this.setState({
				invoiceStatus: {
					error: true,
					message: this.I18n.get("INVOICE.SUBMIT.ERROR.MISSINGFIELDVALUES"),
				},
			});
			return false;
		} else {
			return invoice;
		}
	};

	storeInvoice = (invoice) => {
		if (invoice) {
			// add the current user id!
			invoice.userId = this.props.firebase.auth.currentUser.uid;
			// add the default statustitle
			invoice.statustitle = "created";
			this.props.firebase.addDocumentToCollection("invoices", invoice).then((docRef) => {
				console.log("document ", docRef.id, " added");
				this.onListview();
			});
		}
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
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["omschrijving"]
								: ""
						}
					/>
					<span className={styles.currency}>&euro;</span>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURLYRATE}_${row}`}
						className={styles.hourlyrateInt}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["uurtarief"]
								: undefined
						}
					/>
					<input
						type='number'
						name={`${this.FIELDNAMES.HOURS}_${row}`}
						className={styles.hours}
						disabled={this.isExistingInvoice}
						onChange={this.handleDescriptionInput}
						defaultValue={
							row <= this.state.rows.length - 1
								? this.state.rows[row] && this.state.rows[row]["uren"]
								: undefined
						}
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
		return (
			<div className={styles.invoiceComponent}>
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
							required={true}
							valueKey='ID'
						/>
					</div>
				</div>
				<div className='row'>
					<div className='col d-flex flex-column'>
						<div className='d-flex flex-row justify-content-start'>
							<label className={styles.columnHeader}>
								{this.I18n.get("INVOICE.COLUMNHEADER.SERVICES")}
							</label>
							{/* use a dummy label to line other labels out above their columns*/}
							<label className={styles.columnHeader}>{this.I18n.get("INVOICE.COLUMNHEADER.RATE")}</label>
							<label className={styles.columnHeader}>{this.I18n.get("INVOICE.COLUMNHEADER.HOURS")}</label>
							<label className={styles.columnHeader}>{this.I18n.get("INVOICE.COLUMNHEADER.TOTAL")}</label>
						</div>

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
								<span>{this.state.VATRate} % </span>
								<span className={styles.VatRate}>
									{/* display the amount */}
									{!!this.state.totals.totalVatAmount &&
										this.formatNumberAsCurrency(this.state.totals.totalVatAmount)}
								</span>
							</div>
						) : (
							<div className={styles.totals}>
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
				<div className='d-flex mb-2 justify-content-between'>
					<Button
						onClick={this.onListview}
						text={this.I18n.get("INVOICE.BUTTON.BACK")}
						extraStyles={{ marginLeft: "0.8rem" }}
					/>

					<Button
						disabled={this.isExistingInvoice}
						onClick={this.onSubmit}
						text={this.I18n.get("INVOICE.BUTTON.SAVE")}
						extraStyles={{ marginRight: "0.8rem" }}
					/>
				</div>
				<span className='d-block margin-auto text-center text-danger'>
					{this.state.invoiceStatus.error && this.state.invoiceStatus.message}
				</span>
			</div>
		);
	}
}

export default withFirebase(Invoice);
