import { useQuery, useMutation } from "@tanstack/react-query";
import Axios from "axios";

export const useGetAdsQuery = () => {
  return useQuery({
    queryKey: ["Get Ads"],
    queryFn: () => Axios.get("ads"),
  });
};

export const useCreateAdsMutation = (token) => {
  return useMutation({
    mutationKey: ["create ads"],
    mutationFn: (body) =>
      Axios.post("ads", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useUploadAdImageMutation = (token) => {
  return useMutation({
    mutationKey: ["uplaodAdsImage"],
    mutationFn: ({ id, body }) =>
      Axios.put(`ads/${id}/upload`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }),
  });
};

export const useDeleteAdMutation = (token) => {
  return useMutation({
    mutationKey: ["delete ad"],
    mutationFn: (id) =>
      Axios.delete(`ads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};

export const useUpdateAdMutation = (token) => {
  return useMutation({
    mutationKey: ["update ad"],
    mutationFn: ({ id, body }) =>
      Axios.put(`ads/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
