import Container from "../components/Container";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaShop } from "react-icons/fa6";
import { RiAccountCircleFill } from "react-icons/ri";
import { PiPackageFill } from "react-icons/pi";

export const CheckoutSuccess = () => {
  return (
    <div className="py-10 h-[100vh]">
      <Container>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <FaRegCircleCheck className="text-[#2dc866] text-5xl" />
            {/* <h1 className="my-2 text-2xl">Payment Successful</h1> */}
            <h1 className="my-2 text-4xl font-bold tracking-tight">
              Payment successful
            </h1>
            <p className="text-gray-500">
              Your order has been confirmed and is now being processed. Thank
              you for shopping with us!
            </p>
            <div className="flex items-center gap-4">
              <Link to={"/userOrders"}>
                <button className="my-5 bg-primary text-white px-3 py-3 rounded-sm text-sm w-[200px] flex items-center gap-3 justify-center">
                  {/* <RiAccountCircleFill className="text-[1rem]" /> */}
                  <PiPackageFill className="text-[1rem]" />
                  View Order!
                </button>
              </Link>
              <Link to={"/"}>
                <button className="my-5 bg-primary bg-opacity-10 text-primary px-3 py-3 rounded-sm text-sm w-[200px] flex items-center gap-3 justify-center">
                  <FaShop className="text-[1rem]" />
                  Back To Shopping!
                </button>
              </Link>
            </div>
            {/* <div className="my-5 border bg-[#f6f7f8] bg-opacity-90 w-[500px] px-4 text-left py-4 flex items-center justify-between">
              <div className="font-semibold">
                <div className="my-1 tracking-tight text-lg">Order Number</div>
                <div className="my-1 tracking-tight text-lg">Date</div>
                <div className="my-1 tracking-tight text-lg">
                  Payment Method
                </div>
                <div className="my-1 tracking-tight text-lg">Name</div>
                <div className="my-1 tracking-tight text-lg">Adress</div>
                <div className="my-1 tracking-tight text-lg">Phone</div>
              </div>
              <div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
              </div>
            </div> */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export const CheckoutFailure = () => {
  return (
    <div className="py-10 h-[100vh]">
      <Container>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full flex flex-col items-center">
            <FaTimesCircle className="text-red-600 text-5xl" />
            {/* <h1 className="my-2 text-2xl">Payment Successful</h1> */}
            <h1 className="my-2 text-4xl font-bold tracking-tight">
              Payment failed
            </h1>
            <p className="text-gray-500">
              Payment failed due to insufficient funds. Please try again or
              contact your bank!
            </p>
            <Link to={"/"}>
              <button className="my-5 bg-primary text-white px-3 py-3 rounded-sm text-sm w-[200px] flex items-center gap-3 justify-center">
                <FaShop className="" />
                Back To Shopping!
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
