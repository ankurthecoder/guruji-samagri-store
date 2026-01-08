import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Breadcrumbs,
    Link,
    CircularProgress,
    Alert,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import ProductForm from '../../components/products/ProductForm';
import productService from '../../services/productService';
import { COLORS } from '../../utils/constants';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data.product);
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        navigate('/products');
    };

    const handleCancel = () => {
        navigate('/products');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ mb: 3 }}
            >
                <Link underline="hover" color="inherit" component={RouterLink} to="/">
                    Dashboard
                </Link>
                <Link underline="hover" color="inherit" component={RouterLink} to="/products">
                    Products
                </Link>
                <Typography color="text.primary">
                    {isEdit ? 'Edit Product' : 'Add Product'}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.PRIMARY }}>
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box sx={{ mt: 2 }}>
                <ProductForm
                    product={product}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Box>
        </Box>
    );
};

export default ProductEdit;
