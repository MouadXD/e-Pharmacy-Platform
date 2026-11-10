export const Table = ({ columnsData, children }) => {
  return (
    <table
      className="table-auto w-[100%] bg-white rounded-xs text-center"
      style={{
        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
        border: "1px solid rgba(101,109,119,.16)",
      }}
    >
      <thead className="border text-md">
        <tr>
          {columnsData.map((element, i) => {
            return (
              <th className="p-4" key={i}>
                {element}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="text-sm">{children}</tbody>
    </table>
  );
};
