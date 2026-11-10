import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPasswordMutation } from "../app/apiCalls/authCalls";
import { useNavigate } from "react-router-dom";
import { Input, Button, ErrorInput } from "../components/style/Form.style";
import { useState } from "react";

const resetPasswordSchema = yup.object({
  password: yup.string().required().min(8),
  confirmedPassword: yup.string().required().min(8),
});

const ResetPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const {
    mutateAsync: resetPasswordAsync,
    isPending: isResetPasswordLoading,
  } = useResetPasswordMutation();

  const onSubmit = async (body) => {
    body = { ...body, userId, token };

    if (body.password !== body.confirmedPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const isPasswordReset = await resetPasswordAsync(body);

      if (isPasswordReset?.data.status === 200) {
        toast.success("Password Reset Successful!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 5000);
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Reset link is invalid or has expired."
      );
    }
  };

  return (
    <div>
      <div
        className="grid h-[100vh] grid-row-2 gap-5"
        style={{ gridTemplateColumns: "35% 60%" }}
      >
        <div className="bg-secondary p-8 relative after:rotate-45 before:rotate-45 after:absolute before:absolute after:w-[500px] before:w-[500px] after:h-[500px] before:h-[500px] after:bg-gradient-to-b before:bg-gradient-to-t after:from-primary before:from-primary after:right-[-100px] before:left-[-100px] after:top-[-100px] before:bottom-[-100px] overflow-hidden after:opacity-[0.2] before:opacity-[0.2] after:rounded-full before:rounded-full">
          <div>
            <img
              src="http://localhost:5173/src/static/logo_white.png"
              width={90}
              height={90}
              alt="logo"
            />
          </div>
          <div className="text-[3rem] text-white font-[100] absolute bottom-[100px] hidden md:block">
            Welcome. <br /> Start your journey now with our management system!
          </div>
        </div>
        <div className="flex items-center justify-center text-center">
          <div className="w-[500px]">
            <h1 className="text-[2rem]">Reset account password</h1>
            <p className="my-5">Enter a new password for your account.</p>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    isError={errors.password}
                    placeholder="New Password"
                    {...register("password")}
                    className="focus:outline-none placeholder:text-sm"
                  />
                  <ErrorInput showMessage={errors.password}>
                    {errors.password?.message}
                  </ErrorInput>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <IoEyeOffSharp className="text-xl" />
                    ) : (
                      <IoEyeSharp className="text-xl" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    isError={errors.confirmedPassword}
                    placeholder="Confirm Password"
                    {...register("confirmedPassword")}
                    className="focus:outline-none placeholder:text-sm"
                  />
                  <ErrorInput showMessage={errors.confirmedPassword}>
                    {errors.confirmedPassword?.message}
                  </ErrorInput>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffSharp className="text-xl" />
                    ) : (
                      <IoEyeSharp className="text-xl" />
                    )}
                  </button>
                </div>
                <Button
                  type="submit"
                  className="my-5 rounded-sm w-fit"
                  disabled={isResetPasswordLoading}
                >
                  {isResetPasswordLoading ? (
                    <FiLoader className="animate-spin font-semibold text-md text-center w-full" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
