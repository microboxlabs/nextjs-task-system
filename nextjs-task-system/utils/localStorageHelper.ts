export const localStorageHelper = {
  setItem: (key: string, value: any): void => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        console.warn("localStorage is not available in this environment.");
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  },

  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        console.warn("localStorage is not available in this environment.");
        return defaultValue;
      }
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        console.warn("localStorage is not available in this environment.");
        return;
      }
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },
};
