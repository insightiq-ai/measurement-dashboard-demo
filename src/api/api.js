import { getBasicAuthInstance, getShopifyAuthInstance } from "./axiosInstance";
import { CREATOR_SPLIT, CREATOR_AAKASH, CREATOR_DHRUV, CREATOR_MIKE } from "../utils/constants";
import { currencyFormatter, percentFormatter } from "../utils/util";
import { isEmpty } from "../utils/util";
const axios = require("axios");

export async function getPromocodeAnalytics({ warehouse, storeId, discountId }) {
    // const { clientId, clientSecret } = getClientIDAndSecret();
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
    let url = `v1/measurement/warehouses/${warehouse}/stores/${storeId}/discounts/analytics`;
    !isEmpty(discountId) && (url += `?discount_id=${discountId}`);
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAttributionStatistics() {
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
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
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");

    async function addEventTimestamp(users) {
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
    }

    try {
        const response = await api.get(`v1/measurement/users?list_anonymous_users=true&list_users_with_no_events=true&limit=${limit}&offset=${offset}`);
        const users = response.data;

        return users.data;
        // return await addEventTimestamp(users);
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById({ userId }) {
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
    try {
        const response = await api.get(`v1/measurement/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserEvents({ userId, limit, offset }) {
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
    try {
        const response = await api.get(`v1/measurement/attribution/events?user_id=${userId}&limit=${limit}&offset=${offset}`);
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}

async function shortIoLinkAnalytics({ linkId }) {
    const url = `https://statistics.short.io/statistics/link/${linkId}`;
    const options = {
        headers: {
            'Authorization': process.env.REACT_APP_SHORT_IO_API_KEY,
            'accept': '*/*'
        },
        params: {
            period: 'total',
            tz: 'UTC'
        }
    };

    try {
        const response = await axios.get(url, options);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error making API request:', error);
        return null;
    }
}

export async function getCreatorsData() {
    return new Promise((resolve, reject) => {

        const creatorToLinkIdMapping = {};
        creatorToLinkIdMapping[CREATOR_DHRUV] = [process.env.REACT_APP_EXTERNAL_LINK_ID_1, process.env.REACT_APP_EXTERNAL_LINK_ID_2];
        creatorToLinkIdMapping[CREATOR_AAKASH] = [process.env.REACT_APP_EXTERNAL_LINK_ID_3];
        creatorToLinkIdMapping[CREATOR_MIKE] = [process.env.REACT_APP_EXTERNAL_LINK_ID_4];

        function getUtmClicksForCreator(creator) {
            return creatorToLinkIdMapping[creator].reduce(async (acc, linkId) => {
                const linkAnalytics = await shortIoLinkAnalytics({ linkId });
                return acc + linkAnalytics['totalClicks'];
            }, 0);
        }

        resolve(
            CREATOR_SPLIT.map((creator, index) => {
                const { icon, title, metric } = creator;
                return {
                    id: index,
                    thumbnail: icon,
                    name: title,
                    utm_clicks: 100, // getUtmClicksForCreator(title),
                    creator_cost: currencyFormatter.format(metric),
                    total_sales: 20,
                    roi: percentFormatter.format(9999 / metric),
                    platforms: ["YouTube", "TikTok"],
                };
            })
        );
    });
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
