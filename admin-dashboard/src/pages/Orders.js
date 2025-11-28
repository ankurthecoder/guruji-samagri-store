import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Chip,
    Button,
    Box,
    TextField,
} from '@mui/material';
import apiClient from '../services/api';
import { COLORS } from '../utils/constants';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: 1,
                limit: 50,
                ...(statusFilter !== 'all' && { status: statusFilter }),
            };
            const response = await apiClient.get('/orders', { params });
            setOrders(response.orders || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Reload orders
            loadOrders();
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'error',
        };
        return colors[status] || 'default';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.PRIMARY }}>
                    Order Management
                </Typography>
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All Orders</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: COLORS.PRIMARY }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Items</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order._id} hover>
                                    <TableCell>#{order._id.slice(-8)}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="500">
                                                {order.user?.name || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {order.user?.phoneNumber || ''}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{order.items?.length || 0}</TableCell>
                                    <TableCell>
                                        <Typography fontWeight="bold" color={COLORS.PRIMARY}>
                                            ₹{order.totalAmount}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            size="small"
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="processing">Processing</MenuItem>
                                            <MenuItem value="shipped">Shipped</MenuItem>
                                            <MenuItem value="delivered">Delivered</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Orders;
