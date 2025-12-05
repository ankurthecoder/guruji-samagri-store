import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Brand Colors
export const COLORS = {
    // Primary Colors
    PRIMARY: '#0C831F',      // Green - Main brand color
    ACCENT: '#F7CA00',       // Yellow/Gold - Accent color

    // UI Colors
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY: '#808080',
    LIGHT_GRAY: '#F5F5F5',
    DARK_GRAY: '#333333',

    // Functional Colors
    SUCCESS: '#4CAF50',
    ERROR: '#F44336',
    WARNING: '#FF9800',
    INFO: '#2196F3',

    // Background
    BACKGROUND: '#FFFFFF',
    CARD_BG: '#FFFFFF',

    // Text
    TEXT_PRIMARY: '#212121',
    TEXT_SECONDARY: '#757575',
    TEXT_LIGHT: '#FFFFFF',

    // Border
    BORDER: '#E0E0E0',

    // Shadow
    SHADOW: '#00000029',
};

export const SIZES = {
    // Font Sizes - using moderateScale for balanced scaling (Blinkit-style compact sizing)
    FONT_XS: moderateScale(8),
    FONT_SM: moderateScale(10),
    FONT_MD: moderateScale(11),
    FONT_LG: moderateScale(12),
    FONT_XL: moderateScale(14),
    FONT_XXL: moderateScale(16),
    FONT_TITLE: moderateScale(18),
    FONT_HEADING: moderateScale(20),

    // Spacing - using scale for horizontal/general spacing
    PADDING_XS: scale(4),
    PADDING_SM: scale(8),
    PADDING_MD: scale(12),
    PADDING_LG: scale(16),
    PADDING_XL: scale(20),
    PADDING_XXL: scale(24),

    // Border Radius - using scale
    RADIUS_SM: scale(4),
    RADIUS_MD: scale(8),
    RADIUS_LG: scale(12),
    RADIUS_XL: scale(16),
    RADIUS_ROUND: scale(50),

    // Icon Sizes - using scale
    ICON_SM: scale(16),
    ICON_MD: scale(20),
    ICON_LG: scale(24),
    ICON_XL: scale(32),
};

export const FONTS = {
    REGULAR: 'System',
    MEDIUM: 'System',
    BOLD: 'System',
    LIGHT: 'System',
};
