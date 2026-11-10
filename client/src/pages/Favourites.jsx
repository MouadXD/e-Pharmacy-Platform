import Container from "../components/Container";
import { useSelector } from "react-redux";
import { useGetProduct } from "../app/apiCalls/productsCalls";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import ProductCard from "../components/productCard";
import { Link } from "react-router-dom";

const Favourites = () => {
  const favourites = useSelector((state) => state.favourites);

  const productsInfo = useQueries({
    queries:
      favourites.map((product) => {
        return {
          queryKey: ["products", product],
          queryFn: () => axios.get(`products/${product}`),
        };
      }) || [],
  });

  console.log("productsInfo", productsInfo);
  //   return;

  return (
    <div>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                Favourites{" "}
              </h1>
            </div>
            <p className="text-white font-light">
              All your Favourite Products.
            </p>
          </div>
        </Container>
      </div>
      {productsInfo?.length > 0 ? (
        <Container>
          <div className="my-10 grid grid-cols-5 gap-5">
            {productsInfo.map((product) => {
              //   const {
              //     data: { data: productData },
              //   } = product;
              //   const { _id, title, image, price, discountInfo } =
              //     productData.data;
              const productData = product?.data?.data?.data;
              return (
                <ProductCard
                  key={productData?._id}
                  title={productData?.title}
                  image={`${
                    productData?.image?.url ||
                    "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
                  }`}
                  category={productData?.categoryInfo?.title}
                  price={productData?.price}
                  hasDiscount={!!productData?.discountInfo}
                  discount={{
                    amount: productData?.discountInfo?.amount,
                    newPrice:
                      productData?.price -
                      (productData?.price * productData?.discountInfo?.amount) /
                        100,
                  }}
                  id={productData?._id}
                />
              );
            })}
          </div>
        </Container>
      ) : (
        <h4
          className="text-sm w-full h-[100vh] flex items-center
         justify-center text-gray-500 font-light"
        >
          No Favourite Products !
        </h4>
      )}
    </div>
  );
};

export default Favourites;
