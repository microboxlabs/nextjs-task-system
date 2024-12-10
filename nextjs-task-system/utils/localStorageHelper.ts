const isLocalStorageAvailable = (): boolean => {
  const available = typeof window !== "undefined" && typeof localStorage !== "undefined";
  if (!available) {
    console.warn("localStorage is not available in this environment.");
  }
  return available;
};

export const localStorageHelper = {
  setItem: <T>(key: string, value: T): void => {
    if (!key || typeof key !== 'string') {
      console.error('Invalid key provided to setItem');
      return;
    }

    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, { error, key, valueType: typeof value });
    }
  },

  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    if (!key || typeof key !== 'string') {
      console.error('Invalid key provided to getItem');
      return defaultValue;
    }

    if (!isLocalStorageAvailable()) return defaultValue;

    try {
      const value = localStorage.getItem(key);
      if (!value) return defaultValue;

      const parsed = JSON.parse(value);

      // Validate type safety
      if (typeof parsed !== typeof defaultValue) {
        console.warn(`Type mismatch for key ${key}. Expected ${typeof defaultValue}, got ${typeof parsed}`);
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    if (!key || typeof key !== 'string') {
      console.error('Invalid key provided to removeItem');
      return;
    }

    if (!isLocalStorageAvailable()) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  },
};
