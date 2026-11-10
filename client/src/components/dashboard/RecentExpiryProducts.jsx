import ExpiryItem from "./ExpiryItem";
import { Table } from "./Table";

const RecentExpiryProducts = ({ data }) => {
  return (
    <Table
      columnsData={["Medecine Name", "Expire Date", "Quantity", "View More"]}
    >
      {data.map((element) => {
        const { _id, title, quantity, expiredAt } = element;
        return (
          <ExpiryItem
            key={_id}
            medecineName={title}
            expiryDate={new Date(expiredAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            quantity={quantity}
          />
        );
      })}
    </Table>
  );
};

export default RecentExpiryProducts;
