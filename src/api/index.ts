import axios from "axios";

export const publicInstance = axios.create({
  baseURL: "url",
  headers: { "Content-Type": "application/json" },
}); //handling when user isnt authorized, sending response without accessToken (in login and register)

export const privateInstance = axios.create({
  baseURL: "url",
  headers: { "Content-Type": "application/json" },
});
//handling when user is authorized, and allready has access_token
