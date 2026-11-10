import Container from "../../../components/Container";
import SingleProduct from "../../../components/dashboard/SingleProduct";
import Pagination from "../../../components/Pagination";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import Table from "../../../components/Table";
import Loader from "../../../components/Loader";
import {
  usetGetAllProducts,
  useDeleteProductMutation,
} from "../../../app/apiCalls/productsCalls";
import { useGetAllCategoriesQuery } from "../../../app/apiCalls/categoryCalls";
import { useState } from "react";
import Select from "react-select";
import { customStyles } from "../../../helpers/selectStyles";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Modal = ({ isOpen, setIsModalOpen, product, type, refetchProducts }) => {
  if (!isOpen) return null;

  const user = useSelector((state) => state.user.userInfo);

  const { mutateAsync: deleteProductAsync, isLoading: isDeleteProductLoading } =
    useDeleteProductMutation(user?.accessToken);

  const handleDeleteProduct = async () => {
    try {
      const isProductDeleted = deleteProductAsync(product._id);

      toast.promise(isProductDeleted, {
        loading: "Deleting...",
        success: "Product deleted successfully",
        error: "Error deleting product",
      });
      setIsModalOpen(false);
      isProductDeleted.then(() => {
        refetchProducts();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/1 overflow-y-auto max-h-[700px]">
        {type === "VIEW" && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative flex gap-5 p-10">
              <div
                className="absolute top-[5px] right-[5px] bg-secondary p-3 rounded-md cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <IoClose className="text-white text-sm" />
              </div>
              <div className="w-[50%]">
                <img
                  src={product.image.url}
                  alt="product image"
                  className="rounded-lg border"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <div className="w-2/3 p-4">
                <h2 className="text-2xl font-normal uppercase text-gray-800 mb-4">
                  {product.title}
                </h2>
                <p className="text-gray-700 text-sm mb-6">
                  {product.description.main}
                </p>

                <div className="flex justify-between items-center mb-6">
                  <div className="flex-1 pr-4">
                    <h3 className="text-md font-extrabold text-gray-700 uppercase mb-1">
                      Price
                    </h3>
                    <p className="text-md text-gray-900">${product.price}</p>
                  </div>
                  {product.discountInfo && (
                    <div className="flex-1 pr-4">
                      <h3 className="text-md font-extrabold text-gray-700 uppercase mb-1">
                        Discount
                      </h3>
                      <p className="text-md text-gray-900">
                        {product.discountInfo.amount}%
                      </p>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-extrabold text-gray-700 uppercase mb-1">
                      Quantity
                    </h3>
                    <p className="text-md text-gray-900">{product.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-10 pb-10">
              {product.description.benefits && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    Benefits
                  </h3>
                  <ul className="text-sm text-gray-900 list-disc pl-4">
                    {product.description.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description.uses && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    Uses
                  </h3>
                  <ul className="text-sm text-gray-900 list-disc pl-4">
                    {product.description.uses.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description.safetyInformations && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                    Safety Information
                  </h3>
                  <ul className="text-sm text-gray-900 list-disc pl-4">
                    {product.description.safetyInformations.map(
                      (info, index) => (
                        <li key={index}>{info}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-1">
                  Expiration Date
                </h3>
                <p className="text-sm text-gray-900">
                  {new Date(product.expiredAt).toLocaleDateString()}
                </p>
              </div>
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
                <p className="text-sm text-gray-500 mt-4">
                  {/* This will delete your product from catalog, are you sure ? */}
                  {product.title}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                  onClick={() => {
                    handleDeleteProduct();
                  }}
                >
                  Delete
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

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const [modalType, setModalType] = useState("VIEW");

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductaError,
    error: productsError,
    refetch: refetchProducts,
  } = usetGetAllProducts("", category?.value, searchQuery, page);

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: cateoriesError,
  } = useGetAllCategoriesQuery();

  console.log(searchQuery);

  if (isProductsLoading) {
    return <Loader />;
  }

  if (isProductaError) {
    return <h1>{productsError.message}</h1>;
  }

  if (!isProductsLoading) {
    console.log(productsData);
  }

  const categoriesSelect = categoriesData?.data?.data?.map((category) => {
    const { _id, title } = category;
    return { value: _id, label: title };
  });

  const handleSelectChange = (selectedOption) => {
    setCategory(selectedOption);
    setTimeout(() => {
      refetchProducts();
    }, 100);
  };

  const paginationInfo = productsData?.data?.pagination;

  return (
    <div className="bg-[#F6F8FB] min-h-screen">
      <Modal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        product={product}
        type={modalType}
        refetchProducts={refetchProducts}
      />
      <Container>
        <div className="flex items-center justify-between">
          <DashboardHeader
            title={"Latest Products"}
            description={"List of medicines available for sales."}
          />
          <Link
            to={"/dashboard/products/new"}
            className="bg-secondary text-white p-3 rounded items-end mt-[30px]"
          >
            <button className="flex items-center gap-2">
              <GoPlus className="font-bold text-sm" />
              <div className="text-sm">New Product</div>
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-between my-[30px]">
          <div
            className="w-[30%] rounded bg-white"
            style={{
              border: "1px solid rgba(101,109,119,.16)",
              boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
            }}
          >
            <input
              className="p-4 w-full focus:outline-0"
              type="text"
              placeholder="Search Medecine Inventory..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTimeout(() => {
                  refetchProducts();
                }, 100);
              }}
            />
          </div>
          <Select
            options={categoriesSelect}
            styles={customStyles("180px", "50px")}
            onChange={handleSelectChange}
            isClearable={true}
          />
        </div>
        {productsData?.data?.data?.length > 0 ? (
          <>
            <div>
              <Table
                fields={[
                  "Medecine Name",
                  "Medecine ID",
                  "Group Name",
                  "Price (DHs)",
                  "Stock in Qty",
                  "Actions",
                ]}
              >
                {productsData?.data?.data?.map((product) => {
                  const { _id, title, quantity, price, categoryInfo } = product;
                  return (
                    <div
                      className="flex items-center justify-between border-b border-r border-l text-sm bg-white py-4 px-5"
                      key={_id}
                    >
                      <div className="flex-1 text-center">{title}</div>
                      <div className="flex-1 text-center">
                        #{_id?.substring(0, 8)}
                      </div>
                      <div className="flex-1 text-center">
                        {categoryInfo?.title}
                      </div>
                      <div className="flex-1 text-center">{price}</div>
                      <div className="flex-1 text-center">{quantity}</div>
                      <div className="flex-1 text-center flex items-center justify-center gap-3">
                        <button
                          className="flex items-center gap-2 bg-blue-500 p-2  rounded-sm text-white"
                          onClick={() => {
                            setModalType("VIEW");
                            setProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye />
                          View
                        </button>
                        <Link to={`/dashboard/products/edit/${_id}`}>
                          <button className="flex items-center gap-2 bg-gray-500 p-2  rounded-sm text-white">
                            <MdEdit />
                            Edit
                          </button>
                        </Link>
                        <button
                          className="flex items-center gap-2 bg-red-500 p-2  rounded-sm text-white"
                          onClick={() => {
                            setModalType("DELETE");
                            setProduct(product);
                            setIsModalOpen(true);
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
            <div className="flex items-center py-10 justify-end">
              {paginationInfo?.totalPages > 1 && page > 1 && (
                <div
                  className="mr-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      setTimeout(() => {
                        refetchProducts();
                      }, 100);
                    }
                  }}
                >
                  <GrFormPrevious />
                </div>
              )}
              {Array.from(
                { length: paginationInfo?.totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <div
                  key={pageNumber}
                  className={`text-sm rounded-sm cursor-pointer w-[30px] h-[30px] flex items-center justify-center ${
                    pageNumber === page ? "bg-secondary text-white" : ""
                  }`}
                  onClick={() => {
                    setPage(pageNumber);
                    setTimeout(() => {
                      refetchProducts();
                    }, 100);
                  }}
                >
                  {pageNumber}
                </div>
              ))}
              {page !== paginationInfo?.totalPages && (
                <div
                  className="ml-1 bg-secondary bg-opacity-5 p-2 rounded-sm cursor-pointer"
                  onClick={() => {
                    if (page < paginationInfo?.totalPages) {
                      setPage(page + 1);
                      setTimeout(() => {
                        refetchProducts();
                      }, 100);
                    }
                  }}
                >
                  <MdNavigateNext />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <h4 className="text-md text-gray-500 font-light">
              No Products Found!
            </h4>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;
