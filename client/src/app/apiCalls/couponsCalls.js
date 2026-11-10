import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCheckCouponValidity = (token) => {
  return useMutation({
    mutationKey: ["checkCoupon"],
    mutationFn: (body) => axios.post("checkCoupon", body),
  });
};

export const useGetCoupons = (token) => {
  return useQuery({
    queryKey: ["Get Coupons"],
    queryFn: () =>
      axios.get("coupons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const createCoupon = (token) => {
  return useMutation({
    mutationKey: ["createCoupon"],
    mutationFn: (body) =>
      axios.post("coupons", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
export const deleteCoupon = (token) => {
  return useMutation({
    mutationKey: ["deleteCoupon"],
    mutationFn: (id) =>
      axios.delete(`coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const updateCoupon = (token) => {
  return useMutation({
    mutationKey: ["updateCoupon"],
    mutationFn: ({ body, id }) =>
      axios.put(`coupons/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
