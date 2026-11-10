import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetOverviewQuery = (token) => {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () =>
      axios.get("statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
};
