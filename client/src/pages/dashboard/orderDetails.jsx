import Container from "../../components/Container";
import { useSelector } from "react-redux";
import {
  useGetOrderDetails,
  useConfirmOrderMutation,
} from "../../app/apiCalls/ordersCalls";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const queryClient = useQueryClient();

  const user = useSelector((state) => state.user.userInfo);

  const { data: orderDetails } = useGetOrderDetails(
    user?.accessToken,
    orderId,
    user?.id
  );

  const {
    mutateAsync: mutateConfirmOrderAsync,
    isPending: isConfirmOrderLoading,
  } = useConfirmOrderMutation(user?.accessToken);

  const order = orderDetails?.data?.data;
  const orderItems = order?.orderItems;
  const shippingAdress = order?.shipping;
  const orderUser = order?.userInfo;

  const handleConfirmOrder = async () => {
    try {
      await mutateConfirmOrderAsync(orderId);
      toast.success("Order confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not confirm the order."
      );
    }
  };

  return (
    <div className="bg-[#F6F8FB] relative w-full min-h-screen">
      <Container>
        <div className="py-[30px]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-black tracking-tighter">
              Order{" "}
              <span className="font-bold text-secondary">
                #{order?._id?.substring(0, 8)}
              </span>
            </h1>
            <button
              className={`bg-secondary text-white p-2 rounded-sm text-xs flex items-center gap-2 ${
                (order?.deliveryStatus === "DELIVERED" ||
                  order?.paymentStatus !== "PAID") &&
                "cursor-not-allowed opacity-70"
              }`}
              onClick={() => {
                handleConfirmOrder();
              }}
              disabled={
                order?.deliveryStatus === "DELIVERED" ||
                order?.paymentStatus !== "PAID" ||
                isConfirmOrderLoading
              }
              title={
                order?.paymentStatus !== "PAID"
                  ? "Only paid orders can be confirmed"
                  : undefined
              }
            >
              {order?.deliveryStatus === "DELIVERED" ? (
                "Confirmed"
              ) : order?.paymentStatus !== "PAID" ? (
                "Awaiting payment"
              ) : (
                <>
                  <FaCheck />
                  Confirm Order
                </>
              )}
            </button>
          </div>
          <div
            className="my-20 grid gap-5"
            style={{ gridTemplateColumns: "80% 20%" }}
          >
            <div>
              <div className="flex items-center justify-between text-sm text-gray-500 pb-3 border-b text-center">
                <div className="flex-1 text-left">ITEM</div>
                <div className="flex-1">QUANTITY</div>
                <div className="flex-1">PRICE (DHs)</div>
                <div className="flex-1">AMOUNT</div>
              </div>
              <div>
                {orderItems?.map((item) => {
                  const { _id, title = "title", quantity, price } = item;
                  return (
                    <div
                      className="flex items-center justify-between text-center text-sm border-b py-5"
                      key={_id}
                    >
                      <div className="flex-1 text-left">{title}</div>
                      <div className="flex-1">{quantity}</div>
                      <div className="flex-1">{price}</div>
                      <div className="flex-1">
                        {(quantity * price).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
                <div>
                  <div className="flex items-center justify-between text-center text-sm border-b py-5">
                    <div className="flex-1 text-left">Subtotal</div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1 text-xl">
                      {order?.subTotal?.toFixed(2)} DHs
                    </div>
                  </div>
                  {order?.discount && (
                    <div className="flex items-center justify-between text-center text-sm border-b py-5">
                      <div className="flex-1 text-left">Discount</div>
                      <div className="flex-1"></div>
                      <div className="flex-1"></div>
                      <div className="flex-1 text-xl">
                        - {order?.discount?.toFixed(2)} DHs
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-center text-sm border-b py-5">
                    <div className="flex-1 text-left">Total</div>
                    <div className="flex-1"></div>
                    <div className="flex-1"></div>
                    <div className="flex-1 text-xl">
                      {order?.totalPrice?.toFixed(2)} DHs
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className="uppercase font-bold">shipping adress</div>
                <div className="my-2 text-sm">
                  <span>{shippingAdress?.fullName || "—"}</span>
                  <span className="ml-5">
                    {shippingAdress?.phoneNumber
                      ? `+${shippingAdress.phoneNumber}`
                      : "—"}
                  </span>
                  <div>
                    <p>
                      {shippingAdress?.street}, {shippingAdress?.city},{" "}
                      {shippingAdress?.state}, {shippingAdress?.zipCode}
                    </p>
                    <p>{shippingAdress?.country}</p>
                  </div>
                </div>
              </div>
              <div className="my-10">
                <div className="uppercase font-bold">order by</div>
                <div className="my-2 text-sm">
                  <div>
                    {orderUser?.firstName || "—"} {orderUser?.lastName || ""}
                  </div>
                  <div>{orderUser?.email || "—"}</div>
                  <div>
                    {orderUser?.phoneNumber?.number
                      ? `+${orderUser.phoneNumber.number}`
                      : "—"}
                  </div>
                </div>
              </div>
              <div className="my-10">
                <div className="uppercase font-bold">payment method</div>
                <img
                  src="https://www.pharmacy2u.co.uk/_next/image?url=%2Fpayment-providers%2Fpaypal.png&w=96&q=75"
                  alt="paypal"
                  className="w-[70px] mt-2"
                />
              </div>
              {/* <div className="my-10">
                <div className="uppercase font-bold">Subtotal</div>
                <div className="text-2xl font-normal tracking-tight">
                  {order?.subTotal?.toFixed(2)}{" "}
                  <span className="text-sm ml-1">DHs</span>
                </div>
              </div>
              <div className="my-10">
                <div className="uppercase font-bold">total</div>
                <div className="text-2xl font-normal tracking-tight">
                  {order?.totalPrice?.toFixed(2)}{" "}
                  <span className="text-sm ml-1">DHs</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderDetails;
