export const API_BASE_URL = '/api'; // Usará el proxy

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/Auth/login`,
    REGISTER: `${API_BASE_URL}/Auth/register`,
    VERIFY: `${API_BASE_URL}/Auth/verify`,
    LOGOUT: `${API_BASE_URL}/Auth/logout`
  },
  BOOKS: {
    BASE: `${API_BASE_URL}/Books`,
    GET_ALL: `${API_BASE_URL}/Books`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/Books/${id}`,
    CREATE: `${API_BASE_URL}/Books`,
    UPDATE: (id: string) => `${API_BASE_URL}/Books/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/Books/${id}`,
    SEARCH: `${API_BASE_URL}/Books/search`,
    AVAILABILITY: (id: string) => `${API_BASE_URL}/Books/${id}/availability`
  },
  LOANS: {
    BASE: `${API_BASE_URL}/Loans`,
    GET_ALL: `${API_BASE_URL}/Loans`,
    GET_MY_LOANS: `${API_BASE_URL}/Loans/my-loans`,
    GET_MY_ACTIVE_LOANS: `${API_BASE_URL}/Loans/my-active-loans`,
    GET_OVERDUE: `${API_BASE_URL}/Loans/overdue`,
    GET_USER_LOANS: (username: string) => `${API_BASE_URL}/Loans/user/${username}`,
    CREATE: `${API_BASE_URL}/Loans`,
    REQUEST: `${API_BASE_URL}/Loans/request`,
    RETURN: (id: string) => `${API_BASE_URL}/Loans/${id}/return`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/Loans/${id}/status`,
    STATISTICS: `${API_BASE_URL}/Loans/statistics`
  },
  LOGS: {
    BASE: `${API_BASE_URL}/Log`,
    RECENT: `${API_BASE_URL}/Log/recent`,
    BY_LEVEL: (level: string) => `${API_BASE_URL}/Log/count/${level}`,
    DATE_RANGE: `${API_BASE_URL}/Log/date-range`,
    BY_USER: (username: string) => `${API_BASE_URL}/Log/user/${username}`,
    STATISTICS: `${API_BASE_URL}/Log/statistics`,
    SEARCH: `${API_BASE_URL}/Log/search`
  }
};