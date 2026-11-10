import axios from "axios";

const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;

const adminInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    Accept: "Application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

export default adminInstance;
