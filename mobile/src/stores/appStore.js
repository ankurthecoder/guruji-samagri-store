import { create } from 'zustand';
import { getAppConfig, getExclusiveSections } from '../services/api';

const useAppStore = create((set, get) => ({
    // State
    config: null,
    exclusiveSections: [],
    loading: false,
    error: null,

    // Actions
    fetchAppData: async () => {
        set({ loading: true, error: null });
        try {
            // Fetch both in parallel
            const [configRes, sectionsRes] = await Promise.all([
                getAppConfig(),
                getExclusiveSections()
            ]);
            // alert(JSON.stringify(configRes.data));
            alert(JSON.stringify(sectionsRes.data));
            set({
                config: configRes.data,
                exclusiveSections: sectionsRes.data,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching app data:', error);
            set({
                error: error.message || 'Failed to fetch app data',
                loading: false
            });
        }
    },

    setConfig: (config) => set({ config }),
    setExclusiveSections: (sections) => set({ exclusiveSections: sections }),
}));

export default useAppStore;
