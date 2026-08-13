// Admin credentials - In production, use environment variables
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "pulsemed@2024"
};

export const validateAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

export const isAdminLoggedIn = (token: string | null): boolean => {
  if (!token) return false;
  // Simple token validation - in production use JWT
  return token === btoa(`${ADMIN_CREDENTIALS.username}:${ADMIN_CREDENTIALS.password}`);
};

export const generateAdminToken = (): string => {
  return btoa(`${ADMIN_CREDENTIALS.username}:${ADMIN_CREDENTIALS.password}`);
};
