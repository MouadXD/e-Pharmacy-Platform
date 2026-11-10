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
import {
  useGetAdsQuery,
  useCreateAdsMutation,
  useUploadAdImageMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} from "../../app/apiCalls/adsCalls";
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
import { FaImage } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";

const adsSchema = yup.object({
  title: yup
    .string()
    .required("Ad title is required")
    .max(100, "Ad title cannot be longer than 100 characters"),
  image: yup
    .mixed()
    .required("An image is required")
    .test("fileSize", "The file is too large", (value) => {
      return value && value[0] && value[0].size <= 2 * 1024 * 1024; // 2MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value &&
        value[0] &&
        ["image/jpeg", "image/png", "image/gif"].includes(value[0].type)
      );
    }),
  startDate: yup
    .date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date cannot be before start date"),
});

const Modal = ({ isOpen, setIsModalOpen, type, ad = null, refetchAds }) => {
  const [applicableProducts, setApplicableProducts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const user = useSelector((state) => state.user.userInfo);

  const now = new Date();

  const newStartDate = new Date(ad?.startDate);
  const newEndtDate = new Date(ad?.endDate);

  const isActive = now >= newStartDate && now <= newEndtDate;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(adsSchema),
  });

  const watchAllFields = watch();

  const {
    mutateAsync: createAdsAsync,
    isPending: isCreateAdsLoading,
    isError: isCreateAdsError,
    error: createAdsError,
  } = useCreateAdsMutation(user?.accessToken);

  const {
    mutateAsync: uploadImageAsync,
    isPending: isUploadImageLoading,
    isError: isUploadImageError,
    error: uploadAdsError,
  } = useUploadAdImageMutation(user?.accessToken);

  const {
    mutateAsync: updateAdAsync,
    isPending: isUpdateAdLoading,
    isError: isUpdateAdError,
    error: updateAdError,
  } = useUpdateAdMutation(user?.accessToken);

  const {
    mutateAsync: deleteAdAsync,
    isPending: isDeleteAdLoading,
    isError: isDeleteAdError,
    error: deleteAdError,
  } = useDeleteAdMutation(user?.accessToken);

  const handleCreateAds = async (requestBody) => {
    const file = requestBody.image;

    delete requestBody.image;

    const formData = new FormData();
    formData.append("image", file[0]);

    let loadingToastId;

    try {
      loadingToastId = toast.loading("Loading...");
      const createAdsResponse = await createAdsAsync(requestBody);

      if (createAdsResponse.status == 201) {
        const adId = createAdsResponse?.data?.data?._id;
        await uploadImageAsync({
          id: adId,
          body: formData,
        });

        toast.success("Ads Created Success");
        setIsModalOpen(false);
        refetchAds();
        reset();
      }
    } catch (e) {
      console.log(e);
      //   toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
    }
  };

  const handleDeleteAd = async () => {
    let deletingToastId;

    try {
      deletingToastId = toast.loading("Loading...");
      const deletedAdResponse = await deleteAdAsync(ad?._id);
      if (deletedAdResponse.status == 200) {
        toast.success("Ad deleted success!");
        setIsModalOpen(false);
        refetchAds();
        reset();
      }
    } catch (e) {
      toast.error(e.response.data.message || "Something went wrong");
    } finally {
      if (deletingToastId) {
        toast.dismiss(deletingToastId);
      }
    }
  };

  const handleUpdateAd = async (requestBody) => {
    console.log(requestBody);
  };

  useEffect(() => {
    if (type === "EDIT") {
      setValue("title", ad?.title || "");
      setValue("startDate", ad?.startDate?.substring(0, 10) || "");
      setValue("endDate", ad?.endDate?.substring(0, 10) || "");
    }
  }, [ad, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        {type === "ADD" && (
          <div className="p-5">
            <form onSubmit={handleSubmit(handleCreateAds)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
                  Image
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="adImage"
                    className="cursor-pointer border-dashed border-2 w-full h-[200px] p-3 rounded transition duration-200 flex items-center justify-center"
                  >
                    {watchAllFields?.image ? (
                      <div className="flex items-center justify-center w-full">
                        <img
                          src={URL?.createObjectURL(watchAllFields?.image[0])}
                          alt=""
                        />
                      </div>
                    ) : (
                      <AiOutlineCloudUpload className="text-3xl text-gray-200" />
                    )}
                  </label>

                  <input
                    id="adImage"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="hidden"
                  />

                  {errors.image && (
                    <p className="text-red-500 text-xs italic mt-2 ml-2">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="adTitle"
                >
                  Title
                </label>
                <input
                  id="adTitle"
                  type="text"
                  placeholder="e.g. New Product Launch"
                  {...register("title")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.title.message}
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
              <div className="mt-9 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isCreateAdsLoading && "cursor-wait bg-opacity-90"
                  }`}
                >
                  {isCreateAdsLoading || isUploadImageLoading
                    ? "Loading..."
                    : "Save"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {type === "EDIT" && (
          <div className="p-5 max-h-[700px]  overflow-y-auto">
            <form onSubmit={handleSubmit(handleUpdateAd)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 uppercase">
                  Image
                </label>
                <div className="flex items-center">
                  <label
                    htmlFor="adImage"
                    className="cursor-pointer bg-gray-100 border w-full min-h-[200px] text-white rounded hover:bg-gray-200 transition duration-200 flex items-center justify-center"
                  >
                    {watchAllFields?.image ? (
                      <div className="flex items-center justify-center w-full min-h-[200px] overflow-hidden">
                        <img
                          src={ad.image.url}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <FaImage className="text-xl" />
                    )}
                  </label>
                  <input
                    id="adImage"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="hidden"
                  />

                  {errors.image && (
                    <p className="text-red-500 text-xs italic mt-2 ml-2">
                      {errors.image.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                  htmlFor="adTitle"
                >
                  Title
                </label>
                <input
                  id="adTitle"
                  type="text"
                  placeholder="e.g. New Product Launch"
                  {...register("title")}
                  className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.title.message}
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
              <div className="mt-9 flex items-center justify-between gap-5">
                <button
                  type="submit"
                  className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                    isCreateAdsLoading && "cursor-wait bg-opacity-90"
                  }`}
                >
                  {isCreateAdsLoading ? "Loading..." : "Save"}
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {type === "VIEW" && (
          <div className="p-5">
            <div className="border-b grid grid-cols-2 items-center">
              <div>
                <div className="block text-gray-700 text-sm font-bold uppercase px-5 py-4">
                  Products
                </div>
                <span className="p-5 text-xs block mt-[-35px]">
                  Products Belong To This Discount
                </span>
              </div>
              <div
                className="text-right"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                <IoClose className="cursor-pointer text-2xl inline-block" />
              </div>
            </div>
            <div className="p-5 overflow-y-auto max-h-[500px]">
              {discount?.productDetails?.map((product) => {
                const { _id, title, image, description } = product;
                return (
                  <div key={_id} className="flex items-center gap-4 my-3">
                    <img src={image.url || ""} alt={""} className="w-[30px]" />
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
                    isDeleteAdLoading && "cursor-wait bg-opacity-90"
                  }`}
                  onClick={() => {
                    handleDeleteAd();
                  }}
                >
                  {isDeleteAdLoading ? "Deleting..." : "Delete"}
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

const Advertissement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [adTargeted, setAdTargeted] = useState(null);

  const user = useSelector((state) => state.user.userInfo);

  const {
    data: adsData,
    isLoading: isAdsLoading,
    isError: isAdsError,
    error: adsError,
    refetch: refetchAds,
  } = useGetAdsQuery();

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

  console.log("adsData", adsData);

  if (isDiscountsLoading) {
    return <Loader />;
  }

  const discountsData = discounts?.data?.data;

  return (
    <div className="bg-[#F6F8FB] min-h-screen">
      <Modal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={modalType}
        ad={adTargeted}
        refetchAds={refetchAds}
      />
      <Container>
        <div className="py-[30px] flex items-center justify-between">
          <div>
            <LocationRight list={["Advertissement"]} />
            <div className="text-sm">Manage All Ads.</div>
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
              <div className="text-sm">New Ads</div>
            </button>
          </div>
        </div>
        <div className="py-4">
          <Table
            fields={[
              "Image",
              //   "Priority",
              "Title",
              //   "Start Date",
              "Start Date",
              "End Date",
              "Status",
              "Actions",
            ]}
          >
            {adsData?.data?.data?.length > 0 ? (
              adsData?.data?.data.map((ad) => {
                const now = new Date();
                const {
                  _id,
                  title,
                  startDate,
                  endDate,
                  page,
                  image,
                  priority,
                } = ad;

                const newStartDate = new Date(startDate);
                const newEndtDate = new Date(endDate);

                const isActive = now >= newStartDate && now <= newEndtDate;

                return (
                  <div
                    className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                    key={_id}
                  >
                    <div className="flex-1 text-center">
                      <img src={image.url || ""} alt="" />
                    </div>
                    {/* <div className="flex-1 text-center">{priority}</div> */}
                    <div className="flex-1 text-center">{title}</div>
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
                    <div className="flex-1 text-center flex items-center justify-center gap-3">
                      {/* <button
                        className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalType("EDIT");
                          setAdTargeted(ad);
                        }}
                      >
                        <MdEdit />
                        Edit
                      </button> */}
                      <button
                        className="flex items-center gap-2 bg-red-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setAdTargeted(ad);
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

export default Advertissement;
