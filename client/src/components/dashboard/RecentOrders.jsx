import OrderItem from "./OrderItem";
import Table from "../Table";

const RecentOrders = ({ orders }) => {
  return (
    <Table
      columnsData={["Customer", "Product", "Order Number", "Date", "Status"]}
    >
      {orders.map((element, i) => {
        const { _id, orderItems, createdAt, paymentStatus } = element;
        return (
          <OrderItem
            key={_id}
            // customer={customer}
            product={orderItems[0]?.name || "product title"}
            orderNumber={_id?.substring(0, 8)}
            Date={createdAt}
            Status={paymentStatus}
          />
        );
      })}
    </Table>
  );
};

export default RecentOrders;
