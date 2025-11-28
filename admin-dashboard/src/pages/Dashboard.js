import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import { ShoppingCart, People, CheckCircle, Pending } from '@mui/icons-material';
import apiClient from '../services/api';
import { COLORS } from '../utils/constants';

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
                        {value}
                    </Typography>
                </Box>
                <Icon sx={{ fontSize: 48, color, opacity: 0.3 }} />
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        activeUsers: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch orders (you can add more API calls for different metrics)
            const ordersResponse = await apiClient.get('/orders', {
                params: { page: 1, limit: 10 },
            });

            const orders = ordersResponse.orders || [];

            setMetrics({
                totalOrders: ordersResponse.total || 0,
                activeUsers: ordersResponse.total || 0, // Placeholder - add users endpoint
                deliveredOrders: orders.filter(o => o.status === 'delivered').length,
                pendingOrders: orders.filter(o => o.status === 'pending').length,
            });

            setRecentOrders(orders);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: COLORS.PRIMARY }}>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* Metrics */}
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total Orders"
                        value={metrics.totalOrders}
                        icon={ShoppingCart}
                        color={COLORS.PRIMARY}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Active Users"
                        value={metrics.activeUsers}
                        icon={People}
                        color={COLORS.INFO}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Delivered Orders"
                        value={metrics.deliveredOrders}
                        icon={CheckCircle}
                        color={COLORS.SUCCESS}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Pending Orders"
                        value={metrics.pendingOrders}
                        icon={Pending}
                        color={COLORS.WARNING}
                    />
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Recent Orders
                        </Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : recentOrders.length > 0 ? (
                            <Box>
                                {recentOrders.slice(0, 5).map((order) => (
                                    <Box
                                        key={order._id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            py: 2,
                                            borderBottom: '1px solid #eee',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body1" fontWeight="500">
                                                Order #{order._id.slice(-8)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {order.user?.name || 'Unknown User'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body1" fontWeight="bold" color={COLORS.PRIMARY}>
                                                ₹{order.totalAmount}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: order.status === 'delivered' ? '#e8f5e9' : '#fff3e0',
                                                    color: order.status === 'delivered' ? '#2e7d32' : '#e65100',
                                                }}
                                            >
                                                {order.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="textSecondary">No orders found</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
