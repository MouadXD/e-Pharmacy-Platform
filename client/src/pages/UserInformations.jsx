import Container from "../components/Container";
import { useState, useEffect } from "react";
import { FaMale } from "react-icons/fa";
import { FaFemale } from "react-icons/fa";
import {
  useGetUserInfo,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../app/apiCalls/userCalls";
import { useChangePasswordMutation } from "../app/apiCalls/authCalls";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../app/features/User";
import Loader from "../components/Loader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

export const UserInformationsInputs = ({
  label = "",
  type = "text",
  placeholder = "",
  register,
  bottomMessage = false,
  errorMessage = "",
}) => {
  return (
    <div className="flex flex-col">
      <div>
        <span className="text-secondary text-md font-extrabold mb-[3px]">
          {label}
        </span>
        {/* {requiredField && <span className={"text-red-500"}>*</span>} */}
      </div>
      <input
        type={type}
        className={`${
          errorMessage ? "border-red-500" : "border border-opacity-30"
        } border py-3 rounded-sm px-5 focus:outline-none text-secondary`}
        // disabled={disabled}
        placeholder={placeholder}
        // value={value}
        {...register}
      />
      {bottomMessage ||
        (errorMessage && (
          <span
            className={`text-xs font-light ${
              errorMessage ? "text-red-500" : "text-secondary"
            } mt-1`}
          >
            {errorMessage}
          </span>
        ))}
    </div>
  );
};

const AttentionAlert = () => {
  return (
    <div
      className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4"
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="flex-shrink-0 size-4 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
        </div>
        <div className="ms-4">
          <h3 className="text-sm font-semibold">Profile Incompleted</h3>
          <div className="mt-1 text-sm text-yellow-700">
            Please complete all required fields in your profile settings before
            proceeding.
          </div>
        </div>
      </div>
    </div>
  );
};

const userInfoSchema = yup.object({
  firstName: yup.string().required("First Name field is required!"),
  lastName: yup.string().required("Last Name field is required!"),
  birthdayDate: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid Birthday Date",
  }),
  phoneNumber: yup.string().min(12).max(12),
});

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Old Password field is required!"),
  newPassword: yup.string().required("New Password field is required!"),
});

