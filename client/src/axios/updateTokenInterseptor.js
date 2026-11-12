import axios from "axios";
import { store } from "../app/store";
import { userActions } from "../app/features/User";
import safeJsonParse from "../helpers/safeJsonParse";
import { getCsrfToken } from "./csrf";

const authEndpoints = [
  "auth/login",
  "auth/register",
  "auth/forgetPassword",
  "auth/resetPassword/",
  "token/refresh",
];

const isAuthRequest = (url = "") =>
  authEndpoints.some((endpoint) => url.includes(endpoint));

const hasStoredAccessToken = () =>
  Boolean(safeJsonParse(localStorage.getItem("user"), null)?.accessToken);

let refreshPromise = null;
let isInstalled = false;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    const refreshClient = axios.create({
      baseURL: axios.defaults.baseURL,
      headers: { Accept: "application/json" },
    });

    refreshPromise = getCsrfToken()
      .then((csrfToken) =>
        refreshClient.post(
          "token/refresh",
          {},
          {
            withCredentials: true,
            headers: { "X-CSRF-Token": csrfToken },
          }
        )
      )
      .then((response) => {
        const accessToken = response.data?.accessToken;

        if (!accessToken) {
          throw new Error("Refresh response did not include an access token");
        }

        store.dispatch(userActions.updateToken(accessToken));
        return accessToken;
      })
      .catch((error) => {
        store.dispatch(userActions.logout());
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const setupTokenInterceptor = () => {
  if (isInstalled) return;

  isInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthRequest(originalRequest.url) ||
        !hasStoredAccessToken()
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();

        if (originalRequest.headers?.set) {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${accessToken}`
          );
        } else {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };
        }

        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );
};
