import Container from "../components/Container";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../app/features/Cart";
import { useCheckCouponValidity } from "../app/apiCalls/couponsCalls";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPaymentButton from "../helpers/PaypalPaymentButton";
import { Link, useNavigate } from "react-router-dom";
import { RiLock2Fill } from "react-icons/ri";
import { useGetAdresses } from "../app/apiCalls/userCalls";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const navigate = useNavigate();

  const {
    removeProductFromCart,
    clearCart,
    quantityCounter,
    applyCouponCode,
    disapplyCouponCode,
    changeShippingAdress,
  } = cartActions;

  const [couponCode, setCouponCode] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const {
    mutateAsync: checkCouponAsync,
    isPending: isCheckCouponLoading,
  } = useCheckCouponValidity();

  const {
    data: defaultAdresseData,
    isPending: isdefaultAdresseLoading,
  } = useGetAdresses(user?.accessToken, true, user?.id);

  const { data: userAdresses } = useGetAdresses(
    user?.accessToken,
    "",
    user?.id
  );

  useEffect(() => {
    if (isdefaultAdresseLoading || cart.shippingAdress) return;

    const defaultAddress = defaultAdresseData?.data?.data;
    if (defaultAddress) {
      dispatch(changeShippingAdress(defaultAddress));
    }
  }, [
    cart.shippingAdress,
    defaultAdresseData,
    dispatch,
    isdefaultAdresseLoading,
    changeShippingAdress,
  ]);

  const shippingAdress = cart.shippingAdress;

  const handleCheckCouponCode = async () => {
    if (couponCode !== "" && cart.couponCode == null) {
      try {
        const isCouponCodeValid = await checkCouponAsync({ couponCode });

        const couponData = isCouponCodeValid.data?.data;
        if (cart.totalPrice >= couponData.minimumPurchase) {
          dispatch(applyCouponCode(couponData));
          toast.success("Coupon Applied Successfully");
        } else {
          toast.error("Minimum purchase not met");
        }
      } catch (e) {
        toast.error("Coupon Code Not Valid!");
      }
    }

    if (cart.couponCode !== null) {
      dispatch(disapplyCouponCode());
      toast.success("Coupon Disapplied Successfully");
      setCouponCode("");
    }
  };

  // const initialOptions = {
  //   "client-id": "test",
  //   "enable-funding": "venmo",
  //   "disable-funding": "",
  //   country: "US",
  //   currency: "USD",
  //   "data-page-type": "product-details",
  //   components: "buttons",
  //   "data-sdk-integration-source": "developer-studio",
  // };

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // console.log("cart.cartItems", cart.cartItems);
  // console.log("shippingAdress", shippingAdress);

  let amount = {
    currency_code: "USD",
    value: cart.subTotal.toFixed(2).toString(),
  };

  // const formattedCartItems = cart.cartItems.map((item) => {
  //   const itemAmount = (item?.newPrice || item.price) * item.userQuantity;
  //   amount.value = (parseFloat(amount.value) + itemAmount)
  //     .toFixed(2)
  //     .toString();
  //   return {
  //     name: item.title.split(" ").slice(0, 3).join(" "),
  //     quantity: item.userQuantity,
  //     unit_amount: {
  //       currency_code: "USD",
  //       value: (item?.newPrice || item.price).toFixed(2).toString(),
  //     },
  //   };
  // });

  // amount.breakdown.item_total.value = amount.value;

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
          <Container>
            <div className="py-10">
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-white text-4xl tracking-tight">
                  Cart{" "}
                </h1>
              </div>
              <p className="text-white font-light">{t("Manage your cart.")}</p>
            </div>
          </Container>
        </div>
        <div className="my-10 relative">
          {showModel && (
            <div
              onClick={(e) => {
                if (e.target.classList.contains("overlay")) {
                  setShowModel(false);
                }
              }}
              className="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <div className="bg-white p-5 rounded-sm shadow-lg relative max-w-md w-full">
                <button
                  onClick={() => setShowModel(false)}
                  className="absolute top-2 right-2 text-black text-3xl"
                >
                  &times;
                </button>
                <h1 className="text-black mb-4 text-lg">Shipping Address</h1>
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                  {userAdresses?.data?.data?.addresses?.map((address, i) => (
                    <>
                      <div
                        key={address._id}
                        className={`border p-4 rounded flex justify-between items-center cursor-pointer ${
                          shippingAdress?._id === address._id &&
                          "border-primary"
                        }`}
                        onClick={() => {
                          dispatch(changeShippingAdress(address));
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{address.fullName}</p>
                            {address.isDefault && (
                              <span className="bg-primary px-1 py-[0.1rem] text-white rounded-sm text-xs">
                                Default
                              </span>
                            )}
                          </div>
                          <p>
                            {address.street}, {address.city}, {address.state},{" "}
                            {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                          <p>+{address.phoneNumber}</p>
                        </div>
                      </div>
                      {userAdresses?.data?.data?.addresses?.length - 1 === i && (
                        <Link to={"/userAdresses"}>
                          <button className="bg-primary text-white p-2 rounded w-full text-center mt-4">
                            Add New Address
                          </button>
                        </Link>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Container>
            <div
              className="grid gap-5"
              style={{ gridTemplateColumns: "70% 30%" }}
            >
              <div>
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between border-b p-5">
                    <div className="text-lg">
                      {cart.productsAddedToCart} Items in your Cart
                    </div>
                    <div
                      className="bg-secondary text-white p-2 text-sm rounded-sm cursor-pointer"
                      onClick={() => {
                        dispatch(clearCart());
                      }}
                    >
                      {t("clearCart")}
                    </div>
                  </div>
                  {cart.productsAddedToCart === 0 && (
                    <div className="flex items-center flex-col justify-center p-[50px]">
                      <img
                        src="https://assets.pharmeasy.in/web-assets/images/emptyCart.png?dim=96x96&q=75"
                        alt=""
                        className="w-[10%]"
                      />
                      <div className="text-center text-gray-400 m-5">
                        Your Medicare cart is empty!
                      </div>
                    </div>
                  )}
                  {cart.productsAddedToCart !== 0 && (
                    <div>
                      {cart?.cartItems?.map((item) => {
                        const {
                          _id,
                          title,
                          price,
                          newPrice,
                          discountInfo,
                          userQuantity,
                          image,
                          categoryInfo,
                        } = item;
                        return (
                          <div
                            key={_id}
                            className="p-5 grid items-center gap-10 border-b"
                            style={{ gridTemplateColumns: "auto 1fr auto" }}
                          >
                            <div className="flex items-center">
                              <img
                                src={image?.url}
                                alt="img"
                                className="w-20 h-20 object-contain"
                              />
                            </div>

                            <div>
                              <span className="block">
                                {categoryInfo?.title}
                              </span>
                              <h3>{title}</h3>
                              {discountInfo ? (
                                <div className="flex items-center gap-2 ">
                                  <span className="text-sm text-gray-400 line-through">
                                    {price?.toFixed(2)} DH
                                  </span>
                                  <h2 className="text-secondary font-bold text-xl">
                                    {newPrice?.toFixed(2)} DH
                                  </h2>
                                </div>
                              ) : (
                                <h2 className="text-secondary font-bold text-xl">
                                  {price?.toFixed(2)} DH
                                </h2>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-5">
                              <div className="flex items-center gap-2">
                                <div className="border flex items-center gap-5 rounded-sm">
                                  <div
                                    className="border-r px-3 py-2 cursor-pointer"
                                    onClick={() => {
                                      dispatch(
                                        quantityCounter({
                                          type: "INCREASE",
                                          _id,
                                        })
                                      );
                                    }}
                                  >
                                    +
                                  </div>
                                  <div className="text-center">
                                    {userQuantity}
                                  </div>
                                  <div
                                    className="border-l px-3 py-2 cursor-pointer"
                                    onClick={() => {
                                      dispatch(
                                        quantityCounter(
                                          // type: "DESCREASE",
                                          {
                                            type: "DECREASE",
                                            _id,
                                            // item,
                                          }
                                          // item,
                                          // "DESCREASE"
                                        )
                                      );
                                    }}
                                  >
                                    -
                                  </div>
                                </div>
                              </div>
                              <div
                                className="cursor-pointer bg-secondary p-2 rounded-full bg-opacity-5"
                                onClick={() => {
                                  dispatch(removeProductFromCart(_id));
                                }}
                              >
                                {/* <MdOutlineDeleteOutline className="text-xl" /> */}
                                {/* <IoClose className="text-white text-xl" /> */}
                                <MdDelete className="text-xl text-red-500" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="border rounded-lg p-5 h-fit">
                  <h2 className="text-xl">{t("ApplyCoupon")}</h2>
                  <p className="text-sm text-gray-500">{t("PromoCode")}</p>
                  <div className="mt-10 flex items-center justify-between gap-5">
                    <input
                      className={`border p-2 focus:outline-none rounded-sm placeholder:text-sm text-sm w-full ${
                        cart.couponCode !== null && "text-gray-400"
                      }`}
                      disabled={cart.couponCode !== null ? true : false}
                      type="text"
                      placeholder="Coupon Code"
                      value={
                        cart.couponCode !== null ? cart.couponCode : couponCode
                      }
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                      }}
                    />
                    <button
                      className={`bg-secondary px-5 py-2 text-white text-mdP rounded-sm ${
                        isCheckCouponLoading && "cursor-not-allowed"
                      }`}
                      disabled={isCheckCouponLoading}
                      onClick={() => {
                        handleCheckCouponCode();
                      }}
                    >
                      {isCheckCouponLoading ? (
                        <FiLoader className="animate-spin font-semibold text-md text-center w-full" />
                      ) : cart.couponCode !== null ? (
                        t("cancel")
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                </div>
                {user && (
                  <div className="border rounded-lg p-5 h-fit mt-5">
                    <h2 className="text-xl">{t("shippingAddress")}</h2>
                    <p className="text-sm text-gray-500">
                      {t("chooseAddress")}
                    </p>
                    {userAdresses?.data?.data?.addresses?.length > 0 ? (
                      <div className="mt-10 flex items-center gap-3">
                        <div className="flex-1">
                          <div>
                            <span className="font-bold mr-2">
                              {shippingAdress?.fullName}
                            </span>
                            <span>+{shippingAdress?.phoneNumber}</span>
                          </div>
                          <div>
                            <div>{shippingAdress?.street}</div>
                            <div>
                              {shippingAdress?.city}, {shippingAdress?.state},{" "}
                              {shippingAdress?.country},{" "}
                              {shippingAdress?.zipCode}
                            </div>
                          </div>
                        </div>
                        <div
                          className="underline text-secondary cursor-pointer"
                          onClick={() => {
                            setShowModel(!showModel);
                          }}
                        >
                          {t("change")}
                        </div>
                      </div>
                    ) : (
                      <span className="my-10 text-center text-sm block text-gray-500">
                        {t("noAddress")} ,{" "}
                        <span className="underline text-secondary">
                          <Link to={"/userAdresses"}>{t("addNewAddress")}</Link>
                        </span>
                      </span>
                    )}
                  </div>
                )}
                <div className="border rounded-lg h-fit col-start-2 row-start-2 mt-5">
                  <h2 className="text-xl p-5 border-b">{t("summary")}</h2>
                  <div className="p-5 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-md">{t("subtotal")}</span>
                      <span className="text-md font-semibold">
                        MAD {cart.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-md">Total Shipping</span>
                      <span className="text-md font-semibold">FREE</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-md">Saved</span>
                      <span className="text-md font-semibold text-red-600">
                        -MAD {cart.discount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="">
                    <div>
                      <div className="flex items-center justify-between mt-2 p-5">
                        <span className="text-md">{t("total")}</span>
                        <span className="text-lg font-semibold">
                          MAD {cart.subTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  {isCheckout &&
                  userAdresses?.data?.data?.addresses?.length > 0 ? (
                    <div className="my-5">
                      {/* <StripeCheckoutButton
                        userId={user?.id}
                        cartItems={cart?.cartItems}
                        // shippingAdress={shippingAdress}
                        // amount={amount}
                      /> */}
                      <PaypalPaymentButton
                        // cartItems={cart?.cartItems}
                        // shippingAdress={shippingAdress}
                        amount={amount}
                        // totalPrice={cart.subTotal}
                        cart={cart}
                      />
                    </div>
                  ) : (
                    <button
                      className="bg-secondary text-white mt-5 w-full p-2 rounded-sm flex items-center gap-2 justify-center"
                      onClick={() => {
                        if (!user) {
                          navigate("/auth/login");
                        }
                        if (
                          user &&
                          userAdresses?.data?.data?.addresses?.length === 0
                        ) {
                          toast.error("You need to add at least one adresse!");
                        }
                        if (cart.productsAddedToCart !== 0 && user) {
                          setIsCheckout(true);
                        }
                        if (cart.productsAddedToCart == 0) {
                          toast("Cart is Empty!");
                        }
                        // console.log(cart.cartItems);
                      }}
                    >
                      <RiLock2Fill />
                      {!user ? t("loginTocheckout") : t("ProceedToCheckout")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default Cart;
