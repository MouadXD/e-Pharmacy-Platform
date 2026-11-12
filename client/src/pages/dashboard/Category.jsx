import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import { GoPlus } from "react-icons/go";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import InputRounded from "../../components/InputRounded";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorInputMessage from "../../components/ErrorInputMessage";
import MessageAuthForm from "../../components/MessageAuthForm";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Loader from "../../components/Loader";
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../app/apiCalls/categoryCalls";
import Table from "../../components/Table";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import isoToRedableDate from "../../helpers/isoToRedableDate";

const categorySchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
});

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const [categoryId, setCategoryId] = useState(null);
  // const [editedCategory, setEditedCategory] = useState(null);
  // console.log("editedCategory", editedCategory);

  const [category, setCategory] = useState(null);

  const user = useSelector((state) => state.user.userInfo);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchAllCategories,
  } = useGetAllCategoriesQuery();

  const {
    mutateAsync: createCategoryAsync,
    isPending: isCreateCategoryLoading,
  } = useAddCategoryMutation(user?.accessToken);

  const {
    mutateAsync: updateCategoryAsync,
    isPending: isUpdateCategoryLoading,
  } = useUpdateCategoryMutation(user?.accessToken);

  const {
    mutateAsync: deleteCategoryAsync,
    isPending: isCategoryDeletedLoading,
  } = useDeleteCategoryMutation(user?.accessToken);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(categorySchema),
  });

  useEffect(() => {
    setValue("title", category?.title);
    setValue("description", category?.description);
  }, [category, setValue]);

  if (isCategoriesLoading) {
    return <Loader />;
  }

  if (isCategoriesError) {
    return <h1>{categoriesError.message}</h1>;
  }

  const categories = categoriesData?.data?.data;

  const onSubmit = async (requestBody) => {
    if (isCreateCategoryLoading) {
      return;
    }
    try {
      const response = await createCategoryAsync(requestBody);

      if (response?.status === 201) {
        toast.success("Category created success!");
        setIsModalOpen(false);
        refetchAllCategories();
        reset();
      }
    } catch (e) {
      // console.log(e);
      toast.error(e.response.data.message || "Something went wrong!");
    }
  };

  const handleUpdateCategory = async (requestBody) => {
    // const requestBody = {
    //   title: category.title,
    //   description: category.description,
    // };

    try {
      const response = await updateCategoryAsync({
        id: category?._id,
        body: requestBody,
      });

      if (response?.status === 200) {
        toast.success("Category updated success!");
        setIsEditModalOpen(false);
        refetchAllCategories();
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const handleDeleteCategory = async () => {
    if (isCategoryDeletedLoading) {
      return;
    }
    try {
      const isCategoryDeleted = await deleteCategoryAsync(category?._id);
      if (isCategoryDeleted?.data?.status === 200) {
        setIsDeleteModalOpen(false);
        refetchAllCategories();
        toast.success("Deleted Success");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="bg-[#F6F8FB] min-h-screen">
        {isModalOpen && (
          <Modal>
            <div className="">
              <form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Pain Relief, Vitamins, Prescription Medicines"
                    {...register("title")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700 ${
                      errors.title ? "border-red-500" : ""
                    }`}
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
                    htmlFor="title"
                  >
                    Description
                  </label>
                  <textarea
                    id="title"
                    type="text"
                    rows={4}
                    style={{ resize: "none" }}
                    maxLength={200}
                    placeholder="e.g. Provide a detailed description of your item or service..."
                    {...register("description")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700 `}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className="mt-9 flex items-center justify-between gap-5">
              <button
                className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200`}
                onClick={handleSubmit(onSubmit)}
                disabled={isCreateCategoryLoading}
              >
                {isCreateCategoryLoading ? "Loading..." : "Save"}
              </button>
              <button
                className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}

        {isEditModalOpen && (
          <Modal>
            <div className="">
              <form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 uppercase"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Pain Relief, Vitamins, Prescription Medicines"
                    // onChange={(e) => {
                    //   setCategory({ ...category, title: e.target.value });
                    // }}
                    // value={category && category?.title}
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
                    htmlFor="title"
                  >
                    Description
                  </label>
                  <textarea
                    id="title"
                    type="text"
                    rows={4}
                    style={{ resize: "none" }}
                    maxLength={200}
                    placeholder="e.g. Provide a detailed description of your item or service..."
                    // value={category && category?.description}
                    // onChange={(e) => {
                    //   setCategory({ ...category, description: e.target.value });
                    // }}
                    {...register("description")}
                    className={`w-full p-3 border border-gray-300 text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-700`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs italic mt-2">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className="mt-9 flex items-center justify-between gap-5">
              <button
                className={`flex-1 bg-green-700 text-white p-3 rounded hover:bg-green-800 transition duration-200 ${
                  isUpdateCategoryLoading && "cursor-not-allowed bg-opacity-90"
                }`}
                onClick={handleSubmit(handleUpdateCategory)}
                disabled={isUpdateCategoryLoading}
              >
                {isUpdateCategoryLoading ? "Loading..." : "Save Changes"}
              </button>
              <button
                className="flex-1 border border-gray-300 text-gray-700 p-3 rounded hover:bg-gray-100 transition duration-200"
                onClick={() => {
                  setIsEditModalOpen(false);
                  // setEditedCategory(null);
                  setCategory(null);
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-md p-6 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
                viewBox="0 0 320.591 320.591"
                // onClick={() => setIsModalOpen(false)}
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
                  className={`px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500 ${
                    isCategoryDeletedLoading &&
                    "cursor-not-allowed bg-opacity-90"
                  }`}
                  onClick={() => {
                    handleDeleteCategory();
                  }}
                  disabled={isCategoryDeletedLoading}
                >
                  {isCategoryDeletedLoading ? "Loading..." : "Delete"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Container>
          <div className="py-[30px] flex items-center justify-between">
            <div>
              <LocationRight list={["Categories"]} />
              <div className="text-sm">Explore all categories.</div>
            </div>
            <div
              className="bg-secondary text-white p-3 rounded cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <button className="flex items-center gap-2">
                <GoPlus className="font-bold text-sm" />
                <div className="text-sm">Add New Category</div>
              </button>
            </div>
          </div>
          <div className="py-4">
            <Table
              fields={[
                "Name",
                "Description",
                "Total Products",
                "Creation Date",
                "Actions",
              ]}
            >
              {categories.map((category) => {
                const { _id, title, totalProducts, createdAt } = category;
                return (
                  <div
                    className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                    key={_id}
                  >
                    <div className="flex-1 text-center">{title}</div>
                    <div className="flex-1 text-center">
                      {category?.description || "----"}
                    </div>
                    <div className="flex-1 text-center">{totalProducts}</div>
                    <div className="flex-1 text-center">
                      {isoToRedableDate(createdAt)}
                    </div>

                    <div className="flex-1 text-center flex items-center justify-center gap-3">
                      {/* <button className="flex items-center gap-2 bg-blue-500 p-2  rounded-sm text-white">
                        <FaEye />
                        View
                      </button> */}
                      <button
                        className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setCategory(category);
                        }}
                      >
                        <MdEdit />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-2 bg-red-500 p-2  rounded-sm text-white"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setCategory(category);
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
          {/* <div>
            <Pagination
              next={true}
              previous={true}
              totalPages={3}
              currentPage={2}
              limit={5}
            />
          </div> */}
        </Container>
      </div>
    </>
  );
};

export default Category;
