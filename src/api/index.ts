import axios from "axios";

const BASE_URL = "http://10.227.164.247:8081";
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

export const chatInstance = axios.create({
  baseURL: AI_CHAT_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
