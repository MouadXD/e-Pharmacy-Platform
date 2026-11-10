import Container from "../../components/Container";
import LocationRight from "../../components/LocationRight";
import {
  useGetUserInfo,
  useUpdateUserMutation,
} from "../../app/apiCalls/userCalls";
import { useChangePasswordMutation } from "../../app/apiCalls/authCalls";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userActions } from "../../app/features/User";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";

const userSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long")
    .matches(/[a-z]/, "New password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "New password must contain at least one uppercase letter")
    .matches(/[0-9]/, "New password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "New password must contain at least one special character"
    ),
});

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const dispatch = useDispatch();
  const { updateUserName, logout } = userActions;

  const userInfo = useSelector((state) => state.user.userInfo);

  const {
    data: userData,
    isLoading: isUserInfoLoading,
    refetch: refetchUserInfo,
  } = useGetUserInfo(userInfo.id, userInfo?.accessToken);

  const {
    mutateAsync: updateUserInfoAsync,
    isPending: isUpdateUserInfoLoading,
  } = useUpdateUserMutation(userInfo.id, userInfo?.accessToken);

  const {
    mutateAsync: changePasswordAsync,
    isPending: isChangePasswordLoading,
  } = useChangePasswordMutation(userInfo.id, userInfo?.accessToken);

  useEffect(() => {
    if (userData) {
      setValue("firstName", userData?.data?.user?.firstName);
      setValue("lastName", userData?.data?.user?.lastName);
      setValue("email", userData?.data?.user?.email);
    }
  }, [setValue, userData]);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
  });

  const togglePasswordVisibility = (type) => {
    if (type == "OLD") {
      setShowPassword({
        ...showPassword,
        oldPassword: !showPassword.oldPassword,
      });
    } else {
      setShowPassword({
        ...showPassword,
        newPassword: !showPassword.newPassword,
      });
    }
  };

  if (isUserInfoLoading) {
    return <Loader />;
  }

  const handleUpdateInfo = async (requestBody) => {
    delete requestBody.email;

    let updateUserInfoToastId;

    try {
      updateUserInfoToastId = toast.loading("Loading...");

      const updateUserInfoResponse = await updateUserInfoAsync(requestBody);

      if (updateUserInfoResponse.status == 200) {
        dispatch(
          updateUserName({
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
          })
        );
        toast.success("Prodile updated success!");
        refetchUserInfo();
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not update your profile."
      );
    } finally {
      if (updateUserInfoToastId) {
        toast.dismiss(updateUserInfoToastId);
      }
    }
  };

  const handleChangePassword = async (requestBody) => {
    let changePasswordToastId;

    try {
      changePasswordToastId = toast.loading("Loading...");
      const changePasswordResponse = await changePasswordAsync(requestBody);

      if (changePasswordResponse.status == 200) {
        // The server revokes the current access and refresh tokens.
        dispatch(logout());
        toast.success("Password changed. Please log in again.");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not change your password.");
    } finally {
      if (changePasswordToastId) {
        toast.dismiss(changePasswordToastId);
      }
    }
  };

  return (
    <div className="bg-[#F6F8FB]" style={{ height: "calc(100vh - 146px)" }}>
      <Container>
        <div className="py-[30px]">
          <div>
            <LocationRight list={["Profile"]} />
            <div className="text-sm">Explore Your Profile.</div>
          </div>
        </div>
        <div className="my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="firstName"
                className="uppercase text-secondary text-sm font-bold"
              >
                First Name
              </label>
              <div className="w-[100%] focus:border-2 focus:border-secondary">
                <input
                  style={{
                    border: "1px solid rgba(101,109,119,.16)",
                    boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                  }}
                  className="px-3 py-[0.9rem] w-[100%] focus:outline-0 text-sm"
                  type="text"
                  placeholder="First Name"
                  id="firstName"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="uppercase text-secondary text-sm font-bold"
              >
                Last Name
              </label>
              <div className="w-[100%] focus:border-2 focus:border-secondary">
                <input
                  style={{
                    border: "1px solid rgba(101,109,119,.16)",
                    boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                  }}
                  className="px-3 py-[0.9rem] w-[100%] focus:outline-0 text-sm"
                  type="text"
                  placeholder="Last Name"
                  id="lastName"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="uppercase text-secondary text-sm font-bold"
              >
                Email
              </label>
              <div className="w-[100%] focus:border-2 focus:border-secondary">
                <input
                  style={{
                    border: "1px solid rgba(101,109,119,.16)",
                    boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                  }}
                  className="px-3 py-[0.9rem] w-[100%] focus:outline-0 text-sm"
                  type="text"
                  placeholder="Last Name"
                  id="email"
                  disabled={true}
                  {...register("email")}
                />
              </div>
            </div>
            <div className="w-full h-full flex items-end justify-start row-start-4 md:row-start-3">
              <button
                className={`bg-secondary px-5 h-[45.78px] text-white text-sm rounded-sm ${
                  isUpdateUserInfoLoading && "cursor-not-allowed bg-opacity-90"
                }`}
                onClick={handleSubmit(handleUpdateInfo)}
              >
                {isUpdateUserInfoLoading ? "Loading..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="oldPassword"
                className="uppercase text-secondary text-sm font-bold"
              >
                Old Passworrd
              </label>
              <div className="w-[100%] focus:border-2 focus:border-secondary">
                <div className="relative w-full">
                  <input
                    style={{
                      border: "1px solid rgba(101,109,119,.16)",
                      boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                    }}
                    className="px-3 py-[0.9rem] w-[100%] focus:outline-0 text-sm"
                    type={showPassword.oldPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="oldPassword"
                    {...registerPassword("oldPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      togglePasswordVisibility("OLD");
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword.oldPassword ? (
                      <IoEyeOffSharp className={`h-5 w-5 text-gray-500 `} />
                    ) : (
                      <IoEyeSharp className={`h-5 w-5 text-gray-500 `} />
                    )}
                    {/* <IoEyeSharp className={`h-5 w-5 text-gray-500 `} /> */}
                  </button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {passwordErrors.oldPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="uppercase text-secondary text-sm font-bold"
              >
                New Passworrd
              </label>
              <div className="w-[100%] focus:border-2 focus:border-secondary">
                <div className="relative w-full">
                  <input
                    style={{
                      border: "1px solid rgba(101,109,119,.16)",
                      boxShadow: "0 2px 4px 0 rgba(35,46,60,.04)",
                    }}
                    className="px-3 py-[0.9rem] w-[100%] focus:outline-0 text-sm"
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="oldPassword"
                    {...registerPassword("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      togglePasswordVisibility("NEW");
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword.newPassword ? (
                      <IoEyeOffSharp className={`h-5 w-5 text-gray-500 `} />
                    ) : (
                      <IoEyeSharp className={`h-5 w-5 text-gray-500 `} />
                    )}
                    {/* <IoEyeSharp className={`h-5 w-5 text-gray-500 `} /> */}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                className={`bg-red-600 px-5 h-[45.78px] text-white text-sm rounded-sm ${
                  isChangePasswordLoading && "cursor-not-allowed bg-opacity-90"
                }`}
                onClick={handleSubmitPassword(handleChangePassword)}
              >
                {isChangePasswordLoading ? "Loading..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
