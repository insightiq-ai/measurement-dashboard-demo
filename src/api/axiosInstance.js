import axios from "axios";
import { currentDashboardURL } from "./endpoints";

let instance = axios.create({
  baseURL: currentDashboardURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Frame-Options": "DENY",
  },
});

const getBasicAuthInstance = (CLIENT_ID, CLIENT_SECRET, environmentBaseURL) => {
  const AUTH_KEY = window.btoa(CLIENT_ID + ":" + CLIENT_SECRET);
  const basicAuthInstance = axios.create({
    baseURL: environmentBaseURL,
    headers: {
      Authorization: "Basic " + AUTH_KEY,
    },
  });
  return basicAuthInstance;
};
const getShopifyAuthInstance = (baseURL) => {
  const authInstance = axios.create({
    baseURL: baseURL,
    headers: {
      "X-Shopify-Access-Token": process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN,
      "x-cors-api-key": process.env.REACT_APP_CORSSH_TOKEN,
    },
  });
  return authInstance;
};

export { getBasicAuthInstance };
export { getShopifyAuthInstance };

export default instance;
