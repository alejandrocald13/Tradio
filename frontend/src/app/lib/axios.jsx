import axios from "axios";
import { getToken } from "@/app/utils/getToken"; 

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("No se pudo obtener el token:", error);
  }
  return config;
});
