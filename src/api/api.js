import { getClientIDAndSecret } from "../utils/util";
import { getBasicAuthInstance } from "./axiosInstance";
import { currentDashboardURL } from "./endpoints";

const axios = require('axios');

export async function getPromocodeAnalytics({warehouse, storeId}) {

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

export async function getUsers({limit, offset}) {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/users?list_anonymous_users=true&list_users_with_no_events=true&limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById({userId}) {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserEvents({userId}) {
    const api = getBasicAuthInstance(
        process.env.REACT_APP_CLIENT_ID_DEV3, process.env.REACT_APP_CLIENT_SECRET_DEV3, 'https://api3.dev.insightiq.ai');
    try {
        const response = await api.get(`v1/measurement/attribution/events?user_id=${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
