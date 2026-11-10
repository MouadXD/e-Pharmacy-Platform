import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => axios.get("categories"),
  });
};

export const useGetCategory = (id) => {
  return useQuery({
    queryKey: ["category"],
    queryFn: (id) => axios.get(`categories/${id}`),
  });
};

export const useAddCategoryMutation = (token) => {
  return useMutation({
    mutationKey: ["addCategory"],
    mutationFn: (body) =>
      axios.post("categories", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useUpdateCategoryMutation = (token) => {
  return useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: ({ id, body }) =>
      axios.put(`categories/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
export const useDeleteCategoryMutation = (token) => {
  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: (id) =>
      axios.delete(`categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
