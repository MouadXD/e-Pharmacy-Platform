import Navbar from "../components/Navbar";
import Container from "../components/Container";
import { FaDivide, FaTruckMoving } from "react-icons/fa";
// import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { FaChevronRight } from "react-icons/fa";
// import { FaChevronLeft } from "react-icons/fa";
import ProductCard from "../components/productCard";
import { Link } from "react-router-dom";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
import {
  useGetOffers,
  usetGetAllProducts,
} from "../app/apiCalls/productsCalls";
import { useGetAllPostsQuery } from "../app/apiCalls/postsCalls";
import { useGetAdsQuery } from "../app/apiCalls/adsCalls";
import Loader from "../components/Loader";
import { FaUserDoctor } from "react-icons/fa6";
import { FaHospital } from "react-icons/fa";
import { FaCapsules } from "react-icons/fa";
import { FaUserNurse } from "react-icons/fa";
import { RiAlarmWarningLine } from "react-icons/ri";
import { GiChemicalDrop } from "react-icons/gi";
import { faker } from "@faker-js/faker";
import { useTranslation } from "react-i18next";
import isoToRedableDate from "../helpers/isoToRedableDate";
import { MdOutlineGridView } from "react-icons/md";

// import { RiGalleryView2 } from "react-icons/ri";

