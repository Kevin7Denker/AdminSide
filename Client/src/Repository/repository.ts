import axios from "axios";

const api = axios.create({
  baseURL: "http://10.20.21.226:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Token armazenado:", localStorage.getItem("token"));
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
