const OrderItem = ({ customer, product, orderNumber, Date, Status }) => {
  let statusColor;
  switch (Status.toLowerCase()) {
    case "pending":
      statusColor = "bg-yellow-400";
      break;
    case "approved":
      statusColor = "bg-green-600";
      break;
    case "cancelled":
      statusColor = "bg-red-600";
      break;
  }
  return (
    <tr style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}>
      <td className="p-4 font text-sm font-normal">{customer}</td>
      <td className="p-4 font-normal">{product}</td>
      <td className="p-4 font-normal">{orderNumber}</td>
      <td className="p-4 font-normal">{Date}</td>
      <td className="p-4 font-normal flex items-center justify-center gap-2">
        <span className={`${statusColor} w-2 h-2 rounded-full block`}></span>
        <div>{Status}</div>
      </td>
      {/* <td className="p-4 font-sans">100DH</td> */}
    </tr>
  );
};

export default OrderItem;
