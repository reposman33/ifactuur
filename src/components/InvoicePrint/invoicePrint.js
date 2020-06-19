import React, { useEffect } from "react";
import { I18n } from "../../services/I18n/I18n";
import { PDFExport } from "@progress/kendo-react-pdf";
import styles from "./invoicePrint.module.scss";
/**
 * The printable invoice.
 * @param {Object} props (invoiceNr,invoice,company, userSettings, userCompany])
 *
 */
const InvoicePrint = (props) => {
	let invoicePDF;
	const getI18n = new I18n().get;
	const fileName = `invoice_${props.invoiceNr}`;
	const subTotalAmount = props.invoice.rows
		.reduce((sum, row) => (row.uren && row.uurtarief ? sum + row.uurtarief * row.uren : sum), 0)
		.toFixed(2);
	const vatAmount = (
		(props.invoice.VATRate / 100) *
		props.invoice.rows.reduce((sum, row) => (sum += row.uurtarief && row.uren ? row.uurtarief * row.uren : 0), 0)
	).toFixed(2);
	const totalAmount = (
		(props.invoice.VATRate / 100) *
			props.invoice.rows.reduce(
				(sum, row) => (sum += row.uurtarief && row.uren ? row.uurtarief * row.uren : 0),
				0
			) +
		props.invoice.rows.reduce((sum, row) => (sum += row.uurtarief && row.uren ? row.uurtarief * row.uren : 0), 0)
	).toFixed(2);

	// useEffect(() => print(".modal-body"));
	useEffect(() => invoicePDF.save(), []);

	return (
		<PDFExport
			ref={(component) => (invoicePDF = component)}
			paperSize={["210mm", "297mm"]}
			fileName={fileName}
			scale={0.68}
			author='UurtjeFactuurtje'
			creator='UurtjeFactuurtje'
			title='print from UurtjeFactuurtje'>
			<div className={styles.invoicePrint}>
				{/* FACTUUR */}
				<div className={styles.factuurDatum}>
					<div className={styles.header + " mb-3"}>
						{props.invoice.type === "credit" && "Credit "} {getI18n("INVOICEPRINT.TITLE")}
					</div>

					{props.invoice.statustitle === "vervallen" && (
						<span className={styles.alertText}>{getI18n("INVOICEPRINT.STATUSMESSAGE")}</span>
					)}

					{/* datum: */}
					<div>
						<label htmlFor='displayDateTimeAangemaakt'>{getI18n("INVOICEPRINT.LABELS.DATE")}:</label>
						<div className={styles.d_inline}>{props.invoice.dateTimeCreated}</div>
					</div>

					{/* factuurnr:*/}
					<div>
						<label>{getI18n("INVOICEPRINT.LABELS.INVOICENR")}:</label>
						<span>{props.invoice.invoiceNr}</span>
					</div>
				</div>
				{/* BEDRIJF */}
				<div className={styles.klant + " mt-3"}>
					<span className={styles.header + " mb-2"}>{props.company.name}</span>

					<div>
						{getI18n("INVOICEPRINT.LABELS.ATT")} {props.company.contact}
					</div>
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
					<table>
						<tbody>
							<tr className={styles.tableHeader}>
								<td>{getI18n("INVOICEPRINT.TABLE_HEADER.SERVICES")}</td>
								<td>{getI18n("INVOICEPRINT.TABLE_HEADER.HOURS")}</td>
								<td>{getI18n("INVOICEPRINT.TABLE_HEADER.RATE")}</td>
								<td>{getI18n("INVOICEPRINT.TABLE_HEADER.AMOUNT")}</td>
							</tr>
							{props.invoice.rows.map((row, i) => (
								<tr key={i} className={i % 2 ? styles.rowDark : styles.rowLight}>
									<td className={styles.column1}>{row.omschrijving || ""}</td>
									<td className={styles.column2}>{row.uren || ""}</td>
									<td className={styles.column3}>{row.uurtarief || ""}</td>
									<td className={styles.column4}>
										{row.uurtarief && row.uren && (row.uurtarief * row.uren).toFixed(2)}
									</td>
								</tr>
							))}
							<tr>
								<td colSpan='4'>&nbsp;</td>
							</tr>

							<tr>
								<td align='right' className={styles.totalLabel}>
									{getI18n("INVOICEPRINT.TABLE_HEADER.SUBTOTAL")}
								</td>
								<td colSpan='2' align='right'></td>
								<td className={styles.total}>{subTotalAmount}</td>
							</tr>

							<tr>
								<td align='right' className={styles.totalLabel}>
									{getI18n("INVOICEPRINT.TABLE_HEADER.VAT_RATE")}
								</td>
								<td colSpan='2'>{props.invoice.VATRate} &#37;</td>
								<td className={styles.total}>{vatAmount}</td>
							</tr>

							<tr>
								<td colSpan='4'>&nbsp;</td>
							</tr>

							<tr>
								<td className={styles.totalLabel}>{getI18n("INVOICEPRINT.TABLE_HEADER.TOTAL")}</td>
								<td colSpan='2'></td>
								<td className={styles.total + " " + styles.totalBackground}>
									<span>EUR</span>&nbsp;
									{totalAmount}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* FOOTER */}
				<div className={styles.footerFrame}>
					<div>
						{getI18n("INVOICEPRINT.FOOTER.PAYMENTTERMS")
							.split(" ")
							.reduce((acc, word) => {
								switch (word) {
									case "{1}":
										acc.push(props.userSettings.paymentTerm);
										return acc;
									case "{2}":
										acc.push(props.userCompany.bankAccountNr);
										return acc;
									case "{3}":
										acc.push(props.userCompany.bankAccountName);
										return acc;
									case "{4}":
										acc.push(props.userCompany.bankAccountCity);
										return acc;
									default:
										acc.push(word);
										return acc;
								}
							}, [])
							.join(" ")}
					</div>

					<div className={styles.leveringsvoorwaarden}>{props.userSettings.deliveryConditions}</div>
				</div>
			</div>
		</PDFExport>
	);
};

export { InvoicePrint };
