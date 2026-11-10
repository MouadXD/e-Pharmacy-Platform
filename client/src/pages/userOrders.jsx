import Container from "../components/Container";
import { useSelector } from "react-redux";
import { useGetUserOrders } from "../app/apiCalls/userCalls";
import { Link } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import Loader from "../components/Loader";

const UserOrders = () => {
  const user = useSelector((state) => state.user.userInfo);

  const {
    data: userOrders,
    isLoading: isUserOrdersLoading,
    isError: isUserOrdersError,
    error: userOrdersError,
  } = useGetUserOrders(user?.accessToken, user?.id);

  const convertToHumanRedableDate = (date) => {
    const newDate = new Date(date);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      //   timeZoneName: "short",
    };

    return newDate.toLocaleDateString("en-US", options);
  };

  if (isUserOrdersLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                Latest Orders{" "}
              </h1>
            </div>
            <p className="text-white font-light">Manage your orders.</p>
          </div>
        </Container>
      </div>
      <div className="min-h-screen my-10">
        <Container>
          {userOrders?.data?.data?.length > 0 ? (
            <div className="mb-8">
              <div className="flex items-center justify-between border-gray-200 border rounded-t-md p-5 bg-gray-100 text-black">
                <div className="flex-1 text-center text-[0.9rem]">Order ID</div>
                <div className="flex-1 text-center text-[0.9rem]">Products</div>
                <div className="flex-1 text-center text-[0.9rem]">Date</div>
                <div className="flex-1 text-center text-[0.9rem]">
                  Total (DHs)
                </div>
                <div className="flex-1 text-center text-[0.9rem]">
                  Delivery Status
                </div>
                <div className="flex-1 text-center text-[0.9rem]">Actions</div>
                {/* <div className="flex-1 text-center text-[0.9rem]">View</div> */}
              </div>
              {userOrders?.data?.data?.length > 0 &&
                userOrders?.data?.data?.map((order) => {
                  const {
                    _id,
                    createdAt,
                    orderItems,
                    totalPrice = 100,
                    deliveryStatus,
                  } = order;

                  const redableDate = convertToHumanRedableDate(createdAt);

                  return (
                    <div
                      className="flex items-center justify-between py-5 border-b border-r border-l"
                      key={_id}
                    >
                      <div className="flex-1 text-center text-[0.9rem]">
                        #{_id.substring(0, 8)}
                      </div>
                      <div className="flex-1 text-center text-[0.9rem]">
                        {orderItems[0]?.title?.substring(0, 50) ||
                          "Liveasy Wellness Calcium Magnesium Vitamin"}
                        ...
                      </div>
                      <div className="flex-1 text-center text-[0.9rem]">
                        {redableDate}
                      </div>
                      <div className="flex-1 text-center text-[0.9rem]">
                        {totalPrice.toFixed(2)}
                      </div>
                      <div className="flex-1 text-center text-[0.9rem] flex items-center gap-2 justify-center">
                        <span
                          className={`${
                            deliveryStatus === "PENDING"
                              ? "bg-yellow-500 text-yellow-500"
                              : "bg-primary text-primary"
                          } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                        >
                          {deliveryStatus === "PENDING"
                            ? "Pending"
                            : "Delivered"}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-center text-[0.9rem] ">
                        <Link to={`/userOrders/${_id}`}>
                          <button className="bg-secondary text-white px-4 py-2 text-sm rounded-full flex items-center gap-1">
                            <IoEye className="text-sm" />
                            View
                          </button>
                        </Link>
                        {/* <button className="bg-secondary rounded-full text-white text-xs p-2 ml-4 flex items-center gap-1">
                      <FaDownload className="text-md" />
                    </button> */}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <h3 className="text-md text-gray-500 font-light">No orders yet!</h3>
          )}
        </Container>
      </div>
    </>
  );
};

export default UserOrders;
