import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetOrders = (token, page = 1, limit = "") => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get(`orders?page=${page}${limit && `&limit=${limit}`}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useGetOrderDetails = (token, id, userId = "") => {
  return useQuery({
    queryKey: ["admin-order", userId, id],
    queryFn: () =>
      axios.get(`orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    enabled: Boolean(token && id),
  });
};

export const useConfirmOrderMutation = (token) => {
  return useMutation({
    mutationKey: ["confirm order"],
    mutationFn: (id) =>
      axios.post(`orders/${id}/confirmOrder`, "", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
