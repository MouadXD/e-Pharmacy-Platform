import { useParams } from "react-router-dom";
import Container from "../components/Container";
import { useGetOrderDetails } from "../app/apiCalls/userCalls";
import { useSelector } from "react-redux";
import InvoicePDF from "../components/InvoicePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Loader from "../components/Loader";
import { HiDownload } from "react-icons/hi";
import { useState } from "react";

const OrderInfo = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.user.userInfo);
  const [isPDFGenerated, setIsPDFGenerated] = useState(false);

  const { data, isLoading } = useGetOrderDetails(
    user?.accessToken,
    id,
    user?.id
  );

  const orderData = data?.data?.data;

  const formatedItems = orderData?.orderItems?.map((item) => {
    return {
      sno: item?._id,
      desc: `${item?.title?.substring(0, 40)}...`,
      qty: item?.quantity,
      rate: item?.price,
    };
  });

  const convertToHumanRedableDate = (date) => {
    const newDate = new Date(date);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return newDate.toLocaleDateString("en-US", options);
  };

  const invoiceData = {
    id: orderData?._id,
    invoice_no: orderData?._id?.substring(0, 10),
    balance: `$ ${orderData?.totalPrice?.toFixed(2)}`,
    fullName: orderData?.shipping?.fullName || "—",
    email: user?.email,
    phone: orderData?.shipping?.phoneNumber
      ? `+${orderData.shipping.phoneNumber}`
      : "—",
    address: `${orderData?.shipping?.street}, ${orderData?.shipping?.city}, ${orderData?.shipping?.state}, ${orderData?.shipping?.zipCode}, ${orderData?.shipping?.country}`,
    trans_date: `${convertToHumanRedableDate(orderData?.createdAt)}`,
    due_date: "2019-10-12",
    items: formatedItems,
    subTotal: orderData?.subTotal?.toFixed(2),
    total: orderData?.totalPrice?.toFixed(2),
    discount: orderData?.discount?.toFixed(2),
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="my-10">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-black tracking-tighter">
              Order{" "}
              <span className="font-bold text-secondary">
                #{id.substring(0, 8)}
              </span>
            </h1>
            <div className="flex items-center gap-2 my-2">
              <span
                className={`${
                  orderData?.deliveryStatus === "PENDING"
                    ? "bg-yellow-500 text-yellow-500"
                    : "bg-green-500 text-green-500"
                } px-2 py-1 rounded-sm bg-opacity-5 text-xs`}
              >
                {orderData?.deliveryStatus === "PENDING"
                  ? "Delivery Pending"
                  : "Delevired"}
              </span>
              {/* <span className="text-gray-500 text-sm my-2 block">
            January 8, 2024 at 9:48 PM
          </span> */}
            </div>
          </div>

          {!isPDFGenerated && (
            <button
              className="bg-secondary text-white px-3 py-2 flex items-center gap-2 text-xs rounded-full"
              onClick={() => {
                setIsPDFGenerated(true);
              }}
            >
              <HiDownload />
              Download Invoice
            </button>
          )}
          {isPDFGenerated && (
            <div>
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoiceData} />}
                fileName={`medicare-invoice-${orderData?._id?.substring(
                  0,
                  10
                )}.pdf`}
              >
                {({ loading }) => {
                  return loading ? (
                    <button className="bg-secondary text-white px-3 py-2 flex items-center gap-2 text-xs rounded-full bg-opacity-60">
                      Generating Invoice...
                    </button>
                  ) : (
                    <button className="bg-secondary text-white px-3 py-2 flex items-center gap-2 text-xs rounded-full">
                      <HiDownload />
                      Download Invoice
                    </button>
                  );
                }}
              </PDFDownloadLink>
            </div>
          )}
        </div>
        {/* <div
          className="my-10 grid gap-5"
          style={{ gridTemplateColumns: "1fr auto" }}
        > */}
        <div className="my-10">
          <div className="flex items-center justify-between text-sm text-gray-500 pb-3 border-b text-center">
            <div className="flex-1 text-left">ITEM</div>
            <div className="flex-1">QUANTITY</div>
            <div className="flex-1">PRICE (DHs)</div>
            <div className="flex-1">AMOUNT</div>
          </div>
          <div>
            {orderData?.orderItems?.map((item) => {
              const { _id, title = "title", quantity, price } = item;
              return (
                <>
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
                </>
              );
            })}
          </div>
        </div>
        <div className="my-20 ">
          <div className="text-secondary text-2xl tracking-tighter text-right">
            Subtotal{" "}
            <span className="ml-3 font-semibold ">
              {orderData?.subTotal?.toFixed(2)} DHs
            </span>
          </div>
          {orderData?.discount && (
            <div className="text-secondary text-2xl mt-2 tracking-tighter text-right">
              Discount{" "}
              <span className="ml-3 font-semibold ">
                - {orderData?.discount?.toFixed(2)} DHs
              </span>
            </div>
          )}
          <div className="text-secondary text-2xl mt-3 tracking-tighter text-right">
            Order Total{" "}
            <span className="ml-3 font-semibold ">
              {orderData?.totalPrice?.toFixed(2)} DHs
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OrderInfo;
