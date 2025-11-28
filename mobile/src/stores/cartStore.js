import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    // State
    items: [],
    totalItems: 0,
    totalAmount: 0,

    // Actions
    addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
            (item) => item.product._id === product._id
        );

        let newItems;
        if (existingItemIndex >= 0) {
            newItems = [...currentItems];
            newItems[existingItemIndex].quantity += quantity;
        } else {
            newItems = [...currentItems, { product, quantity }];
        }

        set({
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: newItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        });
    },

    removeItem: (productId) => {
        const newItems = get().items.filter((item) => item.product._id !== productId);
        set({
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: newItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        const newItems = get().items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
        );

        set({
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: newItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        });
    },

    clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),

    // Getters
    getItemCount: () => get().totalItems,
    getTotal: () => get().totalAmount,
}));

export default useCartStore;
