const currentDashboardURL = process.env.REACT_APP_DASHBOARD_API_ENDPOINT;
const currentConnectURL = process.env.REACT_APP_CONNECT_API_ENDPOINT;

const signUpEndpoint = "v1/identity/signup";
const validateEmailEndpoint = "v1/identity/signup/validate-email";
const signInEndpoint = "v1/identity/login";
const signOutEndpoint = "v1/identity/logout";

const tenantInfoEndpoint = "v1/identity/tenants";
const rotateCredentialsEndpoint = "v1/identity/rotate-credential";
const deleteCredentialsEndpoint = "v1/identity/delete-credential";
const deleteCreatedUserEndpoint = "v1/identity/delete-created-user";

const webhooksEndpoint = "v1/identity/webhooks";

const sendEmailVerificationLinkEndpoint = "v1/identity/send-verification-link";

const forgotPasswordEndpoint = "v1/identity/forgot-password";
const getAllTenantsEndpoint = "v1/identity/tenants";
const setNewPasswordEndpoint = "v1/identity/set-new-password";
const getAllWebhookEventsEndpoint = "v1/identity/webhook-events";
const contactSalesEndpoint = "v1/identity/contact-sales";

const URL_CREATE_USER = "/v1/users";
const URL_CREATE_USER_TOKEN = "/v1/sdk-tokens";
const URL_GET_PROFILE = "/v1/profiles";
const URL_GET_COMMENTS = "social/comments";
const URL_GET_CONTENTS = "social/contents";
const URL_GET_INCOME = "social/income/transactions";

// Tenant App Products URL for checking the supported products
const URL_GET_TENANT_PRODUCTS = "v1/identity/tenant-app-products";

// Tenant Quota Info
const URL_GET_TENANT_QUOTA_INFO = "v1/identity/tenant-app-quotas";

// Creator Linkage endpoints
// const URL_GET_ALL_INVITATIONS = "v1/identity/creator-invites";
const URL_GET_ALL_INVITATIONS = "v1/dashboard/links";
// const URL_GET_CONNECTED_ACCOUNTS = "v1/identity/creator-invites/connected-accounts";
const URL_GET_CONNECTED_ACCOUNTS = "v1/dashboard/links/connected-accounts";
const URL_GET_FAILED_CONNECTIONS = "v1/identity/creator-invites/failed-connections";
const URL_CREATOR_BULK_INVITE = "v1/identity/creator-invites/bulk";
const URL_API_INDIVIDUAL_INVITE = "v1/identity/creator-invites";
const URL_API_RESEND_INVITATION = "v1/identity/creator-invites";
// const URL_GET_CONNECTION_ATTEMPTS = "v1/identity/connection-attempts";
const URL_GET_CONNECTION_ATTEMPTS = "v1/dashboard/links/connection-attempts";
const getDisconnectUrl = (id) => `v1/accounts/${id}/disconnect`;
const URL_API_EXPORT_TO_CSV = "v1/identity/creator-invites/profiles/export";

const URL_GET_ALL_ACCOUNTS_PROFILE = "v1/accounts";
const URL_GET_USER_PROFILE = "v1/profiles";
const URL_GET_AUDIENCE = "v1/audience";
const URL_GET_CONTENT_GROUPS = "v1/social/content-groups";
const URL_GET_CONTENT = "v1/social/contents";

// Creator search endpoints
const URL_GET_LANGUAGES = "/v1/social/creators/dictionary/languages";
const URL_GET_INTERESTS = "v1/social/creators/dictionary/interests";
const URL_GET_BRANDS = "v1/social/creators/dictionary/brands";
const URL_GET_FILTERS_PAYLOAD = "v1/internal/social/creators/filters-config";
const URL_POST_FILTERS_SEARCH = "/v1/internal/social/creators/profiles/search";
const URL_GET_RECENT_SEARCHES = "v1/internal/social/creators/recent-search";
const URL_GET_FEATURED_SEARCHES = "v1/internal/social/creators/featured-search";
const URL_EXPORT_PROFILE_ANALYTICS = "v1/internal/social/creators/profiles/analytics/export";
const URL_GET_ALL_CREATOR_LIST = "/v1/internal/social/creators/lists";
const URL_GET_FAVORITE_LIST = "/v1/internal/social/creators/lists/favourite";
// const URL_GET_PROFILE_ANALYTICS = "v1/internal/social/creators/profiles/analytics";
// For now we will be using the public API for profile analytics
const URL_GET_PROFILE_ANALYTICS = "/v1/internal/social/creators/profiles/analytics";
const URL_SEARCH_RESULT_EXPORT = "/v1/internal/social/creators/profiles/search/export";
const URL_GET_LOCATION_BY_ID = "/v1/social/creators/dictionary/locations";
const URL_USERS_HANDLE = "v1/social/creators/dictionary/userhandles";
const URL_TOPIC_TAGS = "v1/social/creators/dictionary/topics";

// Measurement Dashboard BASE URL
const MEASUREMENT_DASHBOARD_BASE_URL = "v1/measurement/dashboard";

