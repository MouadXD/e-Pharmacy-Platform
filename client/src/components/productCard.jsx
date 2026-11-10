import { MdOutlineAddShoppingCart } from "react-icons/md";
import { Link } from "react-router-dom";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { favoutitesActions } from "../app/features/Favourites";
import { FaCartPlus } from "react-icons/fa";

const ProductCard = ({
  title,
  image,
  category,
  hasDiscount,
  rating,
  price,
  discount,
  id,
}) => {
  const { handleFavourite } = favoutitesActions;
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites);
  const isAtFavourite = favourites.find((favourite) => favourite === id);

  const truncatedTitle =
    title?.length > 45 ? `${title?.substring(0, 45)}...` : title;

  return (
    <div className="w-full relative">
      {hasDiscount && (
        <div className="absolute left-0 top-[20px] bg-[#F0DA69] w-[76px] h-[30px] rounded-r-[20px]">
          <span className="text-sm font-bold flex items-center justify-center h-full">
            {discount?.amount}% OFF
          </span>
        </div>
      )}
      <div
        className="absolute right-[5px] top-[5px] w-[40px] h-[40px] z-[999] rounded-tr-lg"
        onClick={() => {
          dispatch(handleFavourite(id));
        }}
      >
        <span className="text-sm font-bold flex items-center justify-center h-full cursor-pointer">
          {isAtFavourite ? (
            <MdFavorite className="text-secondary text-2xl" />
          ) : (
            <MdFavoriteBorder className="text-secondary text-xl" />
          )}
        </span>
      </div>
      <div className="bg-[#F1F5F9] rounded-[10px] pb-[0.5px]">
        <div className="p-5 w-full flex items-center justify-center">
          <Link
            to={`/products/${id}`}
            className="block w-[] h-[250px] overflow-hidden rounded-[10px]"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              style={{ minHeight: "100%" }}
            />
          </Link>
        </div>
        <div className="bg-white m-1 rounded-[10px]">
          <div className="p-3 flex flex-col" style={{ minHeight: "6rem" }}>
            {" "}
            {/* Adjust minHeight as needed */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#C1C1C1]">{category}</div>
            </div>
            <h3 className="text-md font-normal text-black leading-5 mb-2 overflow-hidden overflow-ellipsis ">
              {truncatedTitle}
            </h3>
            <div className="flex items-center justify-between gap-3">
              <div className="my-1 flex items-center justify-start gap-3">
                {hasDiscount && (
                  <>
                    <span className="text-[#C1C1C1] text-sm line-through">
                      {price?.toFixed(2)}
                      <span className="text-xs ml-1">DHs</span>
                    </span>
                    <span className="text-secondary font-bold text-2xl">
                      {discount?.newPrice?.toFixed(2)}
                      <span className="text-xs ml-1">DHs</span>
                    </span>
                  </>
                )}

                {!hasDiscount && (
                  <span className="text-secondary font-semibold text-2xl">
                    {price?.toFixed(2)}
                    <span className="text-xs ml-1">DHs</span>
                  </span>
                )}
              </div>
              {/* <button className="bg-secondary bg-opacity-5  w-[35px] h-[35px] text-sm rounded-sm py-2 flex items-center gap-2 justify-center">
                <FaCartPlus className="text-secondary text-[1rem]" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
