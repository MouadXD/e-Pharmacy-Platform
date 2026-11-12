import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const logoutUser = () =>
  axios.post("auth/logout", {}, { withCredentials: true });

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (body) =>
      axios.post("auth/login", body, { withCredentials: true }),
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (body) => axios.post("auth/register", body),
  });
};

export const useForgetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["forgetPassword"],
    mutationFn: (body) =>
      axios.post("auth/forgetPassword", {
        email: body.email,
      }),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: (body) =>
      axios.post(`auth/resetPassword/${body.userId}/${body.token}`, {
        password: body.password,
        confirmedPassword: body.confirmedPassword,
      }),
  });
};

export const useChangePasswordMutation = (userId, token) => {
  return useMutation({
    mutationKey: ["changePassword"],
    mutationFn: (body) =>
      axios.put(
        `auth/changePassword/${userId}`,
        {
          oldPassword: body.oldPassword,
          newPassword: body.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  });
};
