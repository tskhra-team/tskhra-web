import { keycloakClient } from "@/features/auth/useKeycloak";
import axios from "axios";

const BASE_URL = "http://10.227.164.247:8081";
const BASE_URL_PYTHON = "http://10.227.164.247:8888";
const AI_CHAT_BASE_URL = "http://10.227.164.168:8001";

export const publicInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
}); //handling when user isnt authorized, sending response without accessToken (in login and register)

export const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
//handling when user is authorized, and allready has access_token


const addNgrokSkipWarning = (config: import("axios").InternalAxiosRequestConfig) => {
  const url = config.baseURL || config.url || "";
  if (url.includes("ngrok-free.dev")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
};

export const publicInstancePython = axios.create({
  baseURL: BASE_URL_PYTHON,
  headers: { "Content-Type": "application/json" },
});

export const privateInstancePython = axios.create({
  baseURL: `${BASE_URL_PYTHON}/ecommerce/cart`,
  headers: { "Content-Type": "application/json" },
});

publicInstancePython.interceptors.request.use(addNgrokSkipWarning);

privateInstancePython.interceptors.request.use(addNgrokSkipWarning);
privateInstancePython.interceptors.request.use(async (config) => {
  if (keycloakClient.authenticated && keycloakClient.token) {
    await keycloakClient.updateToken(5).catch(() => {});
    config.headers.Authorization = `Bearer ${keycloakClient.token}`;
  }
  return config;
});

export const privateInstanceSeller = axios.create({
  baseURL: `${BASE_URL_PYTHON}/ecommerce/provider`,
  headers: { "Content-Type": "application/json" },
});

privateInstanceSeller.interceptors.request.use(addNgrokSkipWarning);
privateInstanceSeller.interceptors.request.use(async (config) => {
  if (keycloakClient.authenticated && keycloakClient.token) {
    await keycloakClient.updateToken(5).catch(() => {});
    config.headers.Authorization = `Bearer ${keycloakClient.token}`;
  }
  return config;
});
export const privateInstancePayment = axios.create({
  baseURL: `${BASE_URL_PYTHON}/ecommerce/payment`,
  headers: { "Content-Type": "application/json" },
});

privateInstancePayment.interceptors.request.use(addNgrokSkipWarning);
privateInstancePayment.interceptors.request.use(async (config) => {
  if (keycloakClient.authenticated && keycloakClient.token) {
    await keycloakClient.updateToken(5).catch(() => {});
    config.headers.Authorization = `Bearer ${keycloakClient.token}`;
  }
  return config;
});

export const chatInstance = axios.create({
  baseURL: AI_CHAT_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
