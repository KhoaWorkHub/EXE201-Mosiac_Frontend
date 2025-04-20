export const StorageService = {
    getItem: <T>(key: string): T | null => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(`Error getting item ${key} from localStorage:`, error);
        localStorage.removeItem(key);
        return null;
      }
    },
  
    setItem: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting item ${key} in localStorage:`, error);
      }
    },
  
    removeItem: (key: string): void => {
      localStorage.removeItem(key);
    },
  
    clear: (): void => {
      localStorage.clear();
    }
  };