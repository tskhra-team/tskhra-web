import axios from "axios";

const BASE_URL = "https://someurl";

export const publicInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
}); //handling when user isnt authorized, sending response without accessToken (in login and register)

export const privateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
//handling when user is authorized, and allready has access_token
