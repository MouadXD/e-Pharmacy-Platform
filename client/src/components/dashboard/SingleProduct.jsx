import { Link } from "react-router-dom";

const SingleProduct = ({ medName, medId, groupName, quantity }) => {
  return (
    <tr style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}>
      <td className="p-4 font font-normal">{medName}</td>
      <td className="p-4 font-normal">{medId}</td>
      <td className="p-4 font-normal">{groupName}</td>
      <td className="p-4 font-normal">{quantity}</td>
      <td className="p-4 font-normal underline">
        <Link to={`/dashboard/products/${medId}`}>View Full Detail</Link>
      </td>
    </tr>
  );
};

export default SingleProduct;