// Campaign Tracking endpoints

const URL_GET_CAMPAIGN_DATA = "v1/internal/social/creators/contents/fetch";
const URL_COMMENT_ANALYTICS = "v1/insights/comment-analytics";
const URL_CREATE_CAMPAIGN = "v1/campaign-management/campaigns";
const URL_GET_CAMPAIGN_BRANDS = "v1/campaign-management/brands/";
const URL_GET_ALL_CAMPAIGNS = "v1/campaign-management/campaigns";
const URL_GET_RECENTLY_WORKED_WITH = "v1/campaign-management/campaign-profiles";
const URL_VALIDATE_FEATURE = "v1/campaign-management/validate-features";
const URL_GET_STORES = "v1/store-management/stores";
const URL_VERIFY_STORE_WEBPAGE = "v1/store-management/verify-store-link";
const URL_PROFILES_ANALYTICS = "profiles/analytics";
const URL_CREATE_SHOPIFY_AUTHORISATION_URL = "v1/store-management/oauth/authorizations";
const URL_CAMPAIGN_FIREBASE_AUTH = "v1/identity/firebase/auth/custom-token";
const URL_GET_ALL_CAMPAIGN_LINKS = 'v1/measurement/dashboard/links';

// Promocode endpoints

const URL_GET_ALL_PROMOCODE_STORES = "v1/measurement/dashboard/stores";
const URL_GET_ALL_PROMOCODES = (store_id) => `v1/measurement/dashboard/${store_id}/discounts`
const URL_GET_PROMOCODES_METRICS = (store_id) => `v1/measurement/dashboard/${store_id}/discounts/metrics`

export {
  currentDashboardURL,
  currentConnectURL,
  webhooksEndpoint,
  signUpEndpoint,
  signInEndpoint,
  validateEmailEndpoint,
  URL_GET_AUDIENCE,
  URL_GET_CONTENT_GROUPS,
  URL_GET_CONTENT,
  tenantInfoEndpoint,
  URL_GET_USER_PROFILE,
  sendEmailVerificationLinkEndpoint,
  forgotPasswordEndpoint,
  getAllTenantsEndpoint,
  URL_GET_ALL_ACCOUNTS_PROFILE,
  rotateCredentialsEndpoint,
  deleteCredentialsEndpoint,
  deleteCreatedUserEndpoint,
  setNewPasswordEndpoint,
  getAllWebhookEventsEndpoint,
  contactSalesEndpoint,
  signOutEndpoint,
  getDisconnectUrl,
  URL_GET_CONNECTION_ATTEMPTS,
  URL_API_EXPORT_TO_CSV,
  URL_CREATE_USER,
  URL_CREATE_USER_TOKEN,
  URL_GET_PROFILE,
  URL_GET_COMMENTS,
  URL_GET_CONTENTS,
  URL_GET_INCOME,
  URL_GET_TENANT_QUOTA_INFO,
  URL_GET_ALL_INVITATIONS,
  URL_GET_CONNECTED_ACCOUNTS,
  URL_GET_FAILED_CONNECTIONS,
  URL_CREATOR_BULK_INVITE,
  URL_API_INDIVIDUAL_INVITE,
  URL_API_RESEND_INVITATION,
  URL_GET_TENANT_PRODUCTS,
  URL_GET_FILTERS_PAYLOAD,
  URL_GET_LANGUAGES,
  URL_GET_INTERESTS,
  URL_GET_BRANDS,
  URL_GET_RECENT_SEARCHES,
  URL_GET_FEATURED_SEARCHES,
  URL_POST_FILTERS_SEARCH,
  URL_GET_PROFILE_ANALYTICS,
  URL_SEARCH_RESULT_EXPORT,
  URL_EXPORT_PROFILE_ANALYTICS,
  URL_GET_LOCATION_BY_ID,
  URL_USERS_HANDLE,
  URL_TOPIC_TAGS,
  URL_GET_CAMPAIGN_DATA,
  URL_COMMENT_ANALYTICS,
  URL_CREATE_CAMPAIGN,
  URL_GET_CAMPAIGN_BRANDS,
  URL_GET_ALL_CAMPAIGNS,
  URL_GET_RECENTLY_WORKED_WITH,
  URL_VALIDATE_FEATURE,
  URL_GET_STORES,
  URL_VERIFY_STORE_WEBPAGE,
  URL_PROFILES_ANALYTICS,
  URL_CREATE_SHOPIFY_AUTHORISATION_URL,
  URL_CAMPAIGN_FIREBASE_AUTH,
  URL_GET_ALL_CREATOR_LIST,
  URL_GET_FAVORITE_LIST,
  URL_GET_ALL_CAMPAIGN_LINKS,
  MEASUREMENT_DASHBOARD_BASE_URL,
  URL_GET_ALL_PROMOCODE_STORES,
  URL_GET_PROMOCODES_METRICS,
  URL_GET_ALL_PROMOCODES
};
