import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllValidDiscountsQuery = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: () => axios.get("discounts?valid=1"),
  });
};

export const useGetAllDiscountsQuery = (token) => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: () =>
      axios.get("discounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useCreateDiscountMutation = (token) => {
  return useMutation({
    mutationKey: ["createDiscount"],
    mutationFn: (body) =>
      axios.post("discounts", body, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
};

export const useDeleteDiscountMutation = (token) => {
  return useMutation({
    mutationKey: ["deleteDiscount"],
    mutationFn: (id) =>
      axios.delete(`discounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
};

export const useUpdateDiscountMutation = (token) => {
  return useMutation({
    mutationKey: ["updateDiscount"],
    mutationFn: ({ id, body }) =>
      axios.put(`discounts/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
