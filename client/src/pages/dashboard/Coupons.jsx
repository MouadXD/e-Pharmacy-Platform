import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import { useState, useEffect } from "react";
import { GoPlus } from "react-icons/go";
import InputRounded from "../../components/InputRounded";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import {
  useGetCoupons,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../../app/apiCalls/couponsCalls";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import isoToRedableDate from "../../helpers/isoToRedableDate";

const couponSchema = yup.object({
  code: yup
    .string()
    .required("Coupon code is required")
    .matches(
      /^[a-zA-Z0-9]{3,10}$/,
      "Coupon code should be 3-10 characters long and contain only letters and numbers"
    ),
  discountValue: yup
    .number()
    .required("Discount value is required")
    .positive("Discount value must be positive"),
  minimumPurchase: yup
    .number()
    .min(0, "Minimum purchase must be at least 0")
    .default(0),
  maxDiscount: yup
    .number()
    .nullable()
    .min(0, "Max discount must be at least 0"),
  usageLimit: yup
    .number()
    .required("Usage limit is required")
    .positive("Usage limit must be positive")
    .integer("Usage limit must be an integer")
    .default(1),
  isActive: yup.boolean().required("Active status is required").default(true),
  startDate: yup
    .date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date must be after start date"),
});

const Coupons = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(couponSchema),
  });

  const user = useSelector((state) => state?.user?.userInfo);

  const {
    data: couponsData,
    isLoading: isCouponsLoading,
    isError: isCouponsError,
    error: couponsError,
    refetch: refethCoupons,
  } = useGetCoupons(user?.accessToken);

  const {
    mutateAsync: createCouponAsync,
    isPending: isCreateCouponLoading,
    isError: isCreateCouponError,
    error: createCouponError,
  } = createCoupon(user?.accessToken);

  const {
    mutateAsync: updateCouponAsync,
    isPending: isUpdateCouponLoading,
    isError: isUpdateCouponError,
    error: updateCouponError,
  } = updateCoupon(user?.accessToken);

  const {
    mutateAsync: deleteCouponAsync,
    isPending: isDeleteCouponLoading,
    isError: isDeleteCouponError,
    error: deleteCouponError,
  } = deleteCoupon(user?.accessToken);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModelOpen] = useState(false);
  const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (coupon) {
      setValue("code", coupon?.code);
      setValue("discountValue", coupon?.discountValue);
      setValue("startDate", coupon?.startDate?.substring(0, 10));
      setValue("endDate", coupon?.endDate?.substring(0, 10));
      setValue("minimumPurchase", coupon?.minimumPurchase);
      setValue("maxDiscount", coupon?.maxDiscount);
      setValue("usageLimit", coupon?.usageLimit);
      setValue("isActive", coupon?.isActive);
    }
  }, [isUpdateModelOpen, coupon]);

  const coupons = couponsData?.data?.data;

  const onSubmit = async (requestBody) => {
    try {
      const createCouponResponse = await createCouponAsync(requestBody);
      if (createCouponResponse?.data?.status === 201) {
        setIsCreateModelOpen(false);
        refethCoupons();
        toast.success("Coupon created success!");
        reset();
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleDeleteCoupon = async () => {
    const couponId = coupon?._id;
    try {
      const deleteCouponResponse = await deleteCouponAsync(couponId);
      if (deleteCouponResponse?.data?.status === 200) {
        setIsDeleteModelOpen(false);
        refethCoupons();
        toast.success("Coupon deleted success!");
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleUpdateCoupon = async (requestBody) => {
    try {
      const updateCouponResponse = await updateCouponAsync({
        body: requestBody,
        id: coupon?._id,
      });

      if (updateCouponResponse?.data?.status === 200) {
        toast.success("Coupon updated success!");
        setIsUpdateModelOpen(false);
        refethCoupons();
        reset();
        setCoupon(null);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  if (isCouponsLoading) {
    return <Loader />;
  }

  return (
    <div
      className="bg-[#F6F8FB] relative"
      style={{ height: "calc(100vh - 130px)" }}
    >
      {isDeleteModalOpen && (
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-6 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
              onClick={() => setIsDeleteModelOpen(false)}
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              />
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              />
            </svg>
            <div className="my-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-md font-semibold mt-6">
                Are you sure you want to delete it?
              </h4>
              <p className="text-sm text-gray-500 mt-4">
                {/* This will delete your product from catalog, are you sure ? */}
                {/* {product.title} */}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                className={`px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500`}
                onClick={() => {
                  handleDeleteCoupon();
                }}
              >
                {isDeleteCouponLoading ? "Loading..." : "Delete"}
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                onClick={() => setIsDeleteModelOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <Modal>
          <div className="">
            <form className="grid grid-cols-2 gap-5">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="couponCode"
                >
                  Coupon Code
                </label>
                <input
                  id="couponCode"
                  type="text"
                  placeholder="e.g. SAVE20"
                  {...register("code")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountValue"
                >
                  Discount Value
                </label>
                <input
                  id="discountValue"
                  type="number"
                  placeholder="e.g. 20"
                  {...register("discountValue")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountValue"
                >
                  Max Discount
                </label>
                <input
                  id="maxDiscount"
                  type="number"
                  placeholder="e.g. 110"
                  {...register("maxDiscount")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.maxDiscount && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.maxDiscount.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="minimumPurchase"
                >
                  Minimum Purchase
                </label>
                <input
                  id="minimumPurchase"
                  type="number"
                  placeholder="e.g. 50"
                  {...register("minimumPurchase")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.minimumPurchase && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.minimumPurchase.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="expirationDate"
                >
                  Start Date
                </label>
                <input
                  id="expirationDate"
                  type="date"
                  {...register("startDate")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="expirationDate"
                >
                  End Date
                </label>
                <input
                  id="expirationDate"
                  type="date"
                  {...register("endDate")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("isActive")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
                {errors.isActive && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="usageLimit"
                >
                  Usage Limit
                </label>
                <input
                  id="usageLimit"
                  type="number"
                  placeholder="e.g. 100"
                  {...register("usageLimit")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.usageLimit.message}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isCreateCouponLoading && "cursor-not-allowed bg-opacity-90"
                  }`}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isCreateCouponLoading ? "Loading..." : "Save"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => {
                    setIsCreateModelOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {isUpdateModelOpen && (
        <Modal>
          <div className="">
            <form className="grid grid-cols-2 gap-5">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="couponCode"
                >
                  Coupon Code
                </label>
                <input
                  id="couponCode"
                  type="text"
                  placeholder="e.g. SAVE20"
                  {...register("code")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountValue"
                >
                  Discount Value
                </label>
                <input
                  id="discountValue"
                  type="number"
                  placeholder="e.g. 20"
                  {...register("discountValue")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountValue"
                >
                  Max Discount
                </label>
                <input
                  id="maxDiscount"
                  type="number"
                  placeholder="e.g. 110"
                  {...register("maxDiscount")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.maxDiscount && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.maxDiscount.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="minimumPurchase"
                >
                  Minimum Purchase
                </label>
                <input
                  id="minimumPurchase"
                  type="number"
                  placeholder="e.g. 50"
                  {...register("minimumPurchase")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.minimumPurchase && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.minimumPurchase.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="expirationDate"
                >
                  Start Date
                </label>
                <input
                  id="expirationDate"
                  type="date"
                  {...register("startDate")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="expirationDate"
                >
                  End Date
                </label>
                <input
                  id="expirationDate"
                  type="date"
                  {...register("endDate")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("isActive")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
                {errors.isActive && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.isActive.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="usageLimit"
                >
                  Usage Limit
                </label>
                <input
                  id="usageLimit"
                  type="number"
                  placeholder="e.g. 100"
                  {...register("usageLimit")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.usageLimit.message}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isCreateCouponLoading && "cursor-not-allowed bg-opacity-90"
                  }`}
                  onClick={handleSubmit(handleUpdateCoupon)}
                >
                  {isUpdateCouponLoading ? "Loading..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => {
                    setIsUpdateModelOpen(false);
                    reset();
                    setCoupon(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      <Container>
        <div className="py-[30px] flex items-center justify-between">
          <div>
            <LocationRight list={["Coupons"]} />
            <div className="text-sm">Explore all Coupons.</div>
          </div>
          <div
            className="bg-secondary text-white p-3 rounded cursor-pointer"
            onClick={() => {
              setIsCreateModelOpen(true);
            }}
          >
            <button className="flex items-center gap-2">
              <GoPlus className="font-bold text-sm" />
              <div className="text-sm">New Coupon</div>
            </button>
          </div>
        </div>
        <div className="py-4">
          <Table
            fields={[
              "Code",
              "Amount",
              "Min Amount",
              "Start Date",
              "Expiration Date",
              "Status",
              "Usage Limit",
              "Used Time",
              "Actions",
            ]}
          >
            {coupons?.map((coupon) => {
              const {
                _id,
                code,
                discountValue,
                minimumPurchase,
                usedCount,
                isActive,
                startDate,
                endDate,
                usageLimit,
              } = coupon;
              return (
                <div
                  className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                  key={_id}
                >
                  <div className="flex-1 text-center">{code}</div>
                  <div className="flex-1 text-center">{discountValue}</div>
                  <div className="flex-1 text-center">{minimumPurchase}</div>
                  <div className="flex-1 text-center">
                    {isoToRedableDate(startDate)}
                  </div>
                  <div className="flex-1 text-center">
                    {isoToRedableDate(endDate)}
                  </div>
                  <div className="flex-1 text-center">
                    {/* {isActive ? "active" : "not active"} */}
                    <span
                      className={`${
                        isActive
                          ? "bg-primary text-primary"
                          : "bg-red-600 text-red-600"
                      } bg-opacity-5 text-xs px-4 py-2 rounded-full`}
                    >
                      {isActive ? "Active" : "Not Active"}
                    </span>
                  </div>
                  <div className="flex-1 text-center">{usageLimit}</div>
                  <div className="flex-1 text-center">{usedCount}</div>
                  <div className="flex-1 text-center flex items-center justify-center gap-3">
                    {/* <button
                      className="flex items-center gap-2 bg-blue-500 p-2  rounded-sm text-white"
                      onClick={() => {}}
                    >
                      <FaEye />
                      View
                    </button> */}
                    <button
                      className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white"
                      onClick={() => {
                        setCoupon(coupon);
                        setIsUpdateModelOpen(true);
                      }}
                    >
                      <MdEdit />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-2 bg-red-500 p-2  rounded-sm text-white"
                      onClick={() => {
                        setCoupon(coupon);
                        setIsDeleteModelOpen(true);
                      }}
                    >
                      <RiDeleteBin6Fill />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default Coupons;
