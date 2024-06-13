import { getBasicAuthInstance, getShopifyAuthInstance } from "./axiosInstance";

const axios = require("axios");

export async function getPromocodeAnalytics({ warehouse, storeId }) {
  // const { clientId, clientSecret } = getClientIDAndSecret();
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");

  try {
    const response = await api.get(`v1/measurement/stores/${storeId}/discounts/analytics`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAttributionStatistics() {
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, "https://api3.dev.insightiq.ai");
  try {
    const response = await api.get(`v1/measurement/attribution/statistics`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getDashboardLinkMetrics() {
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");

  try {
    const response = await api.get(`v1/measurement/dashboard/links/metrics`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers({ limit, offset }) {
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, "https://api3.dev.insightiq.ai");
  try {
    const response = await api.get(`v1/measurement/users?list_anonymous_users=true&list_users_with_no_events=true&limit=${limit}&offset=${offset}`);
    const users = response.data;

    // Fetch events for all users concurrently
    const eventsPromises = users.data.map((user) =>
      getUserEvents({ userId: user.id, limit: 1 }).catch((error) => {
        console.log(`Failed to fetch events for user ${user.id}:`, error);
        return null; // Return null or default object if an individual request fails
      })
    );
    try {
      // Await all event data requests
      const eventsResults = await Promise.all(eventsPromises);
      // Combine user data with event data
      const enrichedUsers = users.data.map((user, index) => {
        return {
          ...user,
          event_timestamp: eventsResults[index]?.data[0]?.event_timestamp ?? null,
        };
      });
      return enrichedUsers;
    } catch (error) {
      console.log("Failed to fetch event_timestamp for all users:", error);
      return users.data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById({ userId }) {
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, "https://api3.dev.insightiq.ai");
  try {
    const response = await api.get(`v1/measurement/users/${userId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserEvents({ userId, limit }) {
  const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, "https://api3.dev.insightiq.ai");
  try {
    const response = await api.get(`v1/measurement/attribution/events?user_id=${userId}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllOrdersFromShopify() {
  const api = getShopifyAuthInstance("https://proxy.cors.sh/https://www.demoshoes.shop/admin/api/2023-10");
  try {
    const response = await api.get(`/orders/count.json?status=any`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCountOfAbondonedCheckout() {
  const api = getShopifyAuthInstance("https://proxy.cors.sh/https://www.demoshoes.shop/admin/api/2023-10");
  try {
    const response = await api.get(`/checkouts.json`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getTotalOrderPerAUID(auid) {
  const url = "https://proxy.cors.sh/" + "https://orderops.demoshoes.shop";
  var myHeaders = new Headers();
  myHeaders.append("X-PHYLLO-PSK", "PHYLLOISKING");
  myHeaders.append("API-TYPE", "AUID2ORDERDETAILS");
  myHeaders.append("AUID", auid);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-cors-api-key", process.env.REACT_APP_CORSSH_TOKEN);

  var raw = JSON.stringify({});

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}
