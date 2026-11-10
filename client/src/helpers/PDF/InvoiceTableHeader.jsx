import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#34B34C";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#34B34C",
    backgroundColor: "#34B34C",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    textAlign: "center",
    fontStyle: "bold",
    flexGrow: 1,
  },
  description: {
    width: "60%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    color: "white",
  },
  qty: {
    width: "10%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    color: "white",
  },
  rate: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    color: "white",
  },
  amount: {
    width: "15%",
    color: "white",
  },
});

const InvoiceTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.description}>Item Title</Text>
    <Text style={styles.qty}>Qty</Text>
    <Text style={styles.rate}>Price</Text>
    <Text style={styles.amount}>Amount</Text>
  </View>
);

export default InvoiceTableHeader;
