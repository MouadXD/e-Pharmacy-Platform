import axios from "axios";

const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:8000/api/v1/"
  : "/api/v1/";

const apiBaseUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

axios.defaults.baseURL = apiBaseUrl.endsWith("/")
  ? apiBaseUrl
  : `${apiBaseUrl}/`;
axios.defaults.headers.common["Accept"] = "application/json";
