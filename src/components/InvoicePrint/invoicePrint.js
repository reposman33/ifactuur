import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./invoicePrint.module.scss";

/**
 * The printable invoice.
 * @param {Object} props
 *
 */
const InvoicePrint = (props) => {
	return (
		<div className={styles.invoicePrint}>
			{/* FACTUUR */}
			<div className={styles.factuurDatum}>
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
				<span className={styles.header}>{props.usersCompany.name}</span>
				<div>{props.userSettings.address}</div>
				<div>
					{props.userSettings.zipcode}&nbsp;&nbsp;
					{props.userSettings.city}
				</div>
				<div>KvK Amsterdam:&nbsp;{props.usersCompany.kvknr}</div>
				<div>BTW nr:&nbsp;{props.usersCompany.btwnr}</div>
			</div>

			<div className='factuurTable'>
				{/* <table cellpadding="0" cellspacing="0">
				<tr className="tableHeader"><td>GELEVERDE DIENSTEN</td><td>UREN</td><td>TARIEF</td><td>BEDRAG</td></tr>
				<cfset totaalbedrag=0>
				<cfset totaalOnkostbedrag=0>
				<cfloop from="1" to="#invoiceRowCount#" index="i">
					<cftry>
						<cfinvoke component="#factuurbean#" method="getField" field="Omschrijving#i#" returnvariable="omschrijving">
						<cfinvoke component="#factuurbean#" method="getField" field="Uren#i#" returnvariable="uren">
						<cfinvoke component="#factuurbean#" method="getField" field="Uurtarief#i#" returnvariable="uurtarief">
						<cfinvoke component="#factuurbean#" method="getField" field="Bedrag#i#" returnvariable="bedrag">
					<cfcatch type="Any" >
					</cfcatch>
					</cftry>
					<cfset totaalbedrag+=Iif(IsNumeric(bedrag),"bedrag","0")>

					<tr className="#Iif(i mod 2,"'rowDark'","'rowLight'")#">
						<td className="column1">
							<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
								#Iif(Len(omschrijving),"omschrijving","'&nbsp;'")#
							<cfelseif !printView>
								<input	type="text"
										id="omschrijving#i#"
										name="omschrijving#i#"
										value="#omschrijving#"
										maxlength="255">
							</cfif>
						</td>
						<td className="column2">
							<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
								#Iif(Len(uren),"uren","'&nbsp;'")#
						</td>
						<td className="column3">
							<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
								#Iif(Len(uurtarief),"uurtarief","'&nbsp;'")#
						</td>
						<td className="column4">
							<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
								#Iif(Len(bedrag),"bedrag","'&nbsp;'")#
							</cfif>
						</td>
					</tr>
				</cfloop>
				<tr><td colspan="4">&nbsp;</td></tr>

				<cfset subTotaal=NumberFormat(totaalbedrag,"-999999.99")>
				<cfset totaalBedrag=Iif(IsNumeric(totaalBedrag),"totaalBedrag","'0'")>
				<cfset BTWBedrag=NumberFormat(totaalBedrag*factuurBean.getVATRate()/100,"-999999.99")>
				<cfset totaalBedragincBTW=NumberFormat(BTWBedrag+totaalBedrag+totaalOnkostbedrag,"-999999.99")>
				<cfif totaalOnkostbedrag gt 0>
					<cfset totaalOnkostbedrag=NumberFormat(totaalOnkostbedrag,"-999999.99")>
				</cfif>

				<tr><td align="right" className="totalLabel">
				SUBTOTAAL
				</td><td colspan="2" align="right">
					&euro;
				</td><td className="totalInput">
					<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
						#RTrim(subTotaal)#
					<cfelseif !printView>
						<input type="text" name="subTotaal" value="#Trim(subTotaal)#">
					</cfif>
				</td></tr>

				<tr><td align="right" className="totalLabel">
				BTW-TARIEF
				</td><td colspan="2" style="text-align:right;white-space:nowrap;">
					<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
						<span>#RTrim(factuurBean.getVATRate())#&nbsp;%</span>
					&euro;
				</td><td className="totalInput">
		 	 			#RTrim(BTWBedrag)#

				</td></tr>

				<tr><td colspan="4">&nbsp;</td></tr>

				<tr><td align="right" className="totalLabel">
				<b>TOTAAL</b>
				</td><td colspan="2" align="right">
					&euro;
				</td><td className="totalInput total">
					<cfif printView OR !ListFindNoCase("nieuw,aangemaakt",factuurstatusName)>
						#RTrim(totaalBedragincBTW)#
					</cfif>
				</td></tr>

				<tr><td colspan="4">&nbsp;</td></tr>
			</table>*/}
			</div>

			{/* FOOTER */}
			<div className={styles.footerFrame}>
				<div className={styles.betaaltermijn}>
					U wordt verzocht het bedrag binnen
					{props.userSettings.paymentTerm}
					dagen over te maken op het onderstaande rekeningnummer:
					<div className={styles.userRekening}>
						<span>{props.usersCompany.bankAccountNr}</span>{" "}
						<span>T.n.v. {props.usersCompany.bankAccountName}</span>
						<span>{props.usersCompany.bankAccountCity}</span>
					</div>
				</div>

				<div className={styles.leveringsvoorwaarden}>{props.userSettings.deliveryConditions}</div>
			</div>
		</div>
	);
};

export { InvoicePrint };
