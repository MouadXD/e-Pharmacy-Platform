import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";

export const usetGetAllProducts = (
  limit = "",
  categoryId = "",
  search = "",
  page = 1,
  sort = "",
  all = ""
) => {
  return useQuery({
    queryKey: ["products", "GET"],
    queryFn: () =>
      axios.get(
        `products?limit=${limit}&category=${categoryId}&search=${search}&page=${page}&sort=${sort}&all=${all}`
      ),
    placeholderData: keepPreviousData,
  });
};

export const useCreateProductMutation = (token) => {
  return useMutation({
    mutationKey: ["products", "POST"],
    mutationFn: (body) =>
      axios.post("products", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useUploadProdustImageMutation = (token) => {
  return useMutation({
    mutationKey: ["upload product image", "PUT"],
    mutationFn: (body) =>
      axios.put(`products/${body.id}/upload`, body.image, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }),
  });
};

export const useUpdateProductMutation = (token) => {
  return useMutation({
    mutationKey: ["Update Product"],
    mutationFn: ({ body, id }) =>
      axios.put(`products/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useDeleteProductMutation = (token) => {
  return useMutation({
    mutationKey: ["products", "DELETE"],
    mutationFn: (id) =>
      axios.delete(`products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useGetProduct = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => axios.get(`products/${id}`),
  });
};

export const useGetOffers = (sortBy = "", limit = "") => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: () => axios.get(`offers?sort=${sortBy}&limit=${String(limit)}`),
    placeholderData: keepPreviousData,
  });
};
