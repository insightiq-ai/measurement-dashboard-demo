import { CURR_SELECTED_ENV_KEY } from "../../constants/constants";
import { getEnvBaseURL } from "../../utils/util";
import {
  ADD_TENANT_INFORMATION,
  UPDATE_TENANT_STATUS,
  ADD_USER_STEPS,
  ADD_WEBHOOKS,
  FETCH_WEBHOOKS,
  REMOVE_WAREHOUSE,
  ADD_ENVIRONMENT,
  UPDATE_COMPLIANCE_FORM_STATUS,
  UPDATE_ENVIRONMENT_BASE_URL,
  UPDATE_CREATOR_SEARCH_MODULE_STATUS,
  UPDATE_PRODUCTION_KEY_STATUS,
  UPDATE_CREATOR_LINKAGE_MODULE_STATUS,
  SHOW_TOP_HEADER,
  HIDE_TOP_HEADER,
  ADD_USAGE_QUOTA,
  ADD_ENABLED_PRODUCTS,
} from "./types";

// Set the default environment during startup here
const DEFAULT_ENVIRONMENT = sessionStorage.getItem(CURR_SELECTED_ENV_KEY) ?? "production";

const DEFAULT_WAREHOUSE_STATE = {
  tenantInfo: [],
  tenantStatus: false,
  webhooks: [],
  environment: {
    current: DEFAULT_ENVIRONMENT,
    available: ["sandbox", "production", "staging"],
  },
  webhookStatus: {
    loading: true,
    error: "",
    fetchedInitially: false,
  },
  userCurrentStep: 1,
  isComplianceFormFilled: false,
  productionKeys: {
    isAvailable: false,
  },
  environmentBaseURL: getEnvBaseURL(DEFAULT_ENVIRONMENT),
  environmentChanged: false,
  headerTopNavInfo: {
    scrollable: false,
    showHeader: false,
    backgroundColor: "",
    title: "",
    textClass: "",
  },
  tenantAppProducts: {},
  tenantUsageQuota: {
    quotaInfoCreatorModule: {},
  },
};

const warehouseReducer = (state, action) => {
  switch (action.type) {
    case ADD_TENANT_INFORMATION:
      return {
        ...state,
        tenantInfo: action.payload,
        environmentChanged: false,
      };
    case UPDATE_TENANT_STATUS:
      return { ...state, tenantStatus: true };
    case FETCH_WEBHOOKS:
      return { ...state, webhookStatus: { loading: true, error: "" } };
    case ADD_WEBHOOKS:
      return {
        ...state,
        webhooks: action.payload,
        webhookStatus: { loading: false, error: "", fetchedInitially: true },
      };
    case REMOVE_WAREHOUSE:
      return {
        ...state,
        ...DEFAULT_WAREHOUSE_STATE,
      };
    case ADD_USER_STEPS:
      return {
        ...state,
        userCurrentStep: action.payload,
      };
    case ADD_ENVIRONMENT:
      return {
        ...state,
        tenantInfo: [],
        tenantStatus: false,
        webhooks: [],
        webhookStatus: {
          loading: true,
          error: "",
          fetchedInitially: false,
        },
        environment: {
          current: action.payload,
          available: DEFAULT_WAREHOUSE_STATE.environment.available,
        },
        environmentChanged: true,
      };
    case UPDATE_COMPLIANCE_FORM_STATUS:
      return {
        ...state,
        isComplianceFormFilled: true,
      };
    case UPDATE_PRODUCTION_KEY_STATUS:
      return {
        ...state,
        productionKeys: {
          isAvailable: action.payload.isAvailable,
        },
      };
    case UPDATE_ENVIRONMENT_BASE_URL:
      return {
        ...state,
        environmentBaseURL: action.payload,
      };
    case SHOW_TOP_HEADER: {
      return {
        ...state,
        headerTopNavInfo: {
          showHeader: true,
          scrollable: action.payload.scrollable,
          backgroundColor: action.payload.backgroundColor,
          title: action.payload.title,
          textClass: action.payload.textClass,
        },
      };
    }
    case HIDE_TOP_HEADER:
      return {
        ...state,
        headerTopNavInfo: {
          ...state.headerTopNavInfo,
          showHeader: false,
        },
      };
    case ADD_USAGE_QUOTA:
      return {
        ...state,
        tenantUsageQuota: {
          quotaInfoCreatorModule: action.payload,
        },
      };
    case ADD_ENABLED_PRODUCTS:
      return {
        ...state,
        tenantAppProducts: action.payload,
      };
    default:
      return state;
  }
};

export { DEFAULT_WAREHOUSE_STATE, warehouseReducer };
