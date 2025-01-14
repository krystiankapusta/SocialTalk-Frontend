import axios from "axios";
import { getUserIdFromToken } from "../Services/DecodeToken";

const authApi = axios.create({
  baseURL: `http://localhost:8091`,
  headers: {
    "Content-Type": "application/json",
  },
});

const friendsApi = axios.create({
  baseURL: `http://localhost:8092/friends`,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    const userId = getUserIdFromToken();
    if (userId) {
      console.log("Decoded userId from token:", userId);
    } else {
      console.warn("No userId found in token");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

friendsApi.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const userId = getUserIdFromToken();
    if (userId) {
      console.log("Decoded userId from token:", userId);
    } else {
      console.warn("No userId found in token");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { authApi, friendsApi };
