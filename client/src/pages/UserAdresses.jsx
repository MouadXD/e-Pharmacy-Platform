import Container from "../components/Container";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import {
  useGetAdresses,
  useDeleteAdresseMutation,
  useSetAdressDefaultMutation,
} from "../app/apiCalls/userCalls";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import Loader from "../components/Loader";
import { cartActions } from "../app/features/Cart";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import countriesList from "../helpers/countriesList";
import { useAddAdresseMutation } from "../app/apiCalls/userCalls";

const addAdressSchema = yup.object({
  fullName: yup.string().required(),
  phoneNumber: yup.string().min(12).max(12).required(),
  title: yup.string().required(),
  street: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zipCode: yup.string().required(),
  country: yup.string().required(),
});

const Modal = ({ isOpen, setIsModalOpen, type, refetchAdresses }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addAdressSchema),
  });

  const userInfo = useSelector((state) => state.user.userInfo);

  const {
    mutateAsync: createAdressAsync,
    isPending: isAddAdressLoading,
  } = useAddAdresseMutation(userInfo?.accessToken);

  const handleCreateAdress = async (requestBody) => {
    try {
      const isAdressCreated = await createAdressAsync(requestBody);
      if (isAdressCreated.data.status === 200) {
        toast.success("Adresse Creaed Success!");
        setIsModalOpen(false);
        reset();
        refetchAdresses();
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not create the address."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/1 lg:w-1/1">
        {type === "ADD" && (
          <div className="p-10">
            <form onSubmit={handleSubmit(handleCreateAdress)}>
              <div className="grid grid-cols-3 gap-5 mb-5">
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    Title
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., Home, Office"
                    {...register("title")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    Full Name
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., Mouad Boufas"
                    {...register("fullName")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    Phone Number
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., +212 727777777"
                    {...register("phoneNumber")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5 mb-5">
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    Street
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., 123 Main St"
                    {...register("street")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    City
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., New York"
                    {...register("city")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    State
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., NY"
                    {...register("state")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="discountName"
                  >
                    Zip Code
                  </label>
                  <input
                    id="discountName"
                    type="text"
                    placeholder="e.g., 10001"
                    {...register("zipCode")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold uppercase mb-[3px]"
                      htmlFor="discountName"
                    >
                      Country
                    </label>
                  </div>
                  <div className="w-full h-full relative">
                    <select
                      name="country"
                      className="w-full border border-secondary border-opacity-30 py-3 rounded-sm px-5 focus:outline-none text-secondary"
                      {...register("country")}
                    >
                      {countriesList.map((country, i) => (
                        <option
                          key={i}
                          value={country}
                          defaultChecked={i === 0}
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-9 grid grid-cols-2 gap-5">
                <div className="w-full flex items-center justify-between gap-2">
                  <button
                    type="submit"
                    className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                      isAddAdressLoading && "cursor-not-allowed bg-opacity-90"
                    }`}
                  >
                    {isAddAdressLoading ? "Loading..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const UserAdresses = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { changeShippingAdress } = cartActions;

  const [showAddOptions, setShowAddOptions] = useState(null);
  const [iaModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const {
    data: adressesData,
    isLoading: isAdressesLoading,
    refetch: refetchAdresses,
  } = useGetAdresses(userInfo?.accessToken, "", userInfo?.id);

  const { mutateAsync: setDefaultAdressAsync } = useSetAdressDefaultMutation(
    userInfo?.accessToken
  );

  const { mutateAsync: deleteAddressAsync } = useDeleteAdresseMutation(
    userInfo?.accessToken
  );

  const handleDeleteAddress = async (id) => {
    try {
      const isAddressDeleted = await deleteAddressAsync(id);
      if (isAddressDeleted.data.status === 200) {
        if (id === cart.shippingAdress?._id) {
          dispatch(changeShippingAdress(null));
        }
        refetchAdresses();
        toast.success("Address Deleted Success!");
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not delete the address."
      );
    }
  };

  const handleSetAdressDefault = async (id) => {
    try {
      const isAdressSetDefault = await setDefaultAdressAsync(id);
      if (isAdressSetDefault.data?.status === 200) {
        refetchAdresses();
        toast.success("Address set as default");
        setShowAddOptions(null);
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not update the default address."
      );
    }
  };

  if (isAdressesLoading) {
    return <Loader />;
  }

  return (
    <>
      <Modal
        isOpen={iaModalOpen}
        setIsModalOpen={setIsModalOpen}
        type={modalType}
        refetchAdresses={refetchAdresses}
      />
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-white text-4xl tracking-tight">
                  Adresses{" "}
                </h1>
              </div>
              <p className="text-white font-light">Manage your adresses.</p>
            </div>
            <div>
              {/* <Link to={"addNewAdresse"}> */}
              <button
                className="bg-white text-secondary text-sm px-4 py-3 rounded-sm flex items-center gap-2"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalType("ADD");
                }}
              >
                <FaPlus />
                New Adresse
              </button>
              {/* </Link> */}
            </div>
          </div>
        </Container>
      </div>
      <div className="my-10">
        <Container>
          <div className="min-h-screen">
            <div className="my-5 grid grid-cols-4 gap-3">
              {adressesData?.data?.data?.addresses?.length > 0 ? (
                adressesData?.data?.data?.addresses.map((adresse) => {
                  const {
                    _id,
                    fullName,
                    phoneNumber,
                    title,
                    street,
                    city,
                    country,
                    state,
                    zipCode,
                    isDefault,
                  } = adresse;
                  return (
                    <>
                      <div
                        className="bg-gray-50 border border-opacity-10 px-5 py-2 rounded-sm"
                        key={_id}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[1.4rem] my-2 flex items-center gap-2">
                            {title}
                            {isDefault && (
                              <span className="text-sm text-gray-400 font-light mb-[-3px]">
                                (Default)
                              </span>
                            )}
                          </h3>
                          <div className="relative">
                            {showAddOptions === _id ? (
                              <IoClose
                                className="text-[1.2rem] cursor-pointer"
                                onClick={() => {
                                  setShowAddOptions(null);
                                }}
                              />
                            ) : (
                              <BsThreeDotsVertical
                                className="text-[1.2rem] cursor-pointer"
                                onClick={() => {
                                  setShowAddOptions(_id);
                                }}
                              />
                            )}
                            {showAddOptions === _id && (
                              <div className="absolute top-[30px] z-[10] right-[2px]">
                                <div className="bg-white border shadow-sm w-[130px] rounded-sm">
                                  <button
                                    className="py-2 hover:bg-gray-100 w-full h-full px-4"
                                    onClick={() => {
                                      handleSetAdressDefault(_id);
                                    }}
                                  >
                                    Set Default ?
                                  </button>
                                  <button
                                    className="py-2 bg-red-600 text-white w-full h-full px-4 text-left flex items-center gap-2"
                                    onClick={() => {
                                      handleDeleteAddress(_id);
                                    }}
                                  >
                                    <AiFillDelete />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="my-2">
                          <div>
                            <span className="font-bold mr-2">{fullName}</span>
                            <span>+{phoneNumber}</span>
                          </div>
                          <div>
                            <div>{street}</div>
                            <div>
                              {city}, {state}, {country}, {zipCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <h4 className="text-md text-gray-500 font-light">
                  You have no adresses!
                </h4>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default UserAdresses;
