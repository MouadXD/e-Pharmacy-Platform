import Container from "../components/Container";
import ProductCard from "../components/productCard";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../components/Loader";
import { useGetAllCategoriesQuery } from "../app/apiCalls/categoryCalls";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Products = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState({ name: "Relevance", url: "" });
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState(null);
  const [page, setPage] = useState(1);

  const searchQuery = useSelector((state) => state.searchQuery.searchQuery);

  const { t } = useTranslation();

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

  const fetchProducts = (page = 1) =>
    axios.get(
      `products?page=${page}&sort=${sortBy.url}&category=${
        category?.id || ""
      }&price=${price?.min || ""}-${price?.max || ""}&search=${
        searchQuery || ""
      }`
    );

  const {
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    data: productsData,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["projects", page],
    queryFn: () => fetchProducts(page),
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useGetAllCategoriesQuery();

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // const {
  //   data: discountsData,
  //   isLoading: isDiscountesLoading,
  //   isError: isDiscountsError,
  //   error: discountsError,
  // } = useGetAllValidDiscountsQuery();

  // if (!isDiscountesLoading) {
  //   console.log(discountsData);
  // }

  // if (isCategoriesLoading) {
  //   return "Loading...";
  // }

  // if (isCategoriesError) {
  //   return <h1>{categoriesError.message}</h1>;
  // }

  // console.log(categoriesData);

  if (isProductsLoading) {
    return <Loader />;
  }

  if (isProductsError) {
    return <h1>{productsError.message}</h1>;
  }

  return (
    <>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                {category?.title || t("allProducts")}
              </h1>
              <span className="text-sm self-center mt-1 text-white font-light">
                ({productsData?.data.totalFound} products)
              </span>
            </div>
            <p className="text-white font-light">Explore All Products.</p>
          </div>
        </Container>
      </div>
      <Container>
        <div
          className="grid gap-4 my-5"
          style={{ gridTemplateColumns: "20% 80%" }}
        >
          <div className="col-start-2 mt-5 flex items-center justify-between">
            {/* <div className="flex gap-3">
              <h1 className="font-extrabold text-secondary text-4xl">
                {category?.title || "All Products"}
              </h1>
              <span className="text-sm self-center mt-1 text-secondary font-light">
                ({productsData?.data.totalFound} products)
              </span>
            </div> */}
            {/* <div className="text-xl font-bold text-secondary">
            Full Body Checkups
          </div> */}
            {/* <div className="text-md text-secondary">
            Showing 1 - 8 of 8 search results
          </div> */}
            <div className="flex items-center justify-end w-full gap-3">
              <span className="text-secondary">{t("sort")}</span>
              <div className="relative">
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
                                  refetchProducts();
                                }, 100);
                              }}
                            >
                              {sort.name}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="grid gap-4 mb-10"
          style={{ gridTemplateColumns: "20% 80%" }}
        >
          <div>
            {/* <div>
            <h2 className="font-semibold text-sm bg-secondary text-white p-2 rounded-sm">
              Brands
            </h2>
            <div className="my-4 mx-5">
              <ul>
                {marque.map((element, i) => {
                  return (
                    <li className="uppercase mb-1 text-sm" key={element.id}>
                      {element.title}
                      <span className="ml-2 text-primary">({element.qte})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div> */}
            {/* <div>
            <h2 className="text-md bg-secondary border-b text-white p-3 rounded-lg">
              Categoris
            </h2>
            <div className="my-4 overflow-y-scroll h-[250px]">
              <ul>
                {categories.map((element, i) => {
                  return (
                    <li className="uppercase mb-1 text-sm" key={element.id}>
                      {element.title}
                      <span className="ml-2 text-primary">({element.qte})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div> */}
            <div className="mb-10 border border-secondary border-opacity-10 rounded-sm overflow-hidden">
              <h2 className="text-md border-b border-secondary bg-secondary text-white border-opacity-10 p-3">
                {t("Categories")}
              </h2>
              <div>
                <ul className="overflow-y-auto max-h-[400px]">
                  {(categoriesData?.data?.data || []).map((category) => {
                    return (
                      <li
                        onClick={() => {
                          setCategory({
                            title: category.title,
                            id: category._id,
                          });
                          setTimeout(() => {
                            refetchProducts();
                          }, 100);
                        }}
                        key={category._id}
                        className="px-5 py-3 bg-[#eee] bg-opacity-5 cursor-pointer border-secondary border-b border-dashed border-opacity-10 text-sm hover:bg-secondary hover:bg-opacity-5 transition hover:transition"
                      >
                        {category.title}{" "}
                        <span className="text-xs text-secondary">
                          ({category.totalProducts})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {false && (
              <div>
                <h2 className="text-md border-b border-secondary bg-secondary text-white border-opacity-10 rounded-sm p-3">
                  Price
                </h2>
                <div className="flex items-center justify-between gap-10 mt-5">
                  <div className="flex items-center gap-3 border-secondary border rounded-sm w-full">
                    <span className="bg-secondary text-white text-sm p-2 rounded-l-sm">
                      Min
                    </span>
                    <input
                      className="bg-transparent focus:outline-none w-full text-center"
                      onChange={(e) => {
                        setPrice({ ...price, min: e.target.value });
                        setTimeout(() => {
                          refetchProducts();
                        }, 100);
                      }}
                      type="number"
                      // min={productsData?.data.priceSettings?.min}
                      // max={productsData?.data.priceSettings?.max}
                      defaultValue={productsData?.data.priceSettings?.min}
                    />
                  </div>
                  <div className="flex items-center gap-3 border-secondary border rounded-sm w-full">
                    <span className="bg-secondary text-white text-sm p-2 rounded-l-sm">
                      Max
                    </span>
                    <input
                      className="bg-transparent focus:outline-none w-full text-center"
                      onChange={(e) => {
                        setPrice({ ...price, max: e.target.value });
                        setTimeout(() => {
                          refetchProducts();
                        }, 100);
                      }}
                      type="number"
                      // max={productsData?.data.priceSettings?.max}
                      // min={productsData?.data.priceSettings?.min}
                      defaultValue={productsData?.data.priceSettings?.max}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="my-5 flex items-center justify-between">
            <h3 className="text-secondary font-bold text-xl uppercase">
              Nettoyage Solaire
            </h3>
            <div>
              <span className="text-sm uppercase text-secondary font-bold mr-2">
                Sort By
              </span>
              <select className="border border-secondary w-[200px] p-2.5 font-light text-sm rounded-full focus:outline-none">
                <option value={"category_id"}>Default</option>
                <option value={"category_id"}>Title</option>
                <option value={"category_id"}>Price</option>
              </select>
            </div>
          </div> */}
          <div className="grid grid-cols-4 gap-3">
            {productsData.data.totalFound > 0 ? (
              productsData.data.data.map((product) => {
                const { _id, title, price, discountInfo, image, categoryInfo } =
                  product;
                return (
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
                );
              })
            ) : (
              <h4 className="text-sm w-full h-[100vh] text-gray-500 font-light">
                No Products Found!
              </h4>
            )}
          </div>
        </div>
        {productsData.data.data.length > 0 && (
          <div className="my-10 w-full flex items-center justify-end gap-1">
            {productsData?.data?.pagination?.totalPages > 1 && page > 1 && (
              <div
                className="ml-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                  }
                }}
              >
                <FaArrowRight className="text-secondary text-xs rotate-180" />
              </div>
            )}
            {Array.from(
              { length: productsData?.data?.pagination?.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <div
                key={pageNumber}
                className={`text-sm rounded-sm cursor-pointer w-[30px] h-[30px] flex items-center justify-center text-secondary ${
                  pageNumber === page && "bg-secondary text-white"
                }`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </div>
            ))}
            {page !== productsData?.data?.pagination?.totalPages && (
              <div
                className="ml-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
                onClick={() => {
                  if (page < productsData?.data?.pagination?.totalPages) {
                    setPage(page + 1);
                  }
                }}
              >
                <FaArrowRight className="text-secondary text-xs" />
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default Products;
