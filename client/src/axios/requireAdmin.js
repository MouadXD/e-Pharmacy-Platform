import axios from "axios";
// import { useSelector } from "react-redux";

const userToken = JSON.parse(localStorage.getItem("user"))?.accessToken;

// console.log(userToken);

const requireAdminInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    Accept: "Application/json",
    Authorization: `Bearer ${userToken}`,
  },
});

export default requireAdminInstance;
