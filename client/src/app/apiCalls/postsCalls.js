import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllPostsQuery = (limit = "") => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => axios.get(`posts?limit=${limit}`),
  });
};

export const useGetPostQuery = (id) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => axios.get(`posts/${id}`),
  });
};
