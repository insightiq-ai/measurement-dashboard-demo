import { getBasicAuthInstance, getShopifyAuthInstance } from "./axiosInstance";
import {
    CREATOR_SPLIT,
    creatorToLinkIdMapping,
    creatorToPlatformMapping,
    creatorToPromocodeMapping
} from "../utils/constants";
import { isEmpty } from "../utils/util";

const axios = require("axios");

export async function getPromocodeAnalytics({ storeId, discountId }) {
    // const { clientId, clientSecret } = getClientIDAndSecret();
    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
    let url = `v1/measurement/stores/${storeId}/discounts/analytics`;
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

    const api = getBasicAuthInstance(process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, "https://api.insightiq.ai");
    try {
        const response = await api.get(`v1/measurement/users?list_only_anonymous_users=true&list_users_with_no_events=true&limit=${limit}&offset=${offset}`);
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
        let url = `v1/measurement/attribution/events`;
        !isEmpty(userId) && (url += `?user_id=${userId}`);
        !isEmpty(limit) && (url += `&limit=${limit}`);
        !isEmpty(offset) && (url += `&offset=${offset}`);
        const response = await api.get(url);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function shortIoLinkAnalytics({ linkId }) {
    const url = "https://proxy.cors.sh/" + `https://statistics.short.io/statistics/link/${linkId}?period=total&tz=UTC`;
    // Configure headers
    const headers = {
        'Authorization': process.env.REACT_APP_SHORT_IO_API_KEY,
        'x-cors-api-key': process.env.REACT_APP_CORSSH_TOKEN,
        'accept': '*/*',
        'Content-Type': 'application/json'
    };

    // Configure query parameters
    const params = {
        period: 'total',
        tz: 'UTC'
    };

    try {
        // Make the GET request with axios
        const response = await axios.get(url, { headers, params });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function getUtmClicksForCreator(linkIds) {
    const linkPromises = linkIds.map(linkId => shortIoLinkAnalytics({ linkId }));

    try {
        const analyticsResults = await Promise.all(linkPromises);
        return analyticsResults.reduce((acc, analytics) => acc + analytics['totalClicks'], 0);
    } catch (error) {
        console.error('Error fetching UTM clicks for creator:', error);
        return 0;
    }
}

async function getTotalSalesForCreator(storeId, promocodes) {
    const linkPromises = promocodes.map(discountId => getPromocodeAnalytics({ storeId, discountId }));

    try {
        const analyticsResults = await Promise.all(linkPromises);
        return analyticsResults.reduce((acc, analytics) => {
            const amountFulfilled = analytics?.order_summary?.total_orders_amount_fulfilled ?? 0;
            return acc + amountFulfilled;
        }, 0);
    } catch (error) {
        console.error('Error fetching UTM clicks for creator:', error);
        return 0;
    }
}

export async function getCreatorsData({ storeId }) {
    const creatorDataPromises = CREATOR_SPLIT.map(async (creator, index) => {
        const utm_clicks = await getUtmClicksForCreator(creatorToLinkIdMapping[creator.title]);
        const total_sales = await getTotalSalesForCreator(storeId, creatorToPromocodeMapping[creator.title]);
        const { icon, title, metric } = creator;
        return {
            id: index,
            icon,
            title,
            utm_clicks: utm_clicks,
            creator_cost: metric,
            total_sales: total_sales,
            roi: metric !== 0 ? (total_sales / metric) : 0,
            platforms: creatorToPlatformMapping[title],
        };
    });

    try {
        return await Promise.all(creatorDataPromises);
    } catch (error) {
        console.error('Error fetching creators data:', error);
        throw error;
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