const UserInformations = () => {
  const [gendre, setGendre] = useState("male");

  const userInfo = useSelector((state) => state.user.userInfo);
  const { logout } = userActions;
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(userInfoSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordFormErrors },
    setValue: setPasswordValues,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUserData,
  } = useGetUserInfo(userInfo?.id, userInfo?.accessToken);

  const {
    mutateAsync: updateUserAsync,
    isPending: isUpdateUserLoading,
  } = useUpdateUserMutation(userInfo?.id, userInfo?.accessToken);

  const {
    mutateAsync: deleteUserAsync,
    isPending: isDeleteLoading,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteUserMutation(userInfo?.id, userInfo?.accessToken);

  const {
    mutateAsync: changePasswordAsync,
    isPending: isChangePasswordLoading,
  } = useChangePasswordMutation(userInfo?.id, userInfo?.accessToken);

  useEffect(() => {
    const user = userData?.data?.user;
    if (!user) return;

    setValue("firstName", user.firstName);
    setValue("lastName", user.lastName);
    setValue("email", user.email);
    setValue("phoneNumber", user.phoneNumber?.number || "");
    setValue("birthdayDate", user.birthdayDate || "");
    setGendre(user.gendre);
  }, [setValue, userData]);

  const handleUpdateUser = async (body) => {
    delete body.email;
    body.phoneNumber = {
      number: +body.phoneNumber,
    };
    const bodyData = { ...body, gendre };

    const isUserUpdated = await updateUserAsync(bodyData);

    if (isUserUpdated.data.status === 200) {
      toast.success("User Updated Successfully!");
      refetchUserData();
    }
  };

  const handleChangePassword = async (data) => {
    try {
      const isPasswordChanged = await changePasswordAsync(data);

      if (isPasswordChanged.data.status === 200) {
        setPasswordValues("oldPassword", "");
        setPasswordValues("newPassword", "");
        dispatch(logout());
        toast.success("Password changed. Please log in again.");
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not change your password."
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeleteLoading) {
      toast.loading("Deleting Account...");
    }

    const isUserDeleted = await deleteUserAsync();

    if (isUserDeleted?.data.status === 200) {
      dispatch(logout());
      toast.success("Account Deleted Successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    if (isDeleteError) {
      toast.error(
        deleteError?.response?.data?.message || "Could not delete the account."
      );
    }
  };

  const deleteAccountModel = () => {
    toast.custom((t) => {
      return (
        <div className="bg-white p-3 shadow-2xl rounded-md">
          <h2 className="my-1">
            Are you sure you want to delete your account?
          </h2>
          <div className="flex items-center gap-5 p-4">
            <button
              className="bg-red-500 text-white text-sm px-3 py-2 rounded-sm cursor-pointer w-full"
              onClick={() => {
                // console.log("click delete");
                handleDeleteAccount();
                // toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
            <button
              className="bg-gray-400 text-white text-sm px-3 py-2 rounded-sm cursor-pointer w-full"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    });
  };

  if (isUserLoading) {
    return <Loader />;
  }

  if (isUserError) {
    return <h1>{userError.message}</h1>;
  }

  return (
    <>
      <div className="bg-[url('http://localhost:5173/src/static/banner.png')] bg-no-repeat bg-cover">
        <Container>
          <div className="py-10">
            <div className="flex items-center gap-3">
              <h1 className="font-semibold text-white text-4xl tracking-tight">
                Profile{" "}
              </h1>
            </div>
            <p className="text-white font-light">Manage your profile.</p>
          </div>
        </Container>
      </div>
      <div className="my-20">
        <Container>
          <div className="my-10">
            {/* <h1 className="font-extrabold text-2xl text-secondary">
              User Informations
            </h1> */}
            {!userData.data.isProfileComplete && (
              <div className="mt-5">
                <AttentionAlert />
              </div>
            )}
            {/* <div
            class="bg-orange-100 mt-5 border-l-4 border-orange-500 text-orange-700 p-4"
            role="alert"
          >
            <p class="font-bold">Be Warned</p>
            <p>Please complete your profile informations!</p>
          </div> */}

            <div className="my-10">
              <div className="grid grid-cols-2 gap-5">
                <UserInformationsInputs
                  label={"First Name"}
                  // value={userData.data.user.firstName}
                  requiredField={true}
                  register={register("firstName", { required: true })}
                  errorMessage={errors.firstName?.message}
                />
                <UserInformationsInputs
                  label={"Last Name"}
                  // value={userData.data.user.lastName}
                  requiredField={true}
                  register={register("lastName", { required: true })}
                  errorMessage={errors.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <UserInformationsInputs
                  label={"Email"}
                  requiredField={true}
                  register={register("email", { disabled: true })}
                />
                <UserInformationsInputs
                  label={"Birth Date"}
                  type="text"
                  placeholder="YYYY-MM-DD"
                  // bottomMessage={"(Ex. : 2000-01-25)"}
                  requiredField={true}
                  register={register("birthdayDate")}
                  errorMessage={errors.birthdayDate?.message}
                />
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <UserInformationsInputs
                  label={"Phone Number"}
                  placeholder={"+XXX XXXXXXXXX"}
                  // bottomMessage={"(Ex. : +212 777777777)"}
                  register={register("phoneNumber", {
                    valueAsNumber: true,
                  })}
                  errorMessage={errors.phoneNumber?.message}
                />
                <div>
                  <div>
                    <span className="text-secondary text-md font-extrabold mb-[3px]">
                      Gendre
                    </span>
                  </div>
                  <div className="grid grid-cols-2 border-secondary rounded-sm border w-full h-[50px]">
                    <div
                      className={`${
                        gendre === "male"
                          ? "bg-secondary text-white"
                          : "text-secondary"
                      } flex items-center justify-center cursor-pointer gap-2 border-r-secondary`}
                      onClick={() => setGendre("male")}
                    >
                      <FaMale />
                      Male
                    </div>
                    <div
                      className={`${
                        gendre === "female"
                          ? "bg-secondary text-white"
                          : "text-secondary"
                      }  flex items-center justify-center cursor-pointer gap-2`}
                      onClick={() => setGendre("female")}
                    >
                      <FaFemale />
                      Female
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`mt-5 bg-secondary text-white text-sm p-4 rounded-sm ${
                    isUpdateUserLoading && "cursor-not-allowed bg-opacity-[0.7]"
                  }`}
                  disabled={isUpdateUserLoading}
                  onClick={handleSubmit(handleUpdateUser)}
                >
                  {isUpdateUserLoading ? (
                    <FiLoader className="animate-spin font-semibold text-md text-center w-full" />
                  ) : (
                    "Save Changes"
                  )}
                  {/* {isUpdateUserLoading ? "Loading ..." : "Save Changes"} */}
                </button>
                <button
                  className="mt-5 bg-red-500 text-white text-sm p-4 rounded-sm"
                  onClick={() => deleteAccountModel()}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          {userInfo?.provider !== "GOOGLE" && (
            <div>
              {/* <h1
                className={`font-extrabold text-2xl text-secondary rounded-sm`}
              >
                Change Password
              </h1> */}
              <div className="my-20">
                <div
                  className="grid gap-5 mt-5 items-center"
                  style={{ gridTemplateColumns: "1fr 1fr auto" }}
                >
                  <UserInformationsInputs
                    label={"Old Password"}
                    type="password"
                    register={registerPassword("oldPassword")}
                    placeholder="********"
                    errorMessage={passwordFormErrors.oldPassword?.message}
                    // requiredField={true}
                  />
                  <UserInformationsInputs
                    label={"New Password"}
                    type="password"
                    placeholder="********"
                    register={registerPassword("newPassword")}
                    errorMessage={passwordFormErrors.newPassword?.message}
                    // requiredField={true}
                  />
                  <button
                    className={`bg-red-500 text-white p-3 text-sm mt-7 ${
                      isChangePasswordLoading &&
                      "cursor-not-allowed bg-opacity-[0.7]"
                    }`}
                    onClick={handleSubmitPassword(handleChangePassword)}
                  >
                    {isChangePasswordLoading ? (
                      <FiLoader className="animate-spin font-semibold text-md text-center w-full" />
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* <div className="my-10">
          <h1 className="font-extrabold text-2xl text-secondary rounded-sm">
            My Adresses Book
          </h1>
          <div>f</div>
        </div> */}
        </Container>
      </div>
    </>
  );
};

export default UserInformations;
