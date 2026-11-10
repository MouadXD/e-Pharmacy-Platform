import { useParams } from "react-router-dom";
import Container from "../components/Container";
import { IoIosCart } from "react-icons/io";
import { useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import {
  useGetProduct,
  usetGetAllProducts,
} from "../app/apiCalls/productsCalls";
import Loader from "../components/Loader";
import { cartActions } from "../app/features/Cart";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";

const SingleProduct = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { addProductToCart, removeProductFromCart } = cartActions;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const isProductAddedToCart = cartItems.find(
    (cartItem) => cartItem._id === id
  );

  const {
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
    data: productData,
  } = useGetProduct(id);

  const {
    isLoading: isRelatedProductsLoading,
    isError: isRelatedProductsError,
    error: relaatedProductsError,
    data: relatedProductsData,
  } = usetGetAllProducts(5, productData?.data?.data?.categoryId);

  if (isProductLoading) {
    return <Loader />;
  }

  console.log("relatedProductsData", relatedProductsData);

  if (isProductError) {
    // console.log(productError);
    if (productError?.response?.status === 400) {
      // navigate("/");
      return <Navigate to={"/"} />;
    }
    // return <h1>{productError.message}</h1>;
  }

  if (!isProductLoading) {
    console.log("productData", productData);
  }

  console.log("relatedProductsData", relatedProductsData);

  return (
    <div>
      <Container>
        {/* <Link to={"/products"}>
          <button className="mt-10 bg-secondary px-2 py-2 text-sm text-white rounded-sm">
            Back To Shop!
          </button>
        </Link> */}
        <div
          className="grid my-10 gap-10"
          style={{ gridTemplateColumns: "25% 70%" }}
        >
          <div className="border border-secondary border-opacity-15 p-3 rounded-md w-full flex items-center justify-center">
            <img
              src={`${
                productData?.data?.data?.image?.url ||
                "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
              }`}
              alt="product"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-[70%]">
            <h2 className="text-3xl my-5">{productData?.data?.data.title}</h2>
            <p className="my-5 text-sm">
              {productData?.data?.data?.description?.main?.substring(0, 200)}...
            </p>
            <hr />
            <div className="my-5 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-secondary">
                {productData?.data?.data?.discountInfo
                  ? (
                      productData?.data?.data.price -
                      (productData?.data?.data.price *
                        productData?.data?.data?.discountInfo?.amount) /
                        100
                    )?.toFixed(2)
                  : productData?.data?.data.price?.toFixed(2)}{" "}
                DHS
              </h1>
              {productData?.data?.data?.discountInfo && (
                <div>
                  <span className="text-gray-400 line-through mr-5">
                    {productData?.data?.data.price?.toFixed(2)} DHS
                  </span>
                  <span className="bg-[#f84f63] px-2 py-2 rounded-t-[20px] rounded-r-[20px] text-white text-sm">
                    -{" "}
                    {(
                      (productData?.data?.data.price *
                        productData?.data?.data?.discountInfo?.amount) /
                      100
                    )?.toFixed(2)}
                    DHS
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span
                className={`uppercase ${
                  productData.data.data.quantity === 0
                    ? "text-red-500"
                    : "text-[#27c58f]"
                } text-xs font-bold relative before:content-[''] before:w-[8px] before:h-[8px] before:bg-[#27c58f] before:rounded-full`}
              >
                {productData.data.data.quantity === 0
                  ? "out of stock"
                  : "in stock"}
              </span>
              <span className="bg-secondary bg-opacity-15 w-[85%] h-[0.5px]"></span>
            </div>
            <div className="my-5 flex items-center gap-5">
              <div className="flex items-center gap-5 rounded-sm border-secondary border">
                <div
                  className="bg-secondary px-4 py-2 font-semibold text-white cursor-pointer"
                  onClick={() => {
                    if (quantity < productData.data.data.quantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </div>
                <div className="text-black font-semibold py-2 border-t-secondary">
                  {quantity}
                </div>
                <div
                  className="bg-secondary px-4 py-2 font-semibold text-white cursor-pointer"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </div>
              </div>
              <div
                onClick={() => {
                  if (productData.data.data.quantity !== 0) {
                    if (!!isProductAddedToCart) {
                      dispatch(
                        removeProductFromCart(productData?.data?.data._id)
                      );
                      toast.success("Product Removed From Cart!");
                    } else {
                      dispatch(
                        addProductToCart({
                          ...productData?.data?.data,
                          userQuantity: quantity,
                        })
                      );
                      toast.success("Product Added To Cart!");
                    }
                  }
                }}
                className={`bg-primary text-white px-5 text-md ${
                  productData.data.data.quantity === 0
                    ? "cursor-not-allowed bg-opacity-[0.7]"
                    : "cursor-pointer"
                } py-2 rounded-md flex items-center gap-3`}
              >
                <div>
                  {!!isProductAddedToCart
                    ? "Remove From Cart!"
                    : "Add To Cart!"}
                </div>
                <span>
                  <IoIosCart className="text-[1.2rem]" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="uppercase text-secondary font-semibold text-xs">
                secure payment
              </span>
              <div className="flex items-center gap-1">
                <img
                  src="https://assets.pharmeasy.in/web-assets/_next/icons/mastercard.svg"
                  alt=""
                  className="w-[7%]"
                />
                <img
                  src="https://assets.pharmeasy.in/web-assets/_next/icons/visa.svg"
                  alt=""
                  className="w-[7%]"
                />
                <img
                  src="https://www.pharmacy2u.co.uk/_next/image?url=%2Fpayment-providers%2Fpaypal.png&w=96&q=75"
                  alt=""
                  className="w-[10%]"
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-secondary bg-opacity-5 p-5 rounded-sm">
            <div className="mb-10">
              <h3 className="font-semibold text-md mb-5 uppercase">
                Description
              </h3>
              <div>
                <p className="my-3 text-sm">
                  {productData?.data?.data?.description?.main}
                </p>
              </div>
            </div>
            {productData?.data?.data?.description?.benefits?.length > 0 && (
              <div className="mb-10">
                <h3 className="font-semibold text-md mb-5 uppercase">
                  Benefits
                </h3>
                <div className="pl-5">
                  <ul className="list-disc">
                    {productData?.data?.data?.description?.benefits?.map(
                      (benefit, i) => {
                        return (
                          <li className="text-sm" key={i}>
                            {benefit}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            )}
            {productData?.data?.data?.description?.uses?.length > 0 && (
              <div className="mb-10">
                <h3 className="font-semibold text-md mb-5 uppercase">Uses</h3>
                <div className="pl-5">
                  <ul className="list-disc">
                    {productData?.data?.data?.description?.uses?.map(
                      (use, i) => {
                        return (
                          <li className="text-sm" key={i}>
                            {use}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            )}
            {productData?.data?.data?.description?.safetyInformations?.length >
              0 && (
              <div className="mb-10">
                <h3 className="font-semibold text-md mb-5 uppercase">
                  Safety Information
                </h3>
                <div className="pl-5">
                  <ul className="list-disc">
                    {productData?.data?.data?.description?.safetyInformations?.map(
                      (safetyInfo, i) => {
                        return (
                          <li className="text-sm" key={i}>
                            {safetyInfo}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="my-5">
          <h2 className="py-8 text-3xl text-secondary font-extrabold tracking-tighter	">
            Related Products
          </h2>
          <div className="grid grid-cols-5 justify-between gap-3 w-full">
            {relatedProductsData?.data?.data?.map((product) => {
              const { _id, title, price, discountInfo, image, categoryInfo } =
                product;
              return (
                // <Link key={_id} to={`/products/${_id}`}>
                <ProductCard
                  key={_id}
                  title={title}
                  image={`${
                    image?.url ||
                    "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
                  }`}
                  category={categoryInfo?.title}
                  rating={"4.0"}
                  price={price}
                  hasDiscount={!!discountInfo}
                  discount={{
                    amount: discountInfo?.amount,
                    newPrice: price - (price * discountInfo?.amount) / 100,
                  }}
                  id={_id}
                />
                // </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProduct;
