import { env } from "@/config/env";
import axios from "axios";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let access_token: string | null = null;

export const setAccessToken = (token: string | null) => {
  access_token = token;
};

api.interceptors.request.use(
  (config) => {
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error);
  },
);
