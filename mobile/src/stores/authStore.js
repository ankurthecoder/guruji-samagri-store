import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            needsProfileSetup: false,
            loading: false,
            error: null,

            // Actions
            setUser: (user) => set({ user }),

            setToken: (token) => set({ token }),

            setAuth: (authData) => set({
                user: authData.user,
                token: authData.token,
                isAuthenticated: true,
                needsProfileSetup: authData.needsProfileSetup || false,
            }),

            updateProfile: (profileData) => set((state) => ({
                user: { ...state.user, ...profileData },
                needsProfileSetup: false,
            })),

            setNeedsProfileSetup: (needs) => set({ needsProfileSetup: needs }),

            setLoading: (loading) => set({ loading }),

            setError: (error) => set({ error }),

            logout: async () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    needsProfileSetup: false,
                    loading: false,
                    error: null,
                });
                await AsyncStorage.removeItem('auth-storage');
            },

            // Getters
            getToken: () => get().token,
            getUser: () => get().user,
            isLoggedIn: () => get().isAuthenticated,
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuthStore;
