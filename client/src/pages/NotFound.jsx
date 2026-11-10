import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const NotFound = () => {
  return (
    <div className=" w-full h-[100vh]">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-extrabold text-[10rem] tracking-tight text-secondary">
            404
          </h1>
          <p className="text-secondary mt-[-30px] text-md text-center">
            The page you are looking for was moved, removed renamed or might
            never existed
          </p>
          <Link to={"/"} className="flex items-center justify-center">
            <button className="bg-primary text-white mt-10 flex items-center text-md gap-2 cursor-pointer px-3 py-3 rounded-sm">
              <MdKeyboardBackspace />
              Back To Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
