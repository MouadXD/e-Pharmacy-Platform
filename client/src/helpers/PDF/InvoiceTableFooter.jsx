import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#34B34C";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#34B34C",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontSize: 12,
    fontStyle: "bold",
  },
  description: {
    width: "85%",
    textAlign: "right",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: "15%",
    textAlign: "right",
    paddingRight: 8,
  },
});

const InvoiceTableFooter = ({ invoice }) => {
  // const total = items
  //   .map((item) => item.qty * item.rate)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const { subTotal = 100, total = 100, discount = 0 } = invoice;
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.description}>SUBTOTAL</Text>
        <Text style={styles.total}>
          {Number.parseFloat(subTotal).toFixed(2)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>SHIPPING</Text>
        <Text style={styles.total}>FREE</Text>
      </View>
      {discount !== 0 && (
        <View style={styles.row}>
          <Text style={styles.description}>DISCOUNT</Text>
          <Text style={styles.total}>
            - {Number.parseFloat(discount).toFixed(2)}
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <Text style={styles.description}>TOTAL</Text>
        <Text style={styles.total}>{Number.parseFloat(total).toFixed(2)}</Text>
      </View>
    </>
  );
};

export default InvoiceTableFooter;
