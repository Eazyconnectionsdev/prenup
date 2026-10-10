import axios from "axios";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api").trim();

const Axios = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20000,
});

export default Axios;