import axios from "axios";

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

const chatApi = axios.create({
  baseURL: `http://localhost:8093/chat`,
  headers: {
    "Content-Type": "application/json",
  },
});

export { authApi, friendsApi, chatApi };
