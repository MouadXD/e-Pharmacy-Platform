const ExpiryItem = ({ medecineName, expiryDate, quantity }) => {
  return (
    <tr style={{ borderBottom: "1px solid rgba(101,109,119,.16)" }}>
      <td className="p-4 font text-sm font-normal">{medecineName}</td>
      <td className="p-4 font-normal">{expiryDate}</td>
      <td className="p-4 font-normal">{quantity}</td>
      <td className="p-4 font-normal">tt</td>
    </tr>
  );
};

export default ExpiryItem;
