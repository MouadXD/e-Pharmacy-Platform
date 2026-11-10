import Container from "../components/Container";
import { useNavigate } from "react-router-dom";
import InputRounded from "../components/InputRounded";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddAdresseMutation } from "../app/apiCalls/userCalls";
import { useSelector } from "react-redux";
import countriesList from "../helpers/countriesList";
import { UserInformationsInputs } from "../pages/UserInformations";

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

const CreateAdresse = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(addAdressSchema),
  });

  const {
    mutateAsync: createAdressAsync,
    isPending: isAddAdressLoading,
    isError: isAddAdressError,
    error: adresseError,
  } = useAddAdresseMutation(userInfo?.accessToken);

  const handleAddAdresse = async (data) => {
    try {
      const isAdressCreated = await createAdressAsync(data);
      if (isAdressCreated.data.status === 200) {
        toast.success("Adresse Creaed Success!");
        navigate("/userAdresses");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="my-5">
      <Container>
        <div>
          <h1 className="text-secondary text-2xl py-5 font-bold">
            Add New Adresse
          </h1>
          <div className="my-10 grid grid-cols-3 gap-4">
            <UserInformationsInputs
              label="Title"
              register={register("title")}
              placeholder="e.g., Home, Office"
              errorMessage={errors.title?.message}
            />
            <UserInformationsInputs
              label="Full Name"
              register={register("fullName")}
              placeholder="e.g., Mouad Boufas"
              errorMessage={errors.fullName?.message}
            />
            <UserInformationsInputs
              label="Phone Number"
              register={register("phoneNumber")}
              placeholder="e.g., +212 727777777"
              errorMessage={errors.phoneNumber?.message}
            />
          </div>
          <div className="my-10 grid grid-cols-3 gap-4">
            <UserInformationsInputs
              label="Street"
              placeholder="e.g., 123 Main St"
              register={register("street")}
              errorMessage={errors.street?.message}
            />
            <UserInformationsInputs
              label="City"
              placeholder="e.g., New York"
              register={register("city")}
              errorMessage={errors.city?.message}
            />
            <UserInformationsInputs
              label="State"
              placeholder="e.g., NY"
              register={register("state")}
              errorMessage={errors.state?.message}
            />
          </div>
          <div className="my-10 grid grid-cols-2 gap-4">
            <UserInformationsInputs
              label="Zip Code"
              placeholder="e.g., 10001"
              register={register("zipCode")}
              errorMessage={errors.zipCode?.message}
            />
            <div className="flex flex-col">
              <div>
                <span className="text-secondary text-md font-extrabold mb-[3px]">
                  Country
                </span>
              </div>
              <div className="w-full h-full relative">
                <select
                  name="country"
                  className="w-full border border-secondary border-opacity-30 py-3 rounded-sm px-5 focus:outline-none text-secondary"
                  {...register("country")}
                >
                  {countriesList.map((country, i) => (
                    <option key={i} value={country} defaultChecked={i === 0}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <InputRounded
              label="Country"
              placeholder="e.g., USA"
              register={register("country")}
            /> */}
          </div>
        </div>
        <div>
          <button
            className="bg-secondary text-white text-sm p-4 rounded-sm cursor-pointer"
            onClick={handleSubmit(handleAddAdresse)}
          >
            Add Adresse
          </button>
        </div>
      </Container>
    </div>
  );
};

export default CreateAdresse;
