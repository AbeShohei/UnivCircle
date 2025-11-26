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
const saveLocalCircle = (circle: Circle) => {
  const current = getLocalCircles();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, circle]));
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
    saveLocalCircle(circle);
    return circle;
  },

  // Get circles managed by a specific user (admin)
  getMinagedCircles: (userId: string): Circle[] => {
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
