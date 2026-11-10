import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

// const userToken = JSON.parse(localStorage.getItem("user"))?.accessToken;

export const useGetUserInfo = (id, token) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axios.get(`user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: Boolean(id && token),
  });
};

export const useDeleteUserMutation = (id, token) => {
  return useMutation({
    mutationKey: ["deleteUser", id],
    mutationFn: () =>
      axios.delete(`user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useUpdateUserMutation = (id, token) => {
  return useMutation({
    mutationKey: ["updateUser", id],
    mutationFn: (body) =>
      axios.put(`user/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useGetAdresses = (token, isDefault = "", userId = "") => {
  return useQuery({
    queryKey: ["adresses", userId, isDefault],
    queryFn: () =>
      axios.get(`adresses?isDefault=${isDefault}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: Boolean(token),
  });
};

export const useAddAdresseMutation = (token) => {
  return useMutation({
    mutationKey: ["insertAdresse"],
    mutationFn: (body) =>
      axios.post("adresses", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useDeleteAdresseMutation = (token) => {
  return useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: (addressId) =>
      axios.delete(`adresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useSetAdressDefaultMutation = (token) => {
  return useMutation({
    mutationKey: ["adresses"],
    mutationFn: (adressId) =>
      axios.put(`adresses/${adressId}/default`, "", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useGetUserOrders = (token, userId) => {
  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: () =>
      axios.get(`orders/${userId}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: Boolean(token && userId),
  });
};

export const useGetOrderDetails = (token, orderId, userId = "") => {
  return useQuery({
    queryKey: ["order", userId, orderId],
    queryFn: () =>
      axios.get(`orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: Boolean(token && orderId),
  });
};
