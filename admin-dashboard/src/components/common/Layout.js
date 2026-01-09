import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, Logout, Storefront, Category, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';




const drawerWidth = 240;

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [desktopOpen, setDesktopOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        // Toggle appropriate state based on screen size could be handled by checking window.innerWidth
        // But since we render distinct buttons or logic, we can just check if we are on mobile
        // effectively via css display, but logic wise:
        if (window.innerWidth < 600) {
            setMobileOpen(!mobileOpen);
        } else {
            setDesktopOpen(!desktopOpen);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
        { text: 'Products', icon: <Storefront />, path: '/products' },
        { text: 'Categories', icon: <Category />, path: '/categories' },
    ];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (window.innerWidth < 600) setMobileOpen(false);
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: `${COLORS.PRIMARY}22`,
                                    borderRight: `3px solid ${COLORS.PRIMARY}`,
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? COLORS.PRIMARY : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: COLORS.PRIMARY,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Guruji Samagri Store
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                        {user?.name || user?.email}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="persistent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                        },
                    }}
                    open={desktopOpen}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 0}px)` },
                    ml: { sm: 0 }, // Handled by flex layout since nav box width changes
                    transition: 'width 0.3s'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
