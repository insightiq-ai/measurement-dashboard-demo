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
    },
  });
  return authInstance;
};
// const environmentBaseInstance = axios.create({
//   baseURL: envBaseUrl,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

const removeLocalStorage = (e) => {
  localStorage.clear();
  console.log(e);
};

const addResponseInterceptor = (axiosInstance, toast = () => {}, toastMessage) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        console.log("\n\n Removing local storage reason => ", error);
        toast(toastMessage);
        removeLocalStorage(error);
        window.location.href = "/sign-in";
      }
      // if (error.response.status === 403) {
      //   console.log("\n\n Removing local storage reason => ", error);
      //   removeLocalStorage(error);
      //   window.location.href = "/sign-in";
      // }
      return Promise.reject(error);
    }
  );
};

const attachAxiosInterceptors = () => {
  // adding response interceptor to axios instance
  addResponseInterceptor(instance);
  //addResponseInterceptor(environmentBaseInstance);
};

// pass token as param or get from localstorage
// const createAxiosInstance = (tokParam) => {
//   const token = JSON.parse(localStorage.getItem("user")).token;
//   instance = axios.create({
//     baseURL: currentDashboardURL,
//     headers: {
//       "Content-Type": "application/json",

//       Authorization: "Bearer " + token || tokParam,

//       Accept: "application/json",
//     },
//   });
//   return instance;
// };
// const instance = axios.create({
//   baseURL: currentDashboardURL,
//   auth: {
//     username: process.env.REACT_APP_CLIENT_ID,
//     password: process.env.REACT_APP_CLIENT_SECRET,
//   },
//   headers: {
//     // "authorization":
//     //   "Basic M2MxMzJkNDAtMjE0OC00OWQyLWJiOGQtY2FlNTU4NzNhNjlkOjFkY2JhNmQ4LWE2MWMtNDY2NS1hNDM3LTA0NmY0YTUzMDNkZQ==",

//     // Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//     // accept: "application/json, text/plain, */*",
//     // "Access-Control-Allow-Origin": "*",
//     // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//     // "sdk-version": "1.0",
//     // "sdk-platform": "web",
//   },
// });

export { attachAxiosInterceptors };
export { getBasicAuthInstance };
export { getShopifyAuthInstance };
//export { environmentBaseInstance, attachAxiosInterceptors };

export default instance;
