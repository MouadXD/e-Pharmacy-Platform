import { Page, Document, Image, StyleSheet } from "@react-pdf/renderer";
import InvoiceTitle from "../helpers/PDF/InvoiceTitle";
import BillTo from "../helpers/PDF/BillTo";
import InvoiceNo from "../helpers/PDF/InvoiceNo";
import InvoiceItemsTable from "../helpers/PDF/InvoiceItemsTable";
import InvoiceThankYouMsg from "../helpers/PDF/InvoiceThankYouMsg";
import logo from "../../src/static/invoice_logo.png";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 150,
    // height: 74,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
const Invoice = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logo} src={logo} />
      {/* <InvoiceTitle title="Invoice" /> */}
      <InvoiceNo invoice={invoice} />
      <BillTo invoice={invoice} />
      <InvoiceItemsTable invoice={invoice} />
      <InvoiceThankYouMsg />
    </Page>
  </Document>
);

export default Invoice;
