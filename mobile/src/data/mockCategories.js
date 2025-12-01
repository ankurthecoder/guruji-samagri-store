// Mock category data for Blinkit-style category browsing
// This will be replaced with real API data in production

export const CATEGORIES = [
    {
        id: 'grocery-kitchen',
        name: 'Grocery & Kitchen',
        icon: '🛒',
        color: '#FFE8CC',
        subcategories: [
            { id: 'vegetables-fruits', name: 'Vegetables & Fruits', productCount: 120, emoji: '🥬' },
            { id: 'atta-rice-dal', name: 'Atta, Rice & Dal', productCount: 85, emoji: '🌾' },
            { id: 'oil-ghee-masala', name: 'Oil, Ghee & Masala', productCount: 95, emoji: '🛢️' },
            { id: 'dairy-bread-eggs', name: 'Dairy, Bread & Eggs', productCount: 110, emoji: '🥛' },
            { id: 'dry-fruits', name: 'Dry Fruits & Cereals', productCount: 60, emoji: '🥜' },
            { id: 'bakery', name: 'Bakery & Biscuits', productCount: 75, emoji: '🍪' },
            { id: 'chicken-meat', name: 'Chicken, Meat & Fish', productCount: 40, emoji: '🍗' },
            { id: 'kitchenware', name: 'Kitchenware & Appliances', productCount: 50, emoji: '🍳' },
            { id: 'instant-food', name: 'Instant Food', productCount: 65, emoji: '🍜' },
        ],
    },
    {
        id: 'snacks-drinks',
        name: 'Snacks & Drinks',
        icon: '🍿',
        color: '#FFE0E0',
        subcategories: [
            { id: 'chips-namkeen', name: 'Chips & Namkeen', productCount: 150, emoji: '🥨' },
            { id: 'sweets-chocolates', name: 'Sweets & Chocolates', productCount: 130, emoji: '🍫' },
            { id: 'drinks-juices', name: 'Drinks & Juices', productCount: 95, emoji: '🥤' },
            { id: 'tea-coffee-drinks', name: 'Tea, Coffee & Milk Drinks', productCount: 75, emoji: '☕' },
        ],
    },
    {
        id: 'puja-essentials',
        name: 'Puja Essentials',
        icon: '🪔',
        color: '#FFE5B4',
        subcategories: [
            { id: 'incense-dhoop', name: 'Incense & Dhoop', productCount: 60, emoji: '🕉️' },
            { id: 'puja-samagri', name: 'Puja Samagri', productCount: 85, emoji: '🙏' },
            { id: 'idols-frames', name: 'Idols & Frames', productCount: 45, emoji: '🛕' },
            { id: 'diyas-candles', name: 'Diyas & Candles', productCount: 40, emoji: '🪔' },
        ],
    },
    {
        id: 'personal-care',
        name: 'Personal Care',
        icon: '💄',
        color: '#E8F5E9',
        subcategories: [
            { id: 'skincare', name: 'Skincare', productCount: 120, emoji: '🧴' },
            { id: 'haircare', name: 'Haircare', productCount: 90, emoji: '💇' },
            { id: 'oral-care', name: 'Oral Care', productCount: 55, emoji: '🦷' },
            { id: 'bath-body', name: 'Bath & Body', productCount: 80, emoji: '🛁' },
        ],
    },
    {
        id: 'home-cleaning',
        name: 'Home & Cleaning',
        icon: '🧹',
        color: '#E3F2FD',
        subcategories: [
            { id: 'detergents', name: 'Detergents & Liquids', productCount: 70, emoji: '🧼' },
            { id: 'cleaners', name: 'Cleaners & Disinfectants', productCount: 65, emoji: '🧽' },
            { id: 'fresheners', name: 'Fresheners & Repellents', productCount: 45, emoji: '🌸' },
            { id: 'kitchen-accessories', name: 'Kitchen Accessories', productCount: 90, emoji: '🍽️' },
        ],
    },
    {
        id: 'health-wellness',
        name: 'Health & Wellness',
        icon: '💊',
        color: '#F3E5F5',
        subcategories: [
            { id: 'vitamins-supplements', name: 'Vitamins & Supplements', productCount: 85, emoji: '💊' },
            { id: 'ayurveda', name: 'Ayurveda', productCount: 95, emoji: '🌿' },
            { id: 'health-devices', name: 'Health Devices', productCount: 40, emoji: '🩺' },
            { id: 'fitness', name: 'Fitness & Sports', productCount: 60, emoji: '🏋️' },
        ],
    },
];

// Category to product mapping (maps to existing mockProducts)
export const CATEGORY_PRODUCT_MAP = {
    'skincare': ['sunscreen', 'faceWash'],
    'health-wellness': ['masks', 'airPurifiers'],
    'ayurveda': ['honey'],
    'tea-coffee-drinks': ['tea'],
    // Add more mappings as needed
};

// Get products for a specific category
export const getProductsByCategory = (categoryId, allProducts) => {
    const productCategories = CATEGORY_PRODUCT_MAP[categoryId] || [];
    const products = [];

    productCategories.forEach(category => {
        if (allProducts[category]) {
            products.push(...allProducts[category]);
        }
    });

    return products;
};

// Get category by ID
export const getCategoryById = (categoryId) => {
    for (const category of CATEGORIES) {
        if (category.id === categoryId) {
            return category;
        }
        const subcategory = category.subcategories.find(sub => sub.id === categoryId);
        if (subcategory) {
            return { ...subcategory, parentCategory: category };
        }
    }
    return null;
};

export default CATEGORIES;
