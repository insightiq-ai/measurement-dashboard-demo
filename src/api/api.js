import { getBasicAuthInstance } from "./axiosInstance";

const axios = require('axios');

export async function getPromocodeAnalytics({ warehouse, storeId }) {

    // const { clientId, clientSecret } = getClientIDAndSecret();
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, 'https://api.insightiq.ai');

    try {
        const response = await api.get(`v1/measurement/stores/${storeId}/discounts/analytics`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAttributionStatistics() {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/attribution/statistics`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getDashboardLinkMetrics() {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_PROD, process.env.REACT_APP_CLIENT_SECRET_PROD, 'https://api.insightiq.ai');

    try {
        const response = await api.get(`v1/measurement/dashboard/links/metrics`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUsers({ limit, offset }) {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');

    async function addEventTimestamp(users) {
        // Fetch events for all users concurrently
        const eventsPromises = users.data.map(user =>
            getUserEvents({ userId: user.id, limit: 1 }).catch(error => {
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
                    event_timestamp: eventsResults[index]?.data[0]?.event_timestamp ?? null
                }
            });
            return enrichedUsers;
        } catch (error) {
            console.log('Failed to fetch event_timestamp for all users:', error);
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
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserEvents({ userId, limit }) {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/attribution/events?user_id=${userId}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
