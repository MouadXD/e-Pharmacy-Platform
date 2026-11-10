import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api/v1/";
axios.defaults.headers.common["Accept"] = "application/json";
