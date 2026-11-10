import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PaypalPaymentButton = ({
  // cartItems,
  // shippingAdress,
  // amount,
  // totalPrice,
  cart,
  amount,
}) => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  const navigate = useNavigate();

  const BASE = "http://localhost:8000/api/v1";

  const cartItems = cart?.cartItems;
  const shippingAdress = cart?.shippingAdress;
  const subTotal = cart?.totalPrice;
  const total = cart?.subTotal;
  const discount = cart?.discount;
  const couponCode = cart?.couponCode;

  return (
    <>
      <PayPalButtons
      createOrder={async () => {
        try {
          const response = await fetch(`${BASE}/paypal/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.accessToken}`,
            },
            // use the "body" param to optionally pass additional order information
            // like product ids and quantities
            body: JSON.stringify({
              orderInfo: {
                cartItems,
                shippingAdress,
                amount,
                totalPrice: total,
                subTotal,
                discount,
                couponCode,
              },
              // purchase_units: [
              //   {
              //     items: cartItems,
              //     amount,
              //     shippingAdress,
              //     totalPrice: total,
              //     // shipping: {
              //     //   name: {
              //     //     full_name: shippingAdress?.fullName,
              //     //   },
              //     //   address: {
              //     //     address_line_1: shippingAdress?.street,
              //     //     postal_code: shippingAdress?.zipCode,
              //     //     admin_area_2: shippingAdress?.city,
              //     //     country_code: shippingAdress?.country
              //     //       ?.substring(0, 2)
              //     //       .toUpperCase(),
              //     //   },
              //     // },
              //   },
              // ],
            }),
          });

          const orderData = await response.json();

          if (orderData.id) {
            return orderData.id;
          } else {
            navigate("/checkout/failure");
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error(error);
          setMessage(`Could not initiate PayPal Checkout...${error}`);
        }
      }}
      onApprove={async (data, actions) => {
        try {
          const response = await fetch(
            `${BASE}/paypal/orders/${data.orderID}/capture`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }
          );

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            navigate("/checkout/failure");
            return actions.restart();
          } else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            navigate("/checkout/failure");
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`
            );
          } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            const transaction =
              orderData.purchase_units[0].payments.captures[0];
            setMessage(`Transaction ${transaction.status} completed.`);
            navigate("/checkout/success");
          }
        } catch (error) {
          console.error(error);
          setMessage(
            `Sorry, your transaction could not be processed...${error}`
          );
        }
      }}
      />
      {message && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </>
  );
};

export default PaypalPaymentButton;
