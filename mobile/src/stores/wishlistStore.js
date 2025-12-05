import { create } from 'zustand';

const useWishlistStore = create((set, get) => ({
    items: [],

    // Add item to wishlist
    addToWishlist: (product) => {
        const { items } = get();
        const exists = items.find(item => item._id === product._id);

        if (!exists) {
            set({ items: [...items, product] });
        }
    },

    // Remove item from wishlist
    removeFromWishlist: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
    },

    // Check if item is in wishlist
    isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
    },

    // Toggle wishlist
    toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.find(item => item._id === product._id);

        if (exists) {
            get().removeFromWishlist(product._id);
        } else {
            get().addToWishlist(product);
        }
    },

    // Clear wishlist
    clearWishlist: () => {
        set({ items: [] });
    },
}));

export default useWishlistStore;
