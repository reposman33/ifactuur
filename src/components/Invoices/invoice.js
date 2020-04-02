import React from "react";
import I18n from "../../services/I18n/I18n";
import * as styles from "./index.module.scss";
import * as CONSTANTS from "../../constants/misc";
import { state } from "../../constants/dummyState";

class Invoice extends React.Component {
	constructor(props) {
		super(props);
		this.DECIMAL_SIGN = I18n.getLocale() === "en" ? "." : ",";
		this.totalBeforeTax = undefined;
		this.tax = undefined;
		this.FIELDNAMES = {
			HOURLYRATEINT: "hourlyRateInt",
			HOURLYRATEDEC: "hourlyRateDec",
			HOURS: "hours",
			TAX: "tax"
		};
		this.taxFormatted = undefined;
		this.totalBeforeTaxFormatted = undefined;
		this.totalFormatted = undefined;
		this.state = {
			[this.FIELDNAMES.HOURLYRATEINT]: undefined,
			[this.FIELDNAMES.HOURLYRATEDEC]: undefined,
			[this.FIELDNAMES.HOURS]: undefined,
			[this.FIELDNAMES.TAX]: undefined,
			totalBeforeTax: null,
			tax: undefined,
			...state
		}; //API.getPage(this.PAGE);
	}

	handleOnBlur = event => {
		const { name, value } = event.target;
		if (name === this.FIELDNAMES.HOURLYRATEINT) {
			this.setState(
				state => ({ [name]: value }),
				() => {
					this.calculateTotal();
				}
			);
		}
		if (name === this.FIELDNAMES.HOURLYRATEDEC) {
			this.setState(
				state => ({ [name]: value }),
				() => {
					this.calculateTotal();
				}
			);
		}
		if (name === this.FIELDNAMES.HOURS) {
			this.setState(
				state => ({ [name]: value }),
				() => {
					this.calculateTotal();
				}
			);
		}
		if (name === this.FIELDNAMES.TAX) {
			this.setState(
				state => ({ [name]: value }),
				() => {
					this.calculateTotal();
				}
			);
		}
	};

	// calculate total sum by multiplying hours with rate and tax
	calculateTotal() {
		let totalBeforeTaxUnformatted = undefined;
		let taxUnformatted = undefined;
		if (typeof this.state.hourlyRateInt === "string" && typeof this.state.hours === "string") {
			// calculate number
			const integers = this.state.hourlyRateInt ? parseInt(this.state.hourlyRateInt) : 0;
			const decimals = this.state.hourlyRateDec ? parseInt(this.state.hourlyRateDec) / 100 : 0;
			const hours = this.state.hours ? parseInt(this.state.hours) : 0;
			totalBeforeTaxUnformatted = (integers + decimals) * hours;

			this.setState({
				totalBeforeTax: totalBeforeTaxUnformatted
			});
			// format as currency
			this.totalBeforeTaxFormatted = totalBeforeTaxUnformatted
				? this.formatNumberAsCurrency(totalBeforeTaxUnformatted)
				: this.totalBeforeTaxFormatted;
		}

		if (typeof this.state.tax === "string" && totalBeforeTaxUnformatted) {
			const taxAmount = this.state.tax ? parseInt(this.state.tax) / 100 : 0;
			taxUnformatted = taxAmount * totalBeforeTaxUnformatted;
			this.setState({
				tax: taxUnformatted
			});

			// format tax as currency
			this.taxFormatted = this.formatNumberAsCurrency(taxUnformatted);
			// format total as currency
			this.totalFormatted = this.formatNumberAsCurrency(totalBeforeTaxUnformatted + taxUnformatted);
		}
	}

	formatNumberAsCurrency(number) {
		return new Intl.NumberFormat(I18n.getLocale(), {
			style: "currency",
			currency: "EUR"
		}).format(number);
	}
	render() {
		return (
			<React.Fragment>
				<div className='row'>
					<div className='col'>
						<div>
							<label htmlFor='date' className='mb-2'>
								{I18n.get("INVOICE.INPUT_INVOICE_DATE")}
							</label>
							<input type='date' className={styles.inputDate} id='date' />
						</div>
					</div>

					<div className='col'>
						<div>
							<label htmlFor='companies'>{I18n.get("INVOICE.INPUT_COMPANY")}</label>
							<select
								id='companies'
								className={styles.selectCompanies}
								title={I18n.get("INVOICE.INPUT_COMPANY")}>
								{this.state.rowData.map((row, index) => (
									<option key={index} value={row.company}>
										{row.company}
									</option>
								))}
							</select>
							<button className='btn btn-primary slateGrey mx-3'>
								{I18n.get("INVOICE.BUTTONS.NEW_COMPANY")}
							</button>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label htmlFor='invoice-period'>{I18n.get("INVOICE.INPUT_PERIOD")}</label>
						<div className='displayFlex mt-2' id='invoice-period'>
							<div className='mr-3'>
								<label htmlFor='invoice-period-from' className='mb-1'>
									{I18n.get("INVOICE.INPUT_PERIOD_FROM")}
								</label>
								<input type='date' name='invoice-period-from' id='invoice-period-from'></input>
							</div>
							<div className='ml-3'>
								<label htmlFor='invoice-period-to' className='mb-1'>
									{I18n.get("INVOICE.INPUT_PERIOD_TO")}
								</label>
								<input type='date' name='invoice-period-to' id='invoice-period-to'></input>
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<label htmlFor='description'>{I18n.get("INVOICE.INPUT_SERVICES")}</label>
						<textarea name='description' id='description' rows='10' className='mt-3'></textarea>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className={styles.inputRow}>
							<div className={styles.rateInputs}>
								<div className={styles.hourlyRate}>
									<label htmlFor='hourlyRate'>{I18n.get("INVOICE.INPUT_RATE")}</label>
									<input
										type='number'
										name={this.FIELDNAMES.HOURLYRATEINT}
										onBlur={this.handleOnBlur}
									/>
									{this.DECIMAL_SIGN}
									<input
										type='number'
										min='0'
										max='99'
										name={this.FIELDNAMES.HOURLYRATEDEC}
										onBlur={this.handleOnBlur}
									/>
								</div>
								<div className={styles.hours}>
									<label htmlFor='hours'>{I18n.get("INVOICE.INPUT_HOURS")}</label>
									<input type='number' name={this.FIELDNAMES.HOURS} onBlur={this.handleOnBlur} />
								</div>
								<div className={styles.tax}>
									<label htmlFor='tax'>{I18n.get("INVOICE.INPUT_TAX")}</label>
									<select id='tax' name={this.FIELDNAMES.TAX} onBlur={this.handleOnBlur}>
										{CONSTANTS.TAX_VALUES.map(value => (
											<option key={value} value={value}>
												{value}
											</option>
										))}
									</select>{" "}
									%
								</div>
							</div>
							<div className={styles.total}>
								{I18n.get("INVOICE.TOTAL")}: <span>{this.totalBeforeTaxFormatted}</span>
								{this.taxFormatted ? "+" : ""}
								<span>{this.taxFormatted}</span>
								{this.totalFormatted ? "=" : ""}
								<span>{this.totalFormatted}</span>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export { Invoice };
