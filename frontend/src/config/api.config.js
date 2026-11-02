const ENVIRONMENT = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "development";

const config = {
  development: {
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || "https://mathguruabacus.onrender.com/api",
  },
};

export const currentConfig = config[ENVIRONMENT] || config.development;
export default currentConfig;

