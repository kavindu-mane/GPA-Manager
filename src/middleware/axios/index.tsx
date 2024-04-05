import axios, { InternalAxiosRequestConfig } from "axios";
import { useCookies } from "react-cookie";

export const useAxios = () => {
  // get cookies
  const [cookies] = useCookies(["XSRF-TOKEN", "token"]);

  // axios private instance
  const axiosPrivateInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // intercept requests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addHeaders = (config: InternalAxiosRequestConfig<any>) => {
    if (!config?.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${cookies["token"]}`;
      config.headers["X-CSRFToken"] = cookies["XSRF-TOKEN"];
    }
    return config;
  };

  axiosPrivateInstance.interceptors.request.use(
    async (config) => {
      if (!cookies["XSRF-TOKEN"]) {
        await axios.get("/sanctum/csrf-cookie").then(() => {
          addHeaders(config);
        });
      } else {
        addHeaders(config);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return axiosPrivateInstance;
};