const Home = () => {
  const { t } = useTranslation();

  const {
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
    data: offersData,
  } = useGetOffers("", 5);

  const {
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    data: postsData,
  } = useGetAllPostsQuery(3);

  const numProducts = offersData?.data?.data?.length || 0;

  const {
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    data: productsData,
  } = usetGetAllProducts(8, "", "", 1, "createdAt.desc");

  const {
    isLoading: isAdsLoading,
    isError: isAdsError,
    error: adsError,
    data: adsData,
  } = useGetAdsQuery();

  // console.log("productsData", productsData);

  if (isOffersLoading || isProductsLoading || isAdsLoading) {
    return <Loader />;
  }

  const newProducts = productsData?.data?.data;

  const ads = adsData?.data?.data;
  // console.log("adsData", adsData);

  return (
    <div>
      {/* <Navbar /> */}
      <div className="bg-[url('http://localhost:5173/src/static/background.png')] bg-no-repeat w-full bg-cover relative overflow-hidden">
        <Container>
          {/* <div className="flex items-center">
            <h1 className="font-extrabold text-secondary text-[20rem]">
              Medicare
            </h1>
            <div className="absolute right-0 bottom-0">
              <img
                src="http://localhost:5173/src/static/medecine.png"
                className="w-full"
                alt=""
              />
            </div>
          </div> */}
          <div className="flex items-center justify-between my-10 min-h-[600px]">
            <div>
              <h1 className="font-extrabold text-white text-[7rem] leading-[6rem] max-w-[900px]">
                {t("homeTitle")}
              </h1>
              <p className="text-white py-10 text-md w-[50%]">
                {/* Better health starts here. */}
                {t("homeDescription")}
              </p>
              <Link to={"/about"}>
                <button className="border-white border px-3 py-3 rounded-sm text-white uppercase text-sm">
                  {t("homeMoreAboutUs")}
                </button>
              </Link>
            </div>
            <div className="w-[50%] absolute right-[-100px] top-0 ">
              <img
                src="http://localhost:5173/src/static/—Pngtree—drugs in medicine_5646498.png"
                className="w-full"
                alt=""
              />
            </div>
          </div>
          <div className="pb-10 pt-5 flex items-center gap-[50px]">
            <div className="flex items-center gap-2">
              <div className="bg-white p-3 w-fit rounded-full">
                <FaTruckMoving className="text-primary" />
              </div>
              <span className="text-white text-sm leading-4 w-[80px]">
                {t("homeDeliverToHome")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white p-3 w-fit rounded-full">
                <FaCapsules className="text-primary" />
              </div>
              <span className="text-white text-sm leading-4 w-[150px]">
                {t("homeGenuiProducts")}
              </span>
            </div>
          </div>
        </Container>
      </div>
      <div className="my-20 text-center">
        <Container>
          <div>
            <span className="text-secondary text-lg tracking-tight">
              {t("categoryHeader")}
            </span>
            <h2 className="text-secondary tracking-tight font-extrabold text-5xl">
              {t("categoryTitle")}
            </h2>
            <p className="my-5 text-gray-500 text-sm w-full text-center flex items-center justify-center">
              <span className="w-[800px] block">
                {t("categoryDescription")}
              </span>
            </p>
          </div>
          <div className="my-10 flex items-center justify-center gap-5 flex-col md:flex-row">
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <FaUserDoctor className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("onlineConsulting")}
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <FaHospital className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("hospitals")}
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <FaCapsules className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("medecines")}
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <GiChemicalDrop className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("pathologyTests")}
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <FaUserNurse className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("nursing")}
                </span>
              </div>
            </div>
            <div className="w-[200px] h-[200px] border-secondary border border-opacity-10 bg-primary rounded-sm flex items-center justify-center hover:scale-110 transition-all hover:transition-all">
              <div>
                <RiAlarmWarningLine className="text-white text-3xl flex w-full" />
                <span className="mt-3 block text-white tracking-tight text-lg font-[200]">
                  {t("emergency")}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {offersData?.data.total > 0 && (
        <div className="mt-20 mb-5">
          <Container>
            <h3 className="flex items-center justify-between">
              {/* <h2 className="text-secondary text-[1.8rem] font-[1000] my-5 leading-8">
                Today's Top Deals <br /> Just for You!
              </h2> */}
              <div className="my-5">
                <div className="text-secondary text-4xl font-bold tracking-tight mt-[-5px]">
                  {t("topOffers")}
                </div>
              </div>
              <span>
                <Link
                  className="font-normal text-sm text-white flex items-center bg-secondary px-2 py-3 rounded-sm gap-2 tracking-tight"
                  to={"/offers"}
                >
                  <MdOutlineGridView className="text-sm" />
                  {t("viewAll")}
                </Link>
              </span>
            </h3>
            <div className="flex items-center justify-between gap-5 w-full relative">
              {/* <button
                className="absolute bg-secondary rounded-full p-5 right-[-26.5px] z-[100] shadow-md"
                onClick={nextProduct}
              >
                <FaChevronRight className="text-xs text-white" />
              </button> */}
              {/* <button
                className="absolute bg-secondary rounded-full p-5 left-[-26.5px] z-[100] shadow-md rotate-180"
                onClick={prevProduct}
              >
                <FaChevronRight className="text-xs text-white" />
              </button> */}
              {offersData?.data?.data?.map((offer) => {
                const { _id, title, price, discountInfo, categoryInfo, image } =
                  offer;
                return (
                  // <Link to={`/products/${_id}`} key={_id} className="w-full">
                  <ProductCard
                    key={_id}
                    title={title}
                    image={
                      image?.url ||
                      "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
                    }
                    category={categoryInfo?.title}
                    price={price}
                    hasDiscount={!!discountInfo}
                    discount={{
                      amount: discountInfo?.amount,
                      newPrice: discountInfo?.newPrice,
                    }}
                    id={_id}
                  />
                  // </Link>
                );
              })}
            </div>
          </Container>
        </div>
      )}
      <div className="">
        <Container>
          <div className="flex items-center justify-between gap-5">
            {/* <Link to={"/products/1"} className="w-full h-full"> */}
            {/* <div className="w-full h-full"> */}
            {ads?.[0] && (
              <img
                src={
                  ads[0]?.image?.url ||
                  "http://localhost:5173/src/static/Rectangle 53.png"
                }
                className="w-full h-full rounded-xl"
                alt=""
              />
            )}
            {/* </div> */}
            {/* </Link> */}
            {/* <Link to={"/products/2"} className="w-full h-full"> */}
            {/* <div className="w-full h-full"> */}
            {ads?.[1] && (
              <img
                src={
                  ads[1]?.image?.url ||
                  "http://localhost:5173/src/static/Rectangle 53.png"
                }
                className="w-full h-full rounded-xl"
                alt=""
              />
            )}
            {/* </div> */}
            {/* </Link> */}
          </div>
        </Container>
      </div>
      <div className="my-5">
        <Container>
          <h3 className="flex items-center justify-between">
            <div className="my-5">
              <div className="text-secondary text-4xl font-bold tracking-tight mt-[-5px]">
                {t("newProducts")}
              </div>
            </div>
            <span>
              <Link
                className="font-normal text-sm text-white flex items-center bg-secondary px-2 py-3 rounded-sm gap-2 tracking-tight"
                to={"/products"}
              >
                <MdOutlineGridView className="text-sm" />
                {t("viewAll")}
              </Link>
            </span>
          </h3>
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "24% 75%" }}
          >
            {/* <Link to={"/products/3"} className="w-full h-full"> */}
            <div className="rounded-sm w-full h-full">
              {ads?.[2] && (
                <img
                  src={
                    ads[2]?.image?.url ||
                    "http://localhost:5173/src/static/Rectangle 76.png"
                  }
                  className="w-full h-full rounded-xl"
                  alt=""
                />
              )}
            </div>
            {/* </Link> */}
            <div className="grid grid-cols-4 grid-rows-2 gap-5 h-full">
              {newProducts?.map((product) => {
                const { _id, title, price, image, discountInfo, categoryInfo } =
                  product;
                return (
                  <ProductCard
                    key={_id}
                    title={title}
                    image={
                      image?.url ||
                      "https://res.cloudinary.com/dk3yapeaq/image/upload/v1714076932/gr9cr2xpijln9xymlucz.webp"
                    }
                    price={price}
                    hasDiscount={!!discountInfo}
                    discount={{
                      amount: discountInfo?.amount,
                      newPrice: product?.newPrice,
                    }}
                    category={categoryInfo?.title}
                    id={_id}
                  />
                );
              })}
            </div>
          </div>
        </Container>
      </div>
      {/* <div className="my-20">
        <Container>
          <div className="relative py-[3rem] px-[10rem] rounded-md text-white bg-[url('http://localhost:5173/src/static/label_last.png')] bg-no-repeat w-full bg-cover">
            <div className="absolute inset-0 bg-black opacity-5 rounded-md"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <span className="text-[4rem] font-[400] block">5+</span>
                <span className="text-md mt-[-15px] block font-extralight">
                  Years of Experience
                </span>
              </div>
              <div>
                <span className="text-[4rem] font-[400] block">300+</span>
                <span className="text-md mt-[-15px] block font-extralight">
                  Healthcare Practitioners
                </span>
              </div>
              <div>
                <span className="text-[4rem] font-[400] block">500+</span>
                <span className="text-md mt-[-15px] block font-extralight">
                  Satisfied Clients
                </span>
              </div>
              <div>
                <span className="text-[4rem] font-[400] block">100+</span>
                <span className="text-md mt-[-15px] block font-extralight">
                  Awards
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div> */}
      <div className="mt-[10rem] mb-[5rem] bg-[url('http://localhost:5173/src/static/doctor_label_last_2.png')] bg-no-repeat bg-cover bg-center text-white p-5 py-20 relative w-full">
        <Container>
          <div className="text-6xl tracking-tight py-5 max-w-[900px]">
            {t("doctorText")}
          </div>
          <Link to={"/auth/register"}>
            <button className="my-5 bg-white text-primary px-5 py-4 rounded-sm">
              {t("registerNow")}
            </button>
          </Link>
          <div className="absolute right-[276.997px] bottom-0 w-[25%]">
            <img
              src="http://localhost:5173/src/static/doctor.png"
              alt="doctor"
              className="w-full"
            />
          </div>
        </Container>
      </div>
      <div className="my-20">
        <Container>
          <div className="pb-10 text-center w-full">
            <h2 className="text-secondary tracking-tight font-extrabold text-5xl">
              {t("latestPosts")}
            </h2>
            <p className="my-5 text-gray-500 text-sm w-full text-center flex items-center justify-center">
              <span className="w-[800px] block">{t("blogDescription")}</span>
            </p>
          </div>
          <div className="my-5">
            <Container>
              <section className="pb-6">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-3 gap-5">
                    {postsData?.data?.data?.length > 0 ? (
                      postsData?.data?.data?.map((post) => {
                        const { _id, title, description, createdAt, image } =
                          post;
                        return (
                          <div
                            className="group w-full  border border-gray-300 rounded-2xl cursor-pointer"
                            key={_id}
                          >
                            <Link to={`/blog/${_id}`}>
                              <div className="flex items-center">
                                <img
                                  src={image?.url}
                                  alt="blogs tailwind section"
                                  className="rounded-t-2xl w-full h-52 object-cover"
                                />
                              </div>
                              <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                                <span className="text-primary font-medium mb-3 block">
                                  {isoToRedableDate(createdAt).substring(0, 14)}
                                </span>
                                <h4 className="text-xl text-gray-900 font-medium leading-1 mb-5">
                                  {title.substring(0, 50)}
                                </h4>
                                <p className="text-gray-500">
                                  {description.substring(0, 50)}...
                                </p>
                                {/* <Link
                            to={`/blog/${_id}`}
                            className="before:ease relative h-10 w-40 p-4 rounded-full overflow-hidden border border-green-500 bg-green-500 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:before:-translate-x-40"
                          >
                            Read more..
                          </Link> */}
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <h4>No posts yet!</h4>
                    )}
                  </div>
                </div>
              </section>
            </Container>
          </div>
        </Container>
      </div>
      {/* <div>
        <Container>
          <div>
            <h2 className="text-center text-secondary font-bold text-3xl">
              Got Questions ?
            </h2>
            <div className="my-3 text-center bg-[#F1F5F9] flex items-center justify-center gap-5 rounded-[10px] w-fit">
              <h2 className="text-secondary text-md font-medium p-3">
                How do I start online consulting with doctors on Medicare ?
              </h2>
              <div className="bg-secondary h-[48px] w-[50px]">
                <IoIosArrowDown className="text-white flex items-center justify-center w-full h-full" />
              </div>
            </div>
            <div className="my-3 text-center bg-[#F1F5F9] p-3 flex items-center justify-center rounded-[10px] w-fit">
              <h2 className="text-secondary text-md font-medium">
                How do I start online consulting with doctors on Medicare ?
              </h2>
            </div>
            <div className="my-3 text-center bg-[#F1F5F9] p-3 flex items-center justify-center rounded-[10px] w-fit">
              <h2 className="text-secondary text-md font-medium">
                How do I start online consulting with doctors on Medicare ?
              </h2>
            </div>
          </div>
        </Container>
      </div> */}
    </div>
  );
};

export default Home;
