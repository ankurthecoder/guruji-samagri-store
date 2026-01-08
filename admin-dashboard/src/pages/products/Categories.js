import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import categoryService from '../../services/categoryService';
import { COLORS } from '../../utils/constants';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getCategories();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory._id, formData);
            } else {
                await categoryService.createCategory(formData);
            }
            fetchCategories();
            handleClose();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error deleting category');
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.PRIMARY }}>
                    Category Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{ bgcolor: COLORS.PRIMARY }}
                >
                    Add Category
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category._id}>
                            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CategoryIcon sx={{ color: COLORS.PRIMARY }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {category.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton size="small" onClick={() => handleOpen(category)}>
                                                <EditIcon fontSize="small" color="primary" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(category._id)}>
                                                <DeleteIcon fontSize="small" color="error" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, height: 40, overflow: 'hidden' }}>
                                        {category.description || 'No description provided.'}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={category.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={category.isActive ? 'success' : 'default'}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {categories.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center" color="text.secondary">
                                No categories found. Add your first category!
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: COLORS.PRIMARY }}>
                            Save
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default Categories;
