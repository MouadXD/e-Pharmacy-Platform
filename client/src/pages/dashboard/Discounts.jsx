import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import { GoPlus } from "react-icons/go";
import Table from "../../components/Table";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  useGetAllDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} from "../../app/apiCalls/discountsCalls";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import isoToRedableDate from "../../helpers/isoToRedableDate";
import { FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { customStyles } from "../../helpers/selectStyles";
import { usetGetAllProducts } from "../../app/apiCalls/productsCalls";
import { MdClear } from "react-icons/md";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const discountSchema = yup.object({
  name: yup
    .string()
    .required("Discount name is required")
    .max(100, "Discount name cannot be longer than 100 characters"),
  amount: yup
    .number()
    .required("Discount amount is required")
    .min(0, "Discount amount cannot be negative")
    .max(100, "Discount amount cannot exceed 100"),
  startDate: yup.date().required("Start date is required"),
  // .min(new Date(), "Start date cannot be in the past"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date cannot be before start date"),
});

const Modal = ({
  isOpen,
  setIsModalOpen,
  type,
  discount = null,
  refetchDiscounts,
}) => {
  const [applicableProducts, setApplicableProducts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const user = useSelector((state) => state.user.userInfo);

  const now = new Date();

  const newStartDate = new Date(discount?.startDate);
  const newEndtDate = new Date(discount?.endDate);

  const isActive = now >= newStartDate && now <= newEndtDate;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(discountSchema),
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = usetGetAllProducts("", "", "", "", 1, "true");

  const {
    mutateAsync: createDiscountAsync,
    isPending: isCreateDiscountLoading,
    isError: isCreateDiscountError,
    error: createDiscountError,
  } = useCreateDiscountMutation(user?.accessToken);

  const {
    mutateAsync: updateDiscountAsync,
    isPending: isUpdateDiscountLoading,
    isError: isUpdateDiscountError,
    error: updateDiscountError,
  } = useUpdateDiscountMutation(user?.accessToken);

  const {
    mutateAsync: deleteDiscountAsync,
    isPending: isDeleteDiscountLoading,
    isError: isDeleteDiscountError,
    error: deleteDiscountError,
  } = useDeleteDiscountMutation(user?.accessToken);

  const productsSelect = productsData?.data?.data?.map((product) => {
    const { _id, title } = product;
    return { value: _id, label: title };
  });

  const handleCreateDiscount = async (requestBody) => {
    const newApplicableProducts = applicableProducts?.map((product) => {
      return product.value;
    });

    requestBody = { ...requestBody, applicableProducts: newApplicableProducts };

    try {
      const createDiscountResponse = await createDiscountAsync(requestBody);

      if (createDiscountResponse.status == 201) {
        toast.success("Discount created success!");
        setIsModalOpen(false);
        reset();
        refetchDiscounts();
        setApplicableProducts([]);
      }
      console.log("createDiscountResponse", createDiscountResponse);
    } catch (e) {
      toast.error(e.response.data.message || "Something went wrong");
    }
  };

  const handleUpdateDiscount = async (requestBody) => {
    const newApplicableProducts = applicableProducts?.map((product) => {
      return product.value;
    });

    requestBody = { ...requestBody, applicableProducts: newApplicableProducts };

    try {
      const updateDiscountResponse = await updateDiscountAsync({
        body: requestBody,
        id: discount?._id,
      });

      if (updateDiscountResponse.status == 200) {
        toast.success("Discount updated success!");
        setIsModalOpen(false);
        reset();
        refetchDiscounts();
        setApplicableProducts([]);
      }
    } catch (e) {
      toast.error(e.response.data.message || "Something went wrong");
    }
  };

  const handleDeleteDiscount = async () => {
    try {
      const deleteDiscountResponse = await deleteDiscountAsync(discount?._id);
      if (deleteDiscountResponse.status == 200) {
        toast.success("Discount deleted success!");
        setIsModalOpen(false);
        refetchDiscounts();
      }
    } catch (e) {
      toast.error(e.response.data.message || "Something went wrong");
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleSelectAdd = () => {
    console.log("selectedOption", selectedOption);
    console.log("applicableProducts", applicableProducts);
    const isProductAlreadyAdded = applicableProducts?.includes(
      selectedOption.value
    );

    if (!isProductAlreadyAdded) {
      if (applicableProducts?.length > 0) {
        setApplicableProducts([...applicableProducts, selectedOption]);
      } else {
        setApplicableProducts([selectedOption]);
      }
    }
  };

  useEffect(() => {
    if (type === "EDIT") {
      const applicableProducts = discount?.productDetails?.map((product) => {
        return { label: product.title, value: product._id };
      });
      setApplicableProducts(applicableProducts);
      setValue("discountCode", discount?.discountCode || "");
      setValue("name", discount?.name || "");
      setValue("amount", discount?.amount || "");
      setValue("startDate", discount?.startDate?.substring(0, 10) || "");
      setValue("endDate", discount?.endDate?.substring(0, 10) || "");
    }
  }, [discount, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        {type === "ADD" && (
          <div className="p-5">
            <form onSubmit={handleSubmit(handleCreateDiscount)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountName"
                >
                  Discount Name
                </label>
                <input
                  id="discountName"
                  type="text"
                  placeholder="e.g. Summer Sale"
                  {...register("name")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountAmount"
                >
                  Discount Amount (%)
                </label>
                <input
                  id="discountAmount"
                  type="number"
                  placeholder="e.g. 20"
                  {...register("amount")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
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
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  id="endDate"
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                      htmlFor="applicableProducts"
                    >
                      Applicabe Products
                    </label>
                    <div className="z-[100]">
                      <Select
                        options={productsSelect}
                        styles={customStyles("180px", "50px")}
                        onChange={handleSelectChange}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-green-700 hover:bg-green-800 transition duration-200 p-2 rounded cursor-pointer h-[50px] w-[50px] mt-[28px] flex items-center justify-center"
                    onClick={() => {
                      handleSelectAdd();
                    }}
                  >
                    <GoPlus className="font-bold text-sm text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {applicableProducts?.map((product) => {
                    const { label: title, value: id } = product;
                    return (
                      <span
                        className="text-xs bg-gray-300 text-black p-1 rounded-sm flex items-center gap-1"
                        key={id}
                      >
                        {title.substring(0, 20)}...
                        <MdClear
                          className="cursor-pointer"
                          onClick={() => {
                            setApplicableProducts(
                              applicableProducts.filter(
                                (product) => product.value !== id
                              )
                            );
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mt-9 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isCreateDiscountLoading && "cursor-wait bg-opacity-95"
                  }`}
                >
                  {isCreateDiscountLoading ? "Loading..." : "Save"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {type === "EDIT" && (
          <div className="p-5">
            <form onSubmit={handleSubmit(handleUpdateDiscount)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountName"
                >
                  Discount Name
                </label>
                <input
                  id="discountName"
                  type="text"
                  placeholder="e.g. Summer Sale"
                  {...register("name")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="discountAmount"
                >
                  Discount Amount (%)
                </label>
                <input
                  id="discountAmount"
                  type="number"
                  placeholder="e.g. 20"
                  {...register("amount")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
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
                  htmlFor="endDate"
                >
                  End Date
                </label>
                <input
                  id="endDate"
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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                      htmlFor="applicableProducts"
                    >
                      Applicabe Products
                    </label>
                    <div className="z-[100]">
                      <Select
                        options={productsSelect}
                        styles={customStyles("180px", "50px")}
                        onChange={handleSelectChange}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-green-700 hover:bg-green-800 transition duration-200 p-2 rounded cursor-pointer h-[50px] w-[50px] mt-[28px] flex items-center justify-center"
                    onClick={() => {
                      handleSelectAdd();
                    }}
                  >
                    <GoPlus className="font-bold text-sm text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {applicableProducts?.map((product) => {
                    const { label: title, value: id } = product;
                    return (
                      <span
                        className="text-xs bg-gray-300 text-black p-1 rounded-sm flex items-center gap-1"
                        key={id}
                      >
                        {title.substring(0, 20)}...
                        <MdClear
                          className="cursor-pointer"
                          onClick={() => {
                            setApplicableProducts(
                              applicableProducts.filter(
                                (product) => product.value !== id
                              )
                            );
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mt-9 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isUpdateDiscountLoading &&
                    "cursor-not-allowed bg-opacity-90"
                  }`}
                >
                  {isUpdateDiscountLoading ? "Loading..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                    setApplicableProducts(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {type === "VIEW" && (
          <div className="p-5">
            <div className="border-b grid grid-cols-2 items-center relative">
              <div>
                <div className="block text-gray-700 text-sm font-bold uppercase px-5 py-4">
                  Products
                </div>
                <span className="p-5 text-xs block mt-[-35px]">
                  Products Belong To This Discount
                </span>
              </div>
              <div
                className="absolute top-[5px] right-[5px] bg-secondary p-3 rounded-md cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <IoClose className="text-white text-sm" />
              </div>
            </div>
            <div className="p-5 overflow-y-auto max-h-[500px]">
              {discount?.productDetails?.map((product) => {
                const { _id, title, image, description } = product;
                return (
                  <div key={_id} className="flex items-center gap-4 my-3">
                    <img src={image.url || ""} alt={""} className="w-[50px]" />
                    <div>
                      <p className="text-sm">{title}</p>
                      <p className="text-xs mt-1 text-light">
                        {description?.main?.substring(0, 30) ||
                          "dflsdlkfjsdklfjkj"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {type === "DELETE" && (
          <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-6 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
                viewBox="0 0 320.591 320.591"
                onClick={() => setIsModalOpen(false)}
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
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  className={`px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500 ${
                    isDeleteDiscountLoading && "cursor-wait bg-opacity-90"
                  }`}
                  onClick={() => {
                    handleDeleteDiscount();
                  }}
                >
                  {isDeleteDiscountLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Discounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [discountTarget, setDiscountTarget] = useState(null);

  const user = useSelector((state) => state.user.userInfo);

  const {
    data: discounts,
    isLoading: isDiscountsLoading,
    isError: isDiscountsError,
    error: discountsError,
    refetch: discountsRefetch,
  } = useGetAllDiscountsQuery(user?.accessToken);

  //   useEffect(() => {
  //     discountsRefetch();
  //   }, [isModalOpen]);

  if (isDiscountsLoading) {
    return <Loader />;
  }

  const discountsData = discounts?.data?.data;

  return (
    <div className="bg-[#F6F8FB]" style={{ height: "calc(100vh - 146px)" }}>
      <Modal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={modalType}
        discount={discountTarget}
        refetchDiscounts={discountsRefetch}
      />
      <Container>
        <div className="py-[30px] flex items-center justify-between">
          <div>
            <LocationRight list={["Discounts"]} />
            <div className="text-sm">Manage All Discounts.</div>
          </div>
          <div
            className="bg-secondary text-white p-3 rounded cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
              setModalType("ADD");
            }}
          >
            <button className="flex items-center gap-2">
              <GoPlus className="font-bold text-sm" />
              <div className="text-sm">New Discount</div>
            </button>
          </div>
        </div>
        <div className="py-4">
          <Table
            fields={[
              "Name",
              "Amount (%)",
              //   "Start Date",
              "Start Date",
              "End Date",
              "Status",
              "Products",
              "Actions",
            ]}
          >
            {discountsData?.length > 0 ? (
              discountsData.map((discount) => {
                const now = new Date();
                const { _id, name, startDate, endDate, amount } = discount;

                const newStartDate = new Date(startDate);
                const newEndtDate = new Date(endDate);

                const isActive = now >= newStartDate && now <= newEndtDate;

                return (
                  <div
                    className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                    key={_id}
                  >
                    <div className="flex-1 text-center">{name}</div>
                    <div className="flex-1 text-center">{amount}</div>
                    {/* <div className="flex-1 text-center">
                      {isoToRedableDate(startDate)}
                    </div> */}
                    <div className="flex-1 text-center">
                      {isoToRedableDate(startDate)}
                    </div>
                    <div className="flex-1 text-center">
                      {isoToRedableDate(endDate)}
                    </div>
                    <div className="flex-1 text-center">
                      {/* {isActive ? "active" : "not active"} */}
                      <span
                        className={`bg-opacity-5 text-xs px-4 py-2 rounded-full ${
                          isActive
                            ? "bg-primary text-primary"
                            : "bg-red-600 text-red-600"
                        }`}
                      >
                        {isActive ? "Active" : "Not Active"}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <button
                        className="flex items-center gap-2 bg-blue-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalType("VIEW");
                          setDiscountTarget(discount);
                        }}
                      >
                        <FaEye />
                        View
                      </button>
                    </div>
                    <div className="flex-1 text-center flex items-center justify-center gap-3">
                      <button
                        className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalType("EDIT");
                          setDiscountTarget(discount);
                        }}
                      >
                        <MdEdit />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-2 bg-red-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setDiscountTarget(discount);
                          setIsModalOpen(true);
                          setModalType("DELETE");
                        }}
                      >
                        <RiDeleteBin6Fill />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <h4>No discounts foound</h4>
            )}
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default Discounts;
