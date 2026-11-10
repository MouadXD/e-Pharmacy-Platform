import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import {
  useGetOrders,
  useConfirmOrderMutation,
} from "../../app/apiCalls/ordersCalls";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Table from "../../components/Table";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import isoToRedableDate from "../../helpers/isoToRedableDate";

const Orders = () => {
  const [page, setPage] = useState(1);

  const user = useSelector((state) => state.user.userInfo);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = useGetOrders(user?.accessToken, page);

  const { mutateAsync: confirmOrderAsync } = useConfirmOrderMutation(
    user?.accessToken
  );

  if (isOrdersLoading) {
    return <Loader />;
  }

  const paginationInfo = ordersData?.data?.pagination;

  // console.log("ordersData", ordersData);

  const handleConfirmOrder = async (id) => {
    try {
      await confirmOrderAsync(id);
      toast.success("Order confirmed successfully");
      refetchOrders();
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not confirm the order."
      );
    }
  };

  return (
    <div className="bg-[#F6F8FB] relative min-h-screen">
      <Container>
        <div className="py-[30px]">
          <div>
            <LocationRight list={["Orders"]} />
            <div className="text-sm">Explore all Orders.</div>
          </div>
        </div>
        <div className="">
          <Table
            fields={[
              "Number",
              "Customer Email",
              "Product",
              "Date",
              "Payment Status",
              "Deleviry Status",
              "Actions",
            ]}
          >
            {ordersData?.data?.data?.map((order) => {
              const {
                _id,
                orderItems,
                createdAt,
                paymentStatus,
                deliveryStatus = "PENDING",
                userInfo,
              } = order;
              return (
                <div
                  className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                  key={_id}
                >
                  <div className="flex-1 text-center">
                    #{_id.toString().substring(0, 8)}
                  </div>
                  <div className="flex-1 text-center">{userInfo?.email}</div>
                  <div className="flex-1 text-center">
                    {orderItems?.[0]?.title?.substring(0, 40) || "—"}...
                  </div>
                  <div className="flex-1 text-center">
                    {isoToRedableDate(createdAt)}
                  </div>
                  <div className="flex-1 text-center text-[0.9rem] flex items-center gap-2 justify-center">
                    <span
                      className={`${
                        paymentStatus === "PAID"
                          ? "bg-primary text-primary"
                          : "bg-yellow-500 text-yellow-500"
                      } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                    >
                      {paymentStatus === "PAID" ? "Paid" : "Not Paid"}
                    </span>
                  </div>
                  <div className="flex-1 text-center text-[0.9rem] flex items-center gap-2 justify-center">
                    <span
                      className={`${
                        deliveryStatus === "PENDING"
                          ? "bg-yellow-500 text-yellow-500"
                          : "bg-primary text-primary"
                      } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                    >
                      {deliveryStatus === "PENDING" ? "Pending" : "Delivered"}
                    </span>
                  </div>
                  <div className="flex-1 text-center flex items-center justify-center gap-3">
                    <Link to={`/dashboard/orders/${_id}`}>
                      <button className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white">
                        <FaEye />
                        View
                      </button>
                    </Link>
                    <button
                      className={`flex items-center gap-2 bg-blue-500 p-2 ${
                        (deliveryStatus === "DELIVERED" ||
                          paymentStatus !== "PAID") &&
                        "bg-opacity-50 cursor-not-allowed"
                      } rounded-sm text-white`}
                      disabled={
                        deliveryStatus === "DELIVERED" ||
                        paymentStatus !== "PAID"
                      }
                      title={
                        paymentStatus !== "PAID"
                          ? "Only paid orders can be confirmed"
                          : undefined
                      }
                      onClick={() => {
                        handleConfirmOrder(_id);
                      }}
                    >
                      {deliveryStatus === "DELIVERED" ? (
                        "Confirmed"
                      ) : paymentStatus !== "PAID" ? (
                        "Awaiting payment"
                      ) : (
                        <>
                          <FaCheck />
                          Confirm
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </Table>
        </div>
        <div className="flex items-center py-10 justify-end">
          {paginationInfo?.totalPages > 1 && page > 1 && (
            <div
              className="mr-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  setTimeout(() => {
                    refetchOrders();
                  }, 100);
                }
              }}
            >
              <GrFormPrevious />
            </div>
          )}
          {Array.from(
            { length: paginationInfo?.totalPages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <div
              key={pageNumber}
              className={`text-sm rounded-sm cursor-pointer w-[30px] h-[30px] flex items-center justify-center ${
                pageNumber === page ? "bg-secondary text-white" : ""
              }`}
              onClick={() => {
                setPage(pageNumber);
                setTimeout(() => {
                  refetchOrders();
                }, 100);
              }}
            >
              {pageNumber}
            </div>
          ))}
          {page !== paginationInfo?.totalPages && (
            <div
              className="ml-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
              onClick={() => {
                if (page < paginationInfo?.totalPages) {
                  setPage(page + 1);
                  setTimeout(() => {
                    refetchOrders();
                  }, 100);
                }
              }}
            >
              <MdNavigateNext />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Orders;
