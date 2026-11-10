import Axios from "axios";
import safeJsonParse from "../helpers/safeJsonParse";

const getAccessToken = () =>
  safeJsonParse(localStorage.getItem("user"), null)?.accessToken;

const StripeCheckoutButton = ({ cartItems, userId }) => {
  const BASE = "http://localhost:8000/api/v1";

  const newCartItems = cartItems.map((item) => {
    return {
      price_data: {
        currency: "mad",
        product_data: {
          name: item.title,
          images: [
            "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp",
          ],
        },
        // unit_amount: item?.newPrice || item.price,
        unit_amount: Math.round((item?.newPrice || item.price) * 100),
      },
      quantity: item.userQuantity,
    };
  });

  const handleStripeCheckout = async () => {
    try {
      const token = getAccessToken();
      const checkoutURL = await Axios.post(
        BASE + "/stripe/create-checkout-session",
        {
          cart: newCartItems,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (checkoutURL.data?.url) {
        window.location.href = checkoutURL.data?.url;
      }
    } catch {
      // Keep the checkout failure silent; the payment provider shows its own state.
    }
  };

  return (
    <button
      className="my-3 bg-[#675dff] text-white w-full py-3 rounded-sm cursor-pointer hover:bg-[#6055ff]"
      onClick={handleStripeCheckout}
    >
      <div className="flex gap-2 justify-center items-center w-full">
        <div>
          <svg
            viewBox="0 0 60 25"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="25"
            className="UserLogo variant-- "
          >
            <title>Stripe logo</title>
            <path
              fill="white"
              d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"
              fillRule="evenodd"
            ></path>
          </svg>
          {/* <svg
            class="ProductIcon "
            width="20"
            height="20"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.54 4h-19.7c-.84 0-1.63.43-2.09 1.14a2.52 2.52 0 0 0-.18 2.39l5.1 11.46c.3.64.3 1.38 0 2.02L8 36h23.54c.97 0 1.86-.58 2.26-1.48l5.98-13.5c.3-.65.3-1.39 0-2.04L33.8 5.48A2.48 2.48 0 0 0 31.54 4z"
              fill="#96F"
            ></path>
            <path
              d="M7.23 36a2.3 2.3 0 0 1-.98-.22h.04a2.43 2.43 0 0 1-1.23-1.23L.22 23.53a2.54 2.54 0 0 1 .17-2.38A2.45 2.45 0 0 1 2.46 20h19.5c.97 0 1.84.57 2.23 1.46l4.8 10.85.68 1.53c.1.22.23.42.38.6.49.64 1.2 1.3 1.98 1.51-.11.03-.3.05-.55.05H7.22z"
              fill="url(#product-icon-checkout-ProductHeroCaption-a)"
            ></path>
            <path
              d="M21.97 20c.9 0 1.72.5 2.14 1.3l.08.16 4.8 10.85.68 1.53a4.43 4.43 0 0 0 2.3 2.01l.18.07c-.2.05-.4.08-.61.08H8L14.67 21c.15-.32.22-.66.22-1.01h7.08z"
              fill="url(#product-icon-checkout-ProductHeroCaption-b)"
            ></path>
            <defs>
              <linearGradient
                id="product-icon-checkout-ProductHeroCaption-a"
                x1="16.01"
                y1="35.59"
                x2="16.01"
                y2="21.16"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#21CFE0"></stop>
                <stop offset=".17" stop-color="#20D1E0"></stop>
                <stop offset=".38" stop-color="#18E2E2"></stop>
                <stop offset=".61" stop-color="#13ECE3"></stop>
                <stop offset="1" stop-color="#11EFE3"></stop>
              </linearGradient>
              <linearGradient
                id="product-icon-checkout-ProductHeroCaption-b"
                x1="21.07"
                y1="43"
                x2="21.07"
                y2="14.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0048E5"></stop>
                <stop offset="1" stop-color="#9B66FF"></stop>
              </linearGradient>
            </defs>
          </svg> */}
        </div>
        <span className="text-white text-sm">Checkout</span>
      </div>
    </button>
  );
};

export default StripeCheckoutButton;
