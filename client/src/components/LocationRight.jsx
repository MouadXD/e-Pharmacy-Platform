import { FaAngleRight } from "react-icons/fa";
import { Fragment } from "react";

const LocationRight = ({ list }) => {
  return (
    <div className="flex items-center gap-1">
      {list.map((element, i) => {
        if (i != list.length - 1) {
          return (
            <Fragment key={i}>
              <span className="font-bold text-[1.5rem] text-gray-500 tracking-tight">
                {element}
              </span>
              <FaAngleRight className="text-sm text-secondary" />
            </Fragment>
          );
        }
      })}
      <div className="font-bold text-[1.5rem] text-secondary tracking-tight">
        {list[list.length - 1]}
      </div>
    </div>
  );
};

export default LocationRight;
