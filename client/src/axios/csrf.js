import axios from "axios";

export const getCsrfToken = async () => {
  const response = await axios.get("auth/csrf", { withCredentials: true });
  const token = response.data?.csrfToken;

  if (!token) {
    throw new Error("CSRF token was not returned by the server");
  }

  return token;
};
