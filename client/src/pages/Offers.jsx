import Container from "../components/Container";
import ProductCard from "../components/productCard";
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useGetOffers } from "../app/apiCalls/productsCalls";
import Loader from "../components/Loader";

const Offers = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ name: "Relevance", url: "" });

  const {
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
    data: offersData,
    refetch: refetchOffers,
  } = useGetOffers(sortBy.url);

  if (isOffersLoading) {
    return <Loader />;
  }

  if (isOffersError) {
    return <h1>{offersError.message}</h1>;
  }

  if (!isOffersLoading) {
    console.log(offersData);
  }

  const sortProductsBy = [
    {
      name: "Relevance",
      url: "",
    },
    {
      name: "Title, A-Z",
      url: "title.asc",
    },

    {
      name: "Title, Z-A",
      url: "title.desc",
    },
    {
      name: "Price, ASC",
      url: "price.asc",
    },
    {
      name: "Price, DESC",
      url: "price.desc",
    },
  ];

  return (
    <>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                Offers{" "}
              </h1>
              <span className="text-sm self-center mt-1 text-white font-light">
                ({offersData?.data.total} products)
              </span>
            </div>
            <p className="text-white font-light">Explore all offers.</p>
          </div>
        </Container>
      </div>
      <div className="my-10">
        <Container>
          <div className="flex items-center justify-end">
            {/* <div className="flex gap-3">
              <h1 className="font-extrabold text-secondary text-4xl">Offers</h1>
              <span className="text-sm self-center mt-1 text-secondary font-light">
                ({offersData?.data.total} products)
              </span>
            </div> */}
            <div>
              <div className="flex items-center gap-3">
                <span className="text-secondary">Sort</span>
                <div className=" relative">
                  <div
                    className="flex items-center justify-between gap-1 cursor-pointer border border-secondary px-4 py-2 rounded-sm"
                    onClick={() => {
                      setIsSortOpen(!isSortOpen);
                    }}
                  >
                    <div className=" text-secondary">{sortBy.name}</div>
                    <IoMdArrowDropdown
                      className={`text-secondary ${
                        isSortOpen ? "rotate-180" : "rotate-0"
                      } transition`}
                    />
                  </div>
                  {isSortOpen && (
                    <div className="absolute bg-white shadow-2xl text-secondary top-[45px] z-[1000] w-full right-0 rounded-b-sm">
                      <div>
                        {sortProductsBy.map((sort) => {
                          if (sort.name !== sortBy.name) {
                            return (
                              <div
                                className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition"
                                key={crypto.randomUUID()}
                                onClick={() => {
                                  setSortBy(sort);
                                  setIsSortOpen(false);
                                  setTimeout(() => {
                                    refetchOffers();
                                  }, 100);
                                }}
                              >
                                {sort.name}
                              </div>
                            );
                          }
                        })}
                        {/* <div className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition">
                      Title, A-Z
                    </div> */}
                        {/* <div className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition">
                      Relevance
                    </div>
                    <div className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition">
                      Title, Z-A
                    </div>
                    <div className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition">
                      Price, ASC
                    </div>
                    <div className="px-4 py-1.5 hover:bg-secondary hover:bg-opacity-10 cursor-pointer transition">
                      Price, DESC
                    </div> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="my-5 grid grid-cols-5 gap-5">
            {offersData?.data.total > 0 ? (
              offersData?.data.data.map((product) => {
                const { _id, title, price, discountInfo, categoryInfo, image } =
                  product;
                return (
                  // <Link to={`/products/${_id}`} key={_id}>
                  <ProductCard
                    category={categoryInfo?.title}
                    title={title}
                    image={image.url}
                    price={price}
                    hasDiscount={!!discountInfo}
                    discount={{
                      amount: discountInfo.amount,
                      newPrice: discountInfo.newPrice,
                    }}
                    id={_id}
                  />
                  // </Link>
                );
              })
            ) : (
              <h4 className="text-sm w-full h-[100vh] text-gray-500 font-light">
                No Products Found!
              </h4>
            )}
            {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((el, i) => {
            return (
              <Link to={`/products/${i}`} key={i}>
                <ProductCard
                  category={"category"}
                  title="title"
                  image="https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
                  price={"495"}
                  hasDiscount={true}
                  discount={{ amount: 35, newPrice: 120 }}
                />
              </Link>
            );
          })} */}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Offers;
