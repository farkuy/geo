import axios from "axios";

export const $axios = axios.create({
  baseURL: process.env.API,
  maxBodyLength: Infinity,
  timeout: 100000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});
