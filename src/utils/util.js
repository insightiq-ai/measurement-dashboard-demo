export const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
};

export const getEnvBaseURL = (environment) => {
    const envObj = JSON.parse(process.env.REACT_APP_ENV_CONNECT_API_ENDPOINTS);
    return envObj[environment];
};

export const getClientIDAndSecret = () => {
    return { clientId: process.env.REACT_APP_CLIENT_ID, clientSecret: process.env.REACT_APP_CLIENT_SECRET };
};
