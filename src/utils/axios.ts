import defaultAxios from "axios";

const axios = defaultAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axios;
