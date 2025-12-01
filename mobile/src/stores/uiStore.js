import { create } from 'zustand';

const useUIStore = create((set) => ({
    isTabBarVisible: true,
    setTabBarVisible: (visible) => set({ isTabBarVisible: visible }),
}));

export default useUIStore;
