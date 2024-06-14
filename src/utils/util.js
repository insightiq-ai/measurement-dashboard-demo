import moment from 'moment-timezone';

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

export const percentFormatter = Intl.NumberFormat("en", {
    style: "percent",
    // maximumSignificantDigits: 4,   // To show total of 4 digits
    maximumFractionDigits: 2,         // To show maximum of 2 fractions, which is closer to the UI reqs
    roundingPriority: "lessPrecision",
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export function formatCurrency(value, currencyCode) {
    // It's recommended to match the locale with the currency for proper format,
    // but 'en-US' can be used as a generic locale that supports all currencies.
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'symbol'
    });

    return formatter.format(value);
}

export function formatNumber(num, decimalPrecision = 2) {
    if (num === null) {
        return null;
    }

    function rnd(num, precision) {
        const prec = 10 ** precision;
        return Math.round(num * prec) / prec;
    }

    const abbRev = ["K", "M", "B"];
    let base = Math.floor(Math.log(Math.abs(num)) / Math.log(1000));
    const suffix = abbRev[Math.min(abbRev.length - 1, base - 1)];
    base = abbRev.indexOf(suffix) + 1;
    return suffix ? rnd(num / 1000 ** base, decimalPrecision) + suffix : "" + Math.round((num + Number.EPSILON) * 100) / 100;
}

const DATE_TIME_FORMAT = "DD MMM YYYY, hh:mm A";
// function to add +00:00 in time adn return local time
export const convertTimeToLocale = (time, dateTimeFormat = DATE_TIME_FORMAT) => {
    if (!time || typeof time !== "string") {
        return time;
    }
    let updatedTime = time;
    if (time?.slice(-6) !== "+00:00") {
        updatedTime = `${time}+00:00`;
    }
    return moment(updatedTime).format(dateTimeFormat);
};
