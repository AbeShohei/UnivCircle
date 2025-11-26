import { Circle } from '../types';
import { MOCK_CIRCLES } from '../constants';

// Key for LocalStorage
const STORAGE_KEY = 'univCircle_registeredCircles';

// Helper to get local circles
const getLocalCircles = (): Circle[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save local circles
const saveLocalCircles = (circles: Circle[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(circles));
};

export const circleService = {
  // Get all circles (Mock + Local)
  getAllCircles: (): Circle[] => {
    const local = getLocalCircles();
    // Return local first so they appear at top if sorted by newest
    return [...local, ...MOCK_CIRCLES];
  },

  // Get circle by ID
  getCircleById: (id: string): Circle | undefined => {
    const all = circleService.getAllCircles();
    return all.find(c => c.id === id);
  },

  // Register a new circle
  registerCircle: (newCircle: Omit<Circle, 'id'> & { adminId?: string }): Circle => {
    const circle: Circle = {
      ...newCircle,
      id: `local-${Date.now()}`, // Generate unique ID
    };
    const current = getLocalCircles();
    saveLocalCircles([...current, circle]);
    return circle;
  },

  // Update existing circle
  updateCircle: (updatedCircle: Circle): void => {
    const local = getLocalCircles();
    // Check if it's a local circle
    const index = local.findIndex(c => c.id === updatedCircle.id);
    
    if (index !== -1) {
      // It's a local circle, update it
      local[index] = updatedCircle;
      saveLocalCircles(local);
    } else {
      // If it's a mock circle, we can't persist changes to constants.ts in a static build,
      // but for this demo environment, we can "shadow" it by adding it to local storage
      // effectively treating it as a new local copy overriding the mock.
      // However, to keep it simple and avoid duplicates in getAllCircles, 
      // we'll just simulate success for mock circles or add to local as if it's new but keeping ID.
      // For a robust demo, let's treat it as "saving a copy" if it was mock.
      
      // Check if it was a mock circle
      const isMock = MOCK_CIRCLES.some(c => c.id === updatedCircle.id);
      if (isMock) {
        // In a real app, you can't edit hardcoded mocks. 
        // We will just do nothing for mocks or log a warning.
        console.warn("Cannot permanently update mock data in this demo environment.");
      }
    }
  },

  // Get circles managed by a specific user (admin)
  getManagedCircles: (userId: string): Circle[] => {
    // For demo purposes, we will return:
    // 1. Circles explicitly created by this user (stored in local with adminId)
    // 2. If none, return a default mock circle just so the admin panel isn't empty for demo
    
    const local = getLocalCircles();
    // @ts-ignore - adminId might not exist on type Circle strictly but we store it
    const userCircles = local.filter((c: any) => c.adminId === userId);

    if (userCircles.length > 0) {
      return userCircles;
    }

    // Fallback for demo: if user has no circles, give them access to the first mock circle
    // In a real app, this would return empty array
    return [MOCK_CIRCLES[0]];
  },

  // Search/Filter circles
  searchCircles: (filters: { 
    keyword?: string, 
    university?: string, 
    category?: string | null, 
    campus?: string | null, 
    tags?: string[] 
  }): Circle[] => {
    const all = circleService.getAllCircles();
    
    return all.filter(circle => {
      // Keyword match
      if (filters.keyword && 
          !circle.name.toLowerCase().includes(filters.keyword.toLowerCase()) && 
          !circle.description.includes(filters.keyword)) {
        return false;
      }
      // University match
      if (filters.university && circle.university !== filters.university) {
        return false;
      }
      // Category match
      if (filters.category && circle.category !== filters.category) {
        return false;
      }
      // Campus match
      if (filters.campus && !circle.campus.includes(filters.campus)) {
        return false;
      }
      // Tags match (AND logic)
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => circle.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      return true;
    });
  }
};