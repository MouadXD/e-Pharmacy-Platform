import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgetPasswordMutation } from "../app/apiCalls/authCalls";
import toast, { Toaster } from "react-hot-toast";
import { FiLoader } from "react-icons/fi";
import { Input, Button, ErrorInput } from "../components/style/Form.style";
import { useRef } from "react";

const forgetPasswordSchema = yup.object({
  email: yup.string().email().required(),
});

const ForgetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const {
    mutateAsync: forgetPasswordRequest,
    isPending: isForgetPasswordLoading,
    // isError: isForgetPasswordError,
    // error: forgetPasswordError,
  } = useForgetPasswordMutation();
  const onSubmit = async (body) => {
    try {
      const forgetPasswordResp = await forgetPasswordRequest(body);

      if (forgetPasswordResp.data.status === 200) {
        toast(
          `An email with instructions on how to reset your password has been sent to ${getValues(
            "email"
          )} .\n \n Check your spam or junk folder if you don’t see the email in your inbox`,
          {
            duration: 10000,
          }
        );
      }
    } catch (e) {
      toast.error(e.response.data.message || "Something went wrong!", {
        duration: 5000,
      });
    }
  };

  return (
    <div>
      {/* <Toaster position="top-center" /> */}
      <div
        className="grid h-[100vh] grid-row-2 gap-5"
        style={{ gridTemplateColumns: "35% 60%" }}
      >
        <div className="bg-secondary p-8 relative after:rotate-45 before:rotate-45 after:absolute before:absolute after:w-[500px] before:w-[500px] after:h-[500px] before:h-[500px] after:bg-gradient-to-b before:bg-gradient-to-t after:from-primary before:from-primary after:right-[-100px] before:left-[-100px] after:top-[-100px] before:bottom-[-100px] overflow-hidden after:opacity-[0.2] before:opacity-[0.2] after:rounded-full before:rounded-full">
          <Link to={"/"}>
            <div>
              <img
                src="http://localhost:5173/src/static/logo_white.png"
                width={90}
                height={90}
                alt="logo"
              />
            </div>
          </Link>
          <div className="text-[3rem] text-white font-[100] absolute bottom-[100px] hidden md:block">
            Making Healthcare Accessible Anytime Anywhere
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between my-5">
            <div
              className="p-3 border rounded-full cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            >
              <IoIosArrowBack className="text-gray-600" />
            </div>
            <div>
              Not a member?
              <span className="ml-2 text-secondary underline">
                <Link to={"/auth/register"}>Sign up now</Link>{" "}
              </span>
            </div>
          </div>
          <div className="h-[80%] flex items-center justify-center flex-col">
            <h1 className="text-[2.5rem] font-semibold mb-5">
              Forget Password?
            </h1>
            <p className="text-gray-600 mb-10">
              Enter the email adresse you used when you joined and w'ell <br />{" "}
              send you instructions to reset your password
            </p>
            <div className="w-[440px]">
              <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <label className="mb-1 font-semibold" htmlFor="resetPassword">
                  Email Address
                </label>
                <div>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    autoFocus
                    isError={errors.email?.message}
                    name="resetPassword"
                    {...register("email")}
                  />
                  <ErrorInput showMessage={errors.email?.message}>
                    {errors.email?.message}
                  </ErrorInput>
                </div>
                <div className="text-right mt-5">
                  <Button type="submit" className="rounded-sm">
                    {isForgetPasswordLoading ? (
                      <FiLoader className="animate-spin font-semibold text-md text-center w-full" />
                    ) : (
                      "Email Me"
                    )}
                  </Button>
                </div>
              </form>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
