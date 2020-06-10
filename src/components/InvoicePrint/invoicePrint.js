import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./invoicePrint.module.scss";

/**
 * The printable invoice.
 * @param {Object} props (Utils,invoiceNr,invoice,company, userSettings, userCompany])
 *
 */
const InvoicePrint = (props) => {
	return (
		<div id={props.invoiceNr} className={styles.invoicePrint}>
			{/* FACTUUR */}
			<div className={styles.factuurDatum + " mb-3"}>
				<div className={styles.header + " mb-3"}>{props.invoice.type === "credit" && "Credit "} Factuur</div>

				{props.invoice.statustitle === "vervallen" && (
					<span className={styles.alertText}>Deze factuur is vervallen</span>
				)}

				{/* datum: */}
				<div>
					<label htmlFor='displayDateTimeAangemaakt'>Datum:</label>
					<div className={styles.d_inline}>{props.invoice.dateTimeCreated}</div>
				</div>

				{/* factuurnr:*/}
				<div>
					<label>Factuurnr:</label>
					<span>{props.invoice.invoiceNr}</span>
				</div>
			</div>

			{/* BEDRIJF */}
			<div className={styles.klant + " mt-3"}>
				<span className={styles.header + " mb-2"}>{props.company.name}</span>

				<div>T.a.v. {props.company.contact}</div>
				<div>{props.company.address}</div>
				<div>
					{props.company.zipcode} {props.company.city}
				</div>
			</div>

			{/* USER */}
			<div className={styles.creditor + " mt-3"}>
				<span className={styles.header}>{props.userCompany.name}</span>
				<div>{props.userSettings.address}</div>
				<div>
					{props.userSettings.zipcode}&nbsp;&nbsp;
					{props.userSettings.city}
				</div>
				<div>KvK Amsterdam:&nbsp;{props.userCompany.kvknr}</div>
				<div>BTW nr:&nbsp;{props.userCompany.btwnr}</div>
			</div>

			<div className={styles.factuurTable}>
				<table cellPadding='0' cellSpacing='0'>
					<tbody>
						<tr className={styles.tableHeader}>
							<td>GELEVERDE DIENSTEN</td>
							<td>UREN</td>
							<td>TARIEF</td>
							<td>BEDRAG</td>
						</tr>
						{props.invoice.rows.map((row, i) => (
							<tr key={i} className={i % 2 ? styles.rowDark : styles.rowLight}>
								<td className={styles.column1}>{row.omschrijving || ""}</td>
								<td className={styles.column2}>{row.uren || ""}</td>
								<td className={styles.column3}>{row.uurtarief || ""}</td>
								<td className={styles.column4}>
									{row.uren && row.uurtarief ? row.uurtarief * row.uren : ""}
								</td>
							</tr>
						))}
						<tr>
							<td colSpan='4'>&nbsp;</td>
						</tr>

						<tr>
							<td align='right' className={styles.totalLabel}>
								SUBTOTAAL
							</td>
							<td colSpan='2' align='right'></td>
							<td className={styles.totalInput}>
								{props.Utils.currencyFormat.format(
									props.invoice.rows.reduce(
										(sum, row) =>
											row.uren && row.uurtarief ? sum + row.uurtarief * row.uren : sum,
										0
									)
								)}
							</td>
						</tr>

						<tr>
							<td align='right' className={styles.totalLabel}>
								BTW-TARIEF
							</td>
							<td colSpan='2' style={{ textAlign: "right", whiteSpace: "nowrap" }}>
								{props.invoice.VATRate} &#37;
							</td>
							<td className={styles.totalInput}>
								{props.Utils.currencyFormat.format(
									(props.invoice.VATRate / 100) *
										props.invoice.rows.reduce((sum, row) => (sum += row.uurtarief * row.uren), 0)
								)}
							</td>
						</tr>

						<tr>
							<td colSpan='4'>&nbsp;</td>
						</tr>

						<tr>
							<td align='right' className={styles.totalLabel}>
								<b>TOTAAL</b>
							</td>
							<td colSpan='2' align='right'></td>
							<td className={styles.totalInput + " " + styles.total}>
								{props.Utils.currencyFormat.format(
									(props.invoice.VATRate / 100) *
										props.invoice.rows.reduce((sum, row) => (sum += row.uurtarief * row.uren), 0) +
										props.invoice.rows.reduce((sum, row) => (sum += row.uurtarief * row.uren), 0)
								)}
							</td>
						</tr>

						<tr>
							<td colSpan='4'>&nbsp;</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* FOOTER */}
			<div className={styles.footerFrame}>
				<div className={styles.betaaltermijn}>
					U wordt verzocht het bedrag binnen
					{props.userSettings.paymentTerm}
					dagen over te maken op het onderstaande rekeningnummer:
					<div className={styles.userRekening}>
						<span>{props.userCompany.bankAccountNr}</span>{" "}
						<span>T.n.v. {props.userCompany.bankAccountName}</span>
						<span>{props.userCompany.bankAccountCity}</span>
					</div>
				</div>

				<div className={styles.leveringsvoorwaarden}>{props.userSettings.deliveryConditions}</div>
			</div>
		</div>
	);
};

export { InvoicePrint };
