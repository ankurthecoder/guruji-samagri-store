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
} from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, Logout } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ bgcolor: COLORS.PRIMARY, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Guruji Samagri Store - Admin
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user?.name || user?.email}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => navigate(item.path)}
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
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
