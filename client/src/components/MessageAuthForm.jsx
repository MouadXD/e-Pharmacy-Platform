import { IoIosWarning } from "react-icons/io";
import { MdDoneOutline } from "react-icons/md";

const MessageAuthForm = ({ message = "", isError = true }) => {
  return (
    <div
      className={`${
        isError ? "bg-red-500" : "bg-primary"
      } w-full p-4 rounded text-white flex items-center gap-2 text-lmd`}
    >
      {isError ? <IoIosWarning /> : <MdDoneOutline />}
      {message}
    </div>
  );
};

export default MessageAuthForm;
