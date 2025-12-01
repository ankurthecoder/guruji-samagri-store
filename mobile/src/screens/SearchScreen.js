import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import mockProducts from '../data/mockProducts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([
        'puja samagri',
        'organic honey',
        'incense sticks',
    ]);
    const [popularSearches] = useState([
        'rudraksha mala',
        'camphor',
        'agarbatti',
        'diya',
        'puja thali',
        'kumkum',
        'haldi powder',
        'coconut',
    ]);
    const searchInputRef = useRef(null);

    // Get all products from mockProducts
    const getAllProducts = () => {
        const allProducts = [];
        Object.keys(mockProducts).forEach(category => {
            allProducts.push(...mockProducts[category]);
        });
        return allProducts;
    };

    useEffect(() => {
        // Auto-focus the search input when screen loads
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            // Filter products based on search query
            const allProducts = getAllProducts();
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearch = (query) => {
        if (query.trim()) {
            // Add to recent searches if not already there
            if (!recentSearches.includes(query)) {
                setRecentSearches([query, ...recentSearches.slice(0, 4)]);
            }
            // TODO: Navigate to search results or implement search logic
            console.log('Searching for:', query);
        }
    };

    const handleSuggestionPress = (product) => {
        setSearchQuery(product.name);
        handleSearch(product.name);
    };

    const handleRecentSearchPress = (query) => {
        setSearchQuery(query);
        handleSearch(query);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(item)}>
            <Ionicons name="search-outline" size={20} color={COLORS.TEXT_SECONDARY} />
            <View style={styles.suggestionContent}>
                <Text style={styles.suggestionName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.suggestionCategory}>{item.category}</Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={18} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            {/* Search Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} />
                    <TextInput
                        ref={searchInputRef}
                        style={styles.searchInput}
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={() => handleSearch(searchQuery)}
                        returnKeyType="search"
                        placeholderTextColor={COLORS.TEXT_SECONDARY}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color={COLORS.TEXT_SECONDARY} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {searchQuery.trim().length > 0 && suggestions.length > 0 ? (
                    // Show suggestions when typing
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suggestions</Text>
                        <FlatList
                            data={suggestions}
                            renderItem={renderSuggestion}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    </View>
                ) : searchQuery.trim().length > 0 && suggestions.length === 0 ? (
                    // No results found
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={60} color={COLORS.BORDER} />
                        <Text style={styles.emptyTitle}>No products found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try searching for something else
                        </Text>
                    </View>
                ) : (
                    // Show recent and popular searches when not typing
                    <>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                                    <TouchableOpacity onPress={clearRecentSearches}>
                                        <Text style={styles.clearText}>Clear All</Text>
                                    </TouchableOpacity>
                                </View>
                                {recentSearches.map((search, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.recentItem}
                                        onPress={() => handleRecentSearchPress(search)}>
                                        <Ionicons name="time-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                                        <Text style={styles.recentText}>{search}</Text>
                                        <Ionicons name="arrow-forward-outline" size={18} color={COLORS.TEXT_SECONDARY} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Popular Searches */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Popular Searches</Text>
                            <View style={styles.popularGrid}>
                                {popularSearches.map((search, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.popularChip}
                                        onPress={() => handleRecentSearchPress(search)}>
                                        <Text style={styles.popularText}>{search}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_MD,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        backgroundColor: COLORS.WHITE,
    },
    backButton: {
        marginRight: SIZES.PADDING_MD,
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.LIGHT_GRAY,
        borderRadius: SIZES.RADIUS_MD,
        paddingHorizontal: SIZES.PADDING_MD,
        height: 44,
    },
    searchInput: {
        flex: 1,
        marginLeft: SIZES.PADDING_SM,
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
    },
    clearButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_MD,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.PADDING_MD,
    },
    sectionTitle: {
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: SIZES.PADDING_SM,
    },
    clearText: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.PRIMARY,
        fontWeight: '500',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.PADDING_MD,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    suggestionContent: {
        flex: 1,
        marginLeft: SIZES.PADDING_MD,
    },
    suggestionName: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 2,
    },
    suggestionCategory: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.PADDING_MD,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    recentText: {
        flex: 1,
        marginLeft: SIZES.PADDING_MD,
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
    },
    popularGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: SIZES.PADDING_SM,
    },
    popularChip: {
        backgroundColor: COLORS.LIGHT_GRAY,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_SM,
        borderRadius: SIZES.RADIUS_ROUND,
        marginRight: SIZES.PADDING_SM,
        marginBottom: SIZES.PADDING_SM,
    },
    popularText: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginTop: SIZES.PADDING_LG,
    },
    emptySubtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
        marginTop: SIZES.PADDING_SM,
    },
});

export default SearchScreen;
