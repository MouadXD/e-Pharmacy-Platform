import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Pagination = ({ next, previous, totalPages, currentPage, limit }) => {
  return (
    <div className="flex items-center justify-between py-5">
      <div>
        Showing {currentPage} - {limit} results of {totalPages}
      </div>
      <div className="flex items-center gap-4">
        {previous ? (
          <button className="bg-primary p-2 cursor-pointer rounded-sm">
            <FaAngleLeft className="text-white" />
          </button>
        ) : null}
        <div>Page {currentPage}</div>
        {next ? (
          <button className="bg-primary p-2 cursor-pointer rounded-sm">
            <FaAngleRight className="text-white" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Pagination;
