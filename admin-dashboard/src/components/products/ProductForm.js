import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Typography,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    InputAdornment,
    Radio,
    FormControlLabel,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Inventory,
    Description,
    CurrencyRupee,
    PhotoLibrary,
    Add as AddIcon,
    Visibility,
    Edit as EditIcon,
} from '@mui/icons-material';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import unitService from '../../services/unitService';
import { COLORS } from '../../utils/constants';


const ProductForm = ({ product, onSave, onCancel }) => {
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Puja Items',
        images: [],
        variants: [{
            unit: '',
            quantity: 1,
            price: '',
            discount: 0,
            stock: '',
            minOrderQuantity: 1,
            maxOrderQuantity: 10,
        }],
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [unitDialogOpen, setUnitDialogOpen] = useState(false);
    const [unitForm, setUnitForm] = useState({ name: '', convention: '' });
    const [editingUnitId, setEditingUnitId] = useState(null);
    const [unitLoading, setUnitLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catData, unitData] = await Promise.all([
                    categoryService.getCategories(),
                    unitService.getUnits()
                ]);
                console.log('Fetched Categories:', catData);
                console.log('Fetched Units:', unitData);
                setCategories(catData.categories);
                setUnits(unitData.units);

                // Set default unit if not set
                if (!formData.unit && unitData.units && unitData.units.length > 0) {
                    setFormData(prev => ({ ...prev, unit: unitData.units[0].name }));
                }
            } catch (error) {
                console.error('Error fetching dynamic data:', error);
            }
        };
        fetchData();
    }, []);

    // Helper function to flatten categories hierarchically
    const getFlattenedCategories = () => {
        const childMap = {};
        const roots = [];

        // Build parent-child map
        categories.forEach(cat => {
            const parentId = cat.parent || 'root';
            if (!childMap[parentId]) {
                childMap[parentId] = [];
            }
            childMap[parentId].push(cat);
        });

        // Recursive function to flatten with indentation
        const flatten = (parentId, level = 0, result = []) => {
            const children = childMap[parentId] || [];
            children.forEach(cat => {
                result.push({
                    ...cat,
                    level,
                    displayName: '—'.repeat(level) + (level > 0 ? ' ' : '') + cat.name
                });
                flatten(cat._id, level + 1, result);
            });
            return result;
        };

        return flatten('root');
    };

    useEffect(() => {
        if (product) {
            // Handle both old and new data structures
            const variants = product.variants && product.variants.length > 0
                ? product.variants
                : [{
                    unit: product.unit || '',
                    quantity: 1,
                    price: product.price || '',
                    discount: product.discount || 0,
                    stock: product.stock || '',
                    minOrderQuantity: 1,
                    maxOrderQuantity: 10,
                }];

            setFormData({
                name: product.name,
                description: product.description,
                category: product.category,
                images: (product.images || []).map(img =>
                    typeof img === 'string' ? { url: img, isMain: false, sortOrder: 0, isActive: true } : img
                ),
                variants: variants,
                isActive: product.isActive !== undefined ? product.isActive : true,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await productService.uploadImage(file);
            setFormData(prev => {
                const newImage = {
                    url: response.url,
                    isMain: prev.images.length === 0,
                    sortOrder: prev.images.length,
                    isActive: true
                };
                return {
                    ...prev,
                    images: [...prev.images, newImage]
                };
            });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        const removedImage = formData.images[index];
        const newImages = formData.images.filter((_, i) => i !== index);

        // If we removed the main image, set the first remaining one as main
        if (removedImage.isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }

        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...formData.images];
        if (field === 'isMain') {
            // Radio button behavior: only one can be main
            newImages.forEach((img, i) => {
                img.isMain = i === index;
            });
        } else {
            newImages[index][field] = value;
        }
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (product) {
                await productService.updateProduct(product._id, formData);
            } else {
                await productService.createProduct(formData);
            }
            onSave();
        } catch (error) {
            console.error('Save failed:', error);
            const message = error.response?.data?.message || 'Failed to save product';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const resetUnitForm = () => {
        setUnitForm({ name: '', convention: '' });
        setEditingUnitId(null);
    };

    const handleSaveUnit = async () => {
        if (!unitForm.name.trim()) return;
        try {
            setUnitLoading(true);
            let response;
            if (editingUnitId) {
                response = await unitService.updateUnit(editingUnitId, unitForm);
            } else {
                response = await unitService.createUnit(unitForm);
            }

            if (response.success) {
                const updatedUnit = response.unit;

                // If editing, check if name changed and update references in variants
                if (editingUnitId) {
                    const oldUnit = units.find(u => u._id === editingUnitId);
                    if (oldUnit && oldUnit.name !== updatedUnit.name) {
                        setFormData(prev => ({
                            ...prev,
                            variants: prev.variants.map(v =>
                                v.unit === oldUnit.name ? { ...v, unit: updatedUnit.name } : v
                            )
                        }));
                    }
                }

                setUnits(prev => {
                    let newUnits;
                    if (editingUnitId) {
                        newUnits = prev.map(u => u._id === updatedUnit._id ? updatedUnit : u);
                    } else {
                        newUnits = [...prev, updatedUnit];
                    }
                    return newUnits.sort((a, b) => a.name.localeCompare(b.name));
                });

                // If we created a new unit, select it for the first variant if it's empty
                if (!editingUnitId) {
                    setFormData(prev => {
                        // Optional: Auto-select new unit for variants with empty unit? 
                        // For now just keep existing behavior or helpful auto-select
                        return prev;
                    });
                }

                resetUnitForm();
            }
        } catch (error) {
            console.error('Save unit failed:', error);
            alert(error.response?.data?.message || 'Failed to save unit');
        } finally {
            setUnitLoading(false);
        }
    };

    const handleEditUnitClick = (unit) => {
        setUnitForm({ name: unit.name, convention: unit.convention || '' });
        setEditingUnitId(unit._id);
    };

    const handleDeleteUnit = async (id) => {
        if (!window.confirm('Are you sure you want to delete this unit?')) return;
        try {
            setUnitLoading(true);
            const deletedUnit = units.find(u => u._id === id);
            await unitService.deleteUnit(id);
            setUnits(prev => prev.filter(u => u._id !== id));

            // Clear unit from variants if it was the one deleted
            if (deletedUnit) {
                setFormData(prev => ({
                    ...prev,
                    variants: prev.variants.map(v =>
                        v.unit === deletedUnit.name ? { ...v, unit: '' } : v
                    )
                }));
            }

            if (editingUnitId === id) {
                resetUnitForm();
            }

        } catch (error) {
            console.error('Delete unit failed:', error);
            alert(error.response?.data?.message || 'Failed to delete unit');
        } finally {
            setUnitLoading(false);
        }
    };

    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                unit: units.length > 0 ? units[0].name : '',
                quantity: 1,
                price: '',
                discount: 0,
                stock: '',
                minOrderQuantity: 1,
                maxOrderQuantity: 10,
            }]
        }));
    };

    const handleRemoveVariant = (index) => {
        if (formData.variants.length <= 1) {
            alert('At least one variant is required');
            return;
        }
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const SectionHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            {React.cloneElement(icon, { sx: { color: COLORS.PRIMARY } })}
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
        </Box>
    );

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: 'auto' }}>
            <Grid container spacing={4}>
                {/* Full Width: Basic Information */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<Description />} title="Basic Information" />
                            <Grid container spacing={2.5} columns={{ xs: 12, lg: 12 }} direction={{ xs: 'column', lg: 'column' }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Product Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        placeholder="e.g. Premium Agarbatti"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: '#fafafa',
                                                '&:hover fieldset': { borderColor: COLORS.PRIMARY },
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: '#fafafa',
                                            }
                                        }}
                                    >
                                        {categories.length === 0 ? (
                                            <MenuItem disabled value=""><em>No categories available</em></MenuItem>
                                        ) : (
                                            getFlattenedCategories().map(cat => (
                                                <MenuItem
                                                    key={cat._id}
                                                    value={cat.name}
                                                    sx={{
                                                        pl: 2 + (cat.level * 2),
                                                        fontWeight: cat.level === 0 ? 600 : 400,
                                                        color: cat.level === 0 ? '#333' : '#666'
                                                    }}
                                                >
                                                    {cat.displayName}
                                                </MenuItem>
                                            ))
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter detailed product description..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: '#fafafa',
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Left Column: Pricing */}
                <Grid item xs={12} md={7}>
                    <Grid container spacing={3}>
                        {/* Pricing & Inventory - Variants */}
                        <Grid item xs={12}>
                            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <SectionHeader icon={<CurrencyRupee />} title="Pricing & Inventory" />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddVariant}
                                            sx={{
                                                borderColor: COLORS.PRIMARY,
                                                color: COLORS.PRIMARY,
                                                '&:hover': { borderColor: COLORS.PRIMARY, bgcolor: 'rgba(13, 110, 253, 0.04)' }
                                            }}
                                        >
                                            Add more product variant
                                        </Button>
                                    </Box>

                                    {formData.variants.map((variant, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                mb: 3,
                                                p: 2.5,
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 2,
                                                bgcolor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                                                position: 'relative'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                    Variant {index + 1}
                                                </Typography>
                                                {formData.variants.length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveVariant(index)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <Grid container spacing={2}>
                                                {/* Unit Dropdown */}
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                                            Unit
                                                        </Typography>
                                                        {index === 0 && (
                                                            <Link
                                                                component="button"
                                                                type="button"
                                                                variant="caption"
                                                                onClick={() => setUnitDialogOpen(true)}
                                                                sx={{
                                                                    color: COLORS.PRIMARY,
                                                                    textDecoration: 'none',
                                                                    fontSize: '0.75rem',
                                                                    '&:hover': { textDecoration: 'underline' }
                                                                }}
                                                            >
                                                                + Manage units
                                                            </Link>
                                                        )}
                                                    </Box>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        size="small"
                                                        value={variant.unit}
                                                        onChange={(e) => handleVariantChange(index, 'unit', e.target.value)}
                                                        required
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    >
                                                        {units.map((u) => (
                                                            <MenuItem key={u._id} value={u.name}>
                                                                {u.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>

                                                {/* Quantity */}
                                                <Grid item xs={12} md={2}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Quantity
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.quantity}
                                                        onChange={(e) => handleVariantChange(index, 'quantity', Number(e.target.value))}
                                                        required
                                                        placeholder="e.g., 6"
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>

                                                {/* Price */}
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Price
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                        required
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>

                                                {/* Discount */}
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Discount
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.discount}
                                                        onChange={(e) => handleVariantChange(index, 'discount', Number(e.target.value))}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>

                                                {/* Stock */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Stock
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                        required
                                                        placeholder="0"
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>

                                                {/* Min Order Quantity */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Min Cart Qty
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.minOrderQuantity}
                                                        onChange={(e) => handleVariantChange(index, 'minOrderQuantity', Number(e.target.value))}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>

                                                {/* Max Order Quantity */}
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                                        Max Cart Qty
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        size="small"
                                                        value={variant.maxOrderQuantity}
                                                        onChange={(e) => handleVariantChange(index, 'maxOrderQuantity', Number(e.target.value))}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: 'white' } }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<PhotoLibrary />} title="Product Media" />
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Add up to 5 images. Manage visibility, order, and set the main hero image.
                            </Typography>

                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2, mb: 3 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: '#fafafa' }}>
                                        <TableRow>
                                            <TableCell width={80}>Image</TableCell>
                                            <TableCell>Settings</TableCell>
                                            <TableCell align="center" width={100}>Main</TableCell>
                                            <TableCell align="center" width={100}>Order</TableCell>
                                            <TableCell align="center" width={100}>Active</TableCell>
                                            <TableCell align="center" width={60}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formData.images.map((img, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            borderRadius: 1,
                                                            overflow: 'hidden',
                                                            border: '1px solid #eee'
                                                        }}
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt="product"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all' }}>
                                                        {img.url.split('/').pop()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Radio
                                                        checked={img.isMain}
                                                        onChange={() => handleImageChange(index, 'isMain', true)}
                                                        size="small"
                                                        sx={{ color: COLORS.PRIMARY, '&.Mui-checked': { color: COLORS.PRIMARY } }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        variant="standard"
                                                        value={img.sortOrder}
                                                        onChange={(e) => handleImageChange(index, 'sortOrder', parseInt(e.target.value) || 0)}
                                                        inputProps={{ style: { textAlign: 'center' } }}
                                                        sx={{ width: 40 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Switch
                                                        checked={img.isActive}
                                                        onChange={(e) => handleImageChange(index, 'isActive', e.target.checked)}
                                                        size="small"
                                                        sx={{
                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY },
                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: COLORS.PRIMARY }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" color="error" onClick={() => handleRemoveImage(index)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {formData.images.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                    No images uploaded yet
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {formData.images.length < 5 && (
                                <Box>
                                    {uploading ? (
                                        <Box sx={{
                                            width: '100%',
                                            height: 80,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px dashed #ccc',
                                            borderRadius: 2
                                        }}>
                                            <CircularProgress size={24} sx={{ color: COLORS.PRIMARY }} />
                                            <Typography variant="body2" sx={{ ml: 2 }}>Uploading...</Typography>
                                        </Box>
                                    ) : (
                                        <Button
                                            component="label"
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<UploadIcon />}
                                            sx={{
                                                height: 50,
                                                borderStyle: 'dashed',
                                                borderWidth: 1.5,
                                                borderRadius: 2,
                                                color: 'text.secondary',
                                                '&:hover': { borderWidth: 1.5, borderColor: COLORS.PRIMARY, bgcolor: 'rgba(0,0,0,0.02)' }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: '600' }}>
                                                Add More Product Images
                                            </Typography>
                                            <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Visibility sx={{ color: COLORS.PRIMARY }} />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Product Visibility
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Control whether this product is visible to customers in the store.
                                    </Typography>
                                </Box>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.PRIMARY },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: COLORS.PRIMARY }
                                        }}
                                    />
                                }
                                label={formData.isActive ? "Visible" : "Hidden"}
                                labelPlacement="start"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={onCancel}
                            sx={{ borderRadius: 2, px: 4 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            size="large"
                            disabled={loading || uploading}
                            sx={{
                                bgcolor: COLORS.PRIMARY,
                                borderRadius: 2,
                                px: 4,
                                height: 48,
                                '&:hover': { bgcolor: '#0A6B18' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : (product ? 'Update Product' : 'Publish Product')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Manage Units Dialog */}
            <Dialog open={unitDialogOpen} onClose={() => setUnitDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Manage Units</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Add, update, or delete units. Set the convention (e.g., 'g' for Gram) for better display.
                    </Typography>

                    {/* Add/Edit Form */}
                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            {editingUnitId ? 'Edit Unit' : 'Add New Unit'}
                        </Typography>
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Unit Name"
                                    placeholder="e.g. Gram"
                                    value={unitForm.name}
                                    onChange={(e) => setUnitForm(prev => ({ ...prev, name: e.target.value }))}
                                    variant="outlined"
                                    sx={{ bgcolor: 'white' }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Convention"
                                    placeholder="e.g. g"
                                    value={unitForm.convention}
                                    onChange={(e) => setUnitForm(prev => ({ ...prev, convention: e.target.value }))}
                                    variant="outlined"
                                    sx={{ bgcolor: 'white' }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleSaveUnit}
                                        disabled={unitLoading || !unitForm.name.trim()}
                                        sx={{ bgcolor: COLORS.PRIMARY, height: 40 }}
                                    >
                                        {editingUnitId ? 'Update' : 'Add'}
                                    </Button>
                                    {editingUnitId && (
                                        <Button
                                            variant="outlined"
                                            onClick={resetUnitForm}
                                            sx={{ height: 40, minWidth: 40, px: 1 }}
                                        >
                                            X
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Unit List */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', maxHeight: 300 }}>
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Convention</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {units.map((unit) => (
                                    <TableRow key={unit._id} hover selected={editingUnitId === unit._id}>
                                        <TableCell>{unit.name}</TableCell>
                                        <TableCell>{unit.convention || '-'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditUnitClick(unit)}
                                                disabled={unitLoading}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteUnit(unit._id)}
                                                disabled={unitLoading}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {units.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            No units found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setUnitDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductForm;
