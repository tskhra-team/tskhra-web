import axios from "axios";

const BASE_URL = "http://10.227.164.247:8081";
const BASE_URL_PYTHON = "/api/python";

export const publicInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
}); //handling when user isnt authorized, sending response without accessToken (in login and register)

export const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
//handling when user is authorized, and allready has access_token


export const publicInstancePython = axios.create({
  baseURL: BASE_URL_PYTHON,
  headers: { "Content-Type": "application/json" },
}); 
