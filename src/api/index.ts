import axios from "axios";

export const publicInstance = axios.create({
  baseURL: "url",
  headers: { "Content-Type": "application/json" },
});

export const privateInstance = axios.create({
  baseURL: "url",
  headers: { "Content-Type": "application/json" },
});
