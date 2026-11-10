import LocationRight from "../../../components/LocationRight";
import Container from "../../../components/Container";
import { FaRegImages } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorInputMessage from "../../../components/ErrorInputMessage";
import { useState } from "react";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import Select from "react-select";
import { customStyles } from "../../../helpers/selectStyles";
import { useGetAllCategoriesQuery } from "../../../app/apiCalls/categoryCalls";
import {
  useCreateProductMutation,
  useUploadProdustImageMutation,
} from "../../../app/apiCalls/productsCalls";
import { MdClear } from "react-icons/md";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import validateImage from "../../../helpers/validateImage";
import { CiCircleCheck } from "react-icons/ci";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const productSchema = yup.object({
  title: yup.string().required(),
  price: yup.string().required(),
  quantity: yup.number().required(),
  mainDescription: yup.string().required(),
  expiredAt: yup.date().optional(),
});

const NewProduct = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const user = useSelector((state) => state.user.userInfo);

  const [file, setFile] = useState(null);

  const [category, setCategory] = useState(null);
  const [prescripted, setPrescripted] = useState(false);

  const [benefit, setBenefit] = useState("");
  const [benefits, setBenefits] = useState([]);

  const [use, setUse] = useState("");
  const [uses, setUses] = useState([]);

  const [safetyInfo, setSafetyInfo] = useState("");
  const [safetyInfos, setSafetyInfos] = useState([]);

  const [otherErrors, setOtherErrors] = useState({});

  const navigate = useNavigate();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetAllCategoriesQuery();

  const { mutateAsync: createProductAsync, isLoading: isCreateProductLoading } =
    useCreateProductMutation(user?.accessToken);

  const { mutateAsync: uploadPhotoAsync, isLoading } =
    useUploadProdustImageMutation(user?.accessToken);

  const categoriesSelect = categoriesData?.data?.data?.map((category) => {
    const { _id, title } = category;
    return {
      value: _id,
      label: title,
    };
  });

  const onSubmit = async (requestBody) => {
    requestBody = {
      ...requestBody,
      description: {
        main: requestBody.mainDescription,
        benefits,
        uses,
        safetyInformations: safetyInfos,
      },
      prescripted,
      categoryId: category?.value,
    };

    delete requestBody?.mainDescription;

    if (!category) {
      setOtherErrors({ ...otherErrors, category: "Category is required" });
    }

    console.log("category");

    if (!benefits) {
      setOtherErrors({ ...otherErrors, benefits: "Benefits is required" });
    }

    if (!uses) {
      setOtherErrors({ ...otherErrors, uses: "Uses is required" });
    }

    if (!safetyInfos) {
      setOtherErrors({
        ...otherErrors,
        safetyInfo: "Safety Informations is required",
      });
    }

    console.log(otherErrors);

    const ALLOWED_EXTENTIONS = ["png", "webp", "jpg", "jpeg"];
    const MAX_SIZE = 1300720; // 30kb

    const imgValidation = validateImage(file, MAX_SIZE, ALLOWED_EXTENTIONS);

    if (imgValidation) {
      toast.error(imgValidation);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const isProductCreated = await createProductAsync(requestBody);
      if (isProductCreated?.data?.status === 201) {
        const productId = isProductCreated?.data?.data?._id;
        const uploadImage = uploadPhotoAsync({
          image: formData,
          id: productId,
        });
        toast.promise(uploadImage, {
          loading: "Uploading Photo...",
          success: "Uploaded Success",
          error: "Upload Failed",
        });
        navigate("/dashboard/products");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="bg-[#F6F8FB] w-full pb-10">
        <Container>
          <DashboardHeader
            title={"New Medecine"}
            description={
              "*All fields are mandatory, except mentioned as (optional)."
            }
          />
          <form>
            <div
              className="grid gap-5 py-10"
              style={{ gridTemplateColumns: "70% 30%" }}
            >
              <div className="grid grid-cols-2 gap-5 focus:border-secondary">
                <div>
                  <label
                    htmlFor="title"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Title
                  </label>
                  <div className="w-[100%]">
                    <input
                      style={{
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      className={`p-3 w-[100%] text-sm rounded-sm ${
                        errors.title?.message
                          ? "border border-red-600 focus:outline-none"
                          : "border border-rgba-gray-400-25 focus:outline-secondary"
                      }`}
                      required={true}
                      type="text"
                      placeholder="Title"
                      id="title"
                      {...register("title")}
                    />
                    <ErrorInputMessage message={errors.title?.message} />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Category
                  </label>
                  <div className="w-[100%] focus:border-secondary">
                    <Select
                      options={categoriesSelect}
                      styles={customStyles("100%", "46px")}
                      onChange={(selectedOption) => {
                        setCategory(selectedOption);
                      }}
                    />
                    <ErrorInputMessage message={otherErrors?.category} />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center col-span-2 gap-5">
                  <div>
                    <label
                      htmlFor="price"
                      className="uppercase text-secondary text-sm font-bold"
                    >
                      Price
                    </label>
                    <div className="w-[100%] focus:border-2">
                      <input
                        style={{
                          border: "1px solid rgba(101,109,119,.16)",
                          boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                        }}
                        className="p-3 w-[100%] text-sm focus:outline-secondary rounded-sm"
                        type="text"
                        required={true}
                        placeholder="Price"
                        {...register("price", {
                          valueAsNumber: true,
                          required: "Price is required",
                          min: {
                            value: 0,
                            message: "Price must be at least 0",
                          },
                        })}
                      />
                      <ErrorInputMessage message={errors.price?.message} />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="uppercase text-secondary text-sm font-bold"
                    >
                      Quantity
                    </label>
                    <div className="w-[100%] focus:border-2 focus:border-secondary">
                      <input
                        style={{
                          border: "1px solid rgba(101,109,119,.16)",
                          boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                        }}
                        className="p-3 w-[100%] focus:outline-0 text-sm"
                        type="number"
                        required={true}
                        id="quantity"
                        placeholder="Quantity"
                        {...register("quantity", {
                          valueAsNumber: true,
                        })}
                      />
                      <ErrorInputMessage message={errors.quantity?.message} />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="expirationDate"
                      className="uppercase text-secondary text-sm font-bold"
                    >
                      Expired
                    </label>
                    <div className="w-[100%] focus:border-2 focus:border-secondary">
                      <input
                        style={{
                          border: "1px solid rgba(101,109,119,.16)",
                          boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                        }}
                        className="p-3 w-[100%] focus:outline-0 text-sm"
                        type="date"
                        required={true}
                        id="expirationDate"
                        {...register("expiredAt")}
                      />
                      <ErrorInputMessage message={errors.expiredAt?.message} />
                    </div>
                  </div>
                </div>
                <div
                  className="col-span-3 focus:border-secondar"
                  style={{
                    width: "calc(100% - 1.25rem)",
                  }}
                >
                  <label
                    htmlFor="mainDescription"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Main Description
                  </label>
                  <div className="w-[100%] focus:border-2 focus:border-secondary">
                    <textarea
                      style={{
                        border: "1px solid rgba(101,109,119,.16)",
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      className="p-3 w-[100%] focus:outline-0 text-sm"
                      type="text"
                      required={true}
                      placeholder="Description"
                      id="mainDescription"
                      rows={6}
                      {...register("mainDescription")}
                    />
                    <ErrorInputMessage
                      message={errors.mainDescription?.message}
                    />
                  </div>
                </div>
                <div
                  className="col-span-3 focus:border-secondar"
                  style={{
                    width: "calc(100% - 1.25rem)",
                  }}
                >
                  <label
                    htmlFor="benefits"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Benefits
                  </label>
                  <div className="w-[100%] focus:border-2 focus:border-secondary">
                    <input
                      style={{
                        border: "1px solid rgba(101,109,119,.16)",
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      value={benefit}
                      onChange={(e) => {
                        setBenefit(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (benefit !== "") {
                            setBenefits([...benefits, benefit]);
                            setBenefit("");
                          }
                        }
                      }}
                      className="p-3 w-[100%] focus:outline-0 text-sm"
                      type="text"
                      placeholder="Benefits"
                      id="benefits"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {benefits?.map((benefit, i) => {
                      return (
                        <span
                          className="text-xs bg-gray-300 text-black p-1 rounded-sm flex items-center gap-1"
                          key={i}
                        >
                          {benefit}
                          <MdClear
                            className="cursor-pointer"
                            onClick={() => {
                              setBenefits(
                                benefits.filter((item) => item !== benefit)
                              );
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div
                  className="col-span-3 focus:border-secondar"
                  style={{
                    width: "calc(100% - 1.25rem)",
                  }}
                >
                  <label
                    htmlFor="usse"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Uses
                  </label>
                  <div className="w-[100%] focus:border-2 focus:border-secondary">
                    <input
                      style={{
                        border: "1px solid rgba(101,109,119,.16)",
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      value={use}
                      onChange={(e) => {
                        setUse(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (use !== "") {
                            setUses([...uses, use]);
                            setUse("");
                          }
                        }
                      }}
                      className="p-3 w-[100%] focus:outline-0 text-sm"
                      type="text"
                      placeholder="Uses"
                      id="usse"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {uses?.map((useItem, i) => {
                      return (
                        <span
                          className="text-xs bg-gray-300 text-black p-1 rounded-sm flex items-center gap-1"
                          key={i}
                        >
                          {useItem}
                          <MdClear
                            className="cursor-pointer"
                            onClick={() => {
                              setUses(uses.filter((item) => item !== useItem));
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div
                  className="col-span-3 focus:border-secondar"
                  style={{
                    width: "calc(100% - 1.25rem)",
                  }}
                >
                  <label
                    htmlFor="safetyInfo"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Safety Informations
                  </label>
                  <div className="w-[100%] focus:border-2 focus:border-secondary">
                    <input
                      style={{
                        border: "1px solid rgba(101,109,119,.16)",
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      value={safetyInfo}
                      onChange={(e) => {
                        setSafetyInfo(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (safetyInfo !== "") {
                            setSafetyInfos([...safetyInfos, safetyInfo]);
                            setSafetyInfo("");
                          }
                        }
                      }}
                      className="p-3 w-[100%] focus:outline-0 text-sm"
                      type="text"
                      placeholder="Safety Informations"
                      id="safetyInfo"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {safetyInfos?.map((safetyItem, i) => {
                      return (
                        <span
                          className="text-xs bg-gray-300 text-black p-1 rounded-sm flex items-center gap-1"
                          key={i}
                        >
                          {safetyItem}
                          <MdClear
                            className="cursor-pointer"
                            onClick={() => {
                              setSafetyInfos(
                                uses.filter((item) => item !== safetyItem)
                              );
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="gap-5">
                {file && (
                  <div className="my-5 border shadow-md h-[520px] relative">
                    <img
                      src={URL?.createObjectURL(file)}
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor="image"
                      className="absolute top-[10px] right-[10px] cursor-pointer bg-white p-2 rounded-sm"
                    >
                      <AiOutlineCloudUpload className="text-md" />
                    </label>
                    <input
                      className="p-3 w-[100%] focus:outline-0 hidden"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])} // console.log(e.target.files)}
                      name="productImage"
                      placeholder="Description"
                      id="image"
                    />
                  </div>
                )}
                {!file && (
                  <div
                    className=" border-2 border-dashed h-[520px] mt-[23px] w-full"
                    style={
                      {
                        // border: "1px solid rgba(101,109,119,.16)",
                        // boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }
                    }
                  >
                    <label
                      htmlFor="image"
                      className="w-[100%] h-[100%] flex items-center justify-center gap-4 cursor-pointer"
                    >
                      <AiOutlineCloudUpload className="text-[2.5rem] text-gray-400" />
                      <div className="text-gray-400 font-light">
                        Product Image
                      </div>
                    </label>
                    <div className="w-[100%]">
                      <input
                        className="p-3 w-[100%] focus:outline-0 hidden"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])} // console.log(e.target.files)}
                        name="productImage"
                        placeholder="Description"
                        id="image"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-[1.30rem]">
                  <label
                    htmlFor="prescripted"
                    className="uppercase text-secondary text-sm font-bold"
                  >
                    Prescripted
                  </label>
                  <div className="mb-5 mt-3 flex items-center gap-4">
                    <div
                      style={{
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      className={`bg-white px-2 py-3 shadow-md flex-1 text-sm cursor-pointer ${
                        prescripted
                          ? "border-secondary border text-secondary"
                          : "border border-gray-400 border-opacity-25"
                      }`}
                      onClick={() => {
                        setPrescripted(true);
                      }}
                    >
                      Yes!
                    </div>
                    <div
                      style={{
                        boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                      }}
                      className={`bg-white px-2 py-3 shadow-md flex-1 text-sm ${
                        !prescripted
                          ? "border-secondary border text-secondary"
                          : "border border-gray-400 border-opacity-25"
                      } rounded-sm cursor-pointer`}
                      onClick={() => {
                        setPrescripted(false);
                      }}
                    >
                      No!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              type="button"
              className={`bg-secondary text-white px-6 py-3 rounded cursor-pointer`}
            >
              Save Details
            </button>
          </form>
        </Container>
      </div>
      <DevTool control={control} />
    </>
  );
};

export default NewProduct;
