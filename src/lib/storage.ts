// Safe Browser Storage Access Helper
// Handles SSR / hydration mismatches safely

export const STORAGE_KEYS = {
  SESSION: 'site2schedule_session',
  TASKS: 'site2schedule_tasks',
  SUBMISSIONS: 'site2schedule_submissions',
  REVIEWS: 'site2schedule_reviews',
  NOTIFICATIONS: 'site2schedule_notifications',
  AUDIT: 'site2schedule_audit',
  PROJECTS: 'site2schedule_projects',
  ACTIVITIES: 'site2schedule_activities',
} as const;

export const storage = {
  // Session storage (cleared on browser session end)
  getSession<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`[storage] Error reading sessionStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  setSession<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[storage] Error setting sessionStorage key "${key}":`, e);
    }
  },

  removeSession(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Error removing sessionStorage key "${key}":`, e);
    }
  },

  // Local storage (persisted across page reloads)
  getLocal<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`[storage] Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[storage] Error setting localStorage key "${key}":`, e);
    }
  },

  removeLocal(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage] Error removing localStorage key "${key}":`, e);
    }
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(k => {
        window.localStorage.removeItem(k);
        window.sessionStorage.removeItem(k);
      });
    } catch (e) {
      console.warn('[storage] Error clearing storage:', e);
    }
  },
};
