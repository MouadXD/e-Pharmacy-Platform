const Table = ({ fields, children }) => {
  return (
    <div className="shadow-sm">
      <div className=" mt-5">
        <div className="flex items-center justify-between border-gray-200 border rounded-t-md p-5 bg-gray-50 text-black px-5">
          {fields.map((field, i) => {
            return (
              <div className={`flex-1 text-center text-[0.9rem]`} key={i}>
                {field}
              </div>
            );
          })}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Table;
