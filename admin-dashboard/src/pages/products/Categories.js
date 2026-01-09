import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    TextField,
    IconButton,
    CircularProgress,
    Switch,
    Collapse,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    ChevronRight as ChevronRightIcon,
    Folder as FolderIcon,
    Upload as UploadIcon,
} from '@mui/icons-material';
import categoryService from '../../services/categoryService';
import uploadService from '../../services/uploadService';
import { COLORS } from '../../utils/constants';

// Recursive Category Tree Component
const CategoryTreeItem = ({ category, selectedId, onSelect, level = 0, childMap }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = childMap[category._id] && childMap[category._id].length > 0;
    const isSelected = selectedId === category._id;

    const handleToggle = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        onSelect(category);
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Connection Line for Children */}
            {level > 0 && (
                <>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: -24,
                            width: 24,
                            height: 28,
                            borderBottom: '2px solid #d0d0d0',
                            borderLeft: '2px solid #d0d0d0',
                            borderBottomLeftRadius: 8,
                            zIndex: 0
                        }}
                    />
                </>
            )}

            <Box
                onClick={handleSelect}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    mb: 1,
                    ml: level * 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: isSelected ? '#4caf50' : '#f5f5f5',
                    color: isSelected ? '#fff' : '#333',
                    transition: 'all 0.2s',
                    position: 'relative',
                    zIndex: 1,
                    '&:hover': {
                        bgcolor: isSelected ? '#43a047' : '#eeeeee',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon fontSize="small" sx={{ color: isSelected ? '#fff' : '#666' }} />
                    <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 500 }}>
                        {category.name}
                    </Typography>
                </Box>

                {hasChildren && (
                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{ color: isSelected ? '#fff' : '#666', p: 0.5 }}
                    >
                        {expanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                    </IconButton>
                )}
            </Box>

            <Collapse in={expanded}>
                {hasChildren && childMap[category._id].map((child) => (
                    <CategoryTreeItem
                        key={child._id}
                        category={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        level={level + 1}
                        childMap={childMap}
                    />
                ))}
            </Collapse>
        </Box>
    );
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [mode, setMode] = useState('add_root');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        isActive: true,
        parent: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getCategories();
            if (data.categories) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChildMap = () => {
        const map = {};
        map['root'] = [];

        categories.forEach(cat => {
            const parentId = cat.parent || 'root';
            if (!map[parentId]) {
                map[parentId] = [];
            }
            map[parentId].push(cat);
        });
        return map;
    };

    const childMap = getChildMap();

    const getFilteredCategories = () => {
        if (!searchQuery) return childMap['root'] || [];
        return (childMap['root'] || []).filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setMode('edit');
        setFormData({
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isActive: category.isActive,
            parent: category.parent
        });
    };

    const handleAddRoot = () => {
        setSelectedCategory(null);
        setMode('add_root');
        setFormData({
            name: '',
            description: '',
            image: '',
            isActive: true,
            parent: null
        });
    };

    const handleAddChild = () => {
        if (!selectedCategory) {
            alert("Please select a parent category first");
            return;
        }
        setMode('add_child');
        setFormData({
            name: '',
            description: '',
            image: '',
            isActive: true,
            parent: selectedCategory._id
        });
    };

    const handleDelete = async () => {
        if (!selectedCategory) return;
        if (window.confirm(`Are you sure you want to delete ${selectedCategory.name}?`)) {
            try {
                await categoryService.deleteCategory(selectedCategory._id);
                fetchCategories();
                handleAddRoot();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete category");
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await uploadService.uploadImage(file);
            setFormData(prev => ({ ...prev, image: res.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                parent: formData.parent || null
            };

            if (mode === 'edit' && selectedCategory) {
                await categoryService.updateCategory(selectedCategory._id, dataToSend);
            } else {
                await categoryService.createCategory(dataToSend);
            }
            fetchCategories();
            handleAddRoot();
            alert("Saved successfully!");
        } catch (error) {
            console.error("Save failed", error);
            alert(error.response?.data?.message || "Failed to save");
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
                All Categories
            </Typography>

            <Grid container spacing={4}>
                {/* Left Side: Tree */}
                <Grid item xs={12} md={5}>
                    {/* Black Header for Buttons */}
                    <Box sx={{
                        bgcolor: '#2c2c2c',
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        alignItems: 'center'
                    }}>
                        <Button
                            fullWidth
                            onClick={handleAddRoot}
                            sx={{
                                bgcolor: '#fff',
                                color: '#4caf50',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                py: 1,
                                fontSize: '0.9rem',
                                border: 'none',
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                        >
                            Add Root Category +
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleAddChild}
                            disabled={!selectedCategory}
                            sx={{
                                bgcolor: '#fff',
                                color: '#333',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                py: 1,
                                fontSize: '0.9rem',
                                '&:hover': { bgcolor: '#f5f5f5' },
                                '&:disabled': { bgcolor: '#e0e0e0', color: '#999' }
                            }}
                        >
                            Add Child +
                        </Button>
                        <IconButton
                            sx={{
                                bgcolor: '#424242',
                                color: '#fff',
                                borderRadius: 1,
                                px: 1.5,
                                '&:hover': { bgcolor: '#616161' },
                                '&:disabled': { bgcolor: '#424242', color: '#757575', opacity: 0.5 }
                            }}
                            onClick={handleDelete}
                            disabled={!selectedCategory}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <TextField
                        placeholder="Search"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#fff',
                                borderRadius: 1,
                                '& fieldset': { borderColor: '#e0e0e0' }
                            }
                        }}
                    />

                    <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.85rem' }}>
                        Expand All
                    </Typography>

                    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, minHeight: '500px' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            getFilteredCategories().map(cat => (
                                <CategoryTreeItem
                                    key={cat._id}
                                    category={cat}
                                    selectedId={selectedCategory?._id}
                                    onSelect={handleSelectCategory}
                                    childMap={childMap}
                                />
                            ))
                        )}
                        {!loading && getFilteredCategories().length === 0 && (
                            <Typography variant="body2" sx={{ p: 4, textAlign: 'center', color: '#999' }}>
                                No categories found
                            </Typography>
                        )}
                    </Box>
                </Grid>

                {/* Right Side: Form */}
                <Grid item xs={12} md={7}>
                    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            {/* Image Upload */}
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                                Thumbnail * <span style={{ fontWeight: 'normal', color: '#999' }}>(Ratio 1280 x 960 px)</span>
                            </Typography>
                            <Box
                                sx={{
                                    width: 200,
                                    height: 200,
                                    bgcolor: '#fafafa',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #d0d0d0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    mb: 4,
                                    '&:hover': { borderColor: '#4caf50' }
                                }}
                                onClick={() => document.getElementById('cat-image-upload').click()}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <UploadIcon sx={{ fontSize: 48, color: '#b0b0b0' }} />
                                )}
                                {uploading && (
                                    <CircularProgress size={24} sx={{ position: 'absolute' }} />
                                )}
                            </Box>
                            <input
                                id="cat-image-upload"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                                Name *
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                variant="outlined"
                                size="small"
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                        bgcolor: '#fff',
                                        '& fieldset': { borderColor: '#e0e0e0' }
                                    }
                                }}
                            />

                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                variant="outlined"
                                size="small"
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                        bgcolor: '#fff',
                                        '& fieldset': { borderColor: '#e0e0e0' }
                                    }
                                }}
                            />

                            <Box sx={{
                                bgcolor: '#fafafa',
                                p: 2,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 4,
                                border: '1px solid #e0e0e0'
                            }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                                    Is Active
                                </Typography>
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#4caf50',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#4caf50',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        if (mode === 'edit') handleSelectCategory(selectedCategory);
                                        else handleAddRoot();
                                    }}
                                    sx={{
                                        bgcolor: '#ffebee',
                                        color: '#d32f2f',
                                        boxShadow: 'none',
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#ffcdd2', boxShadow: 'none' }
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={uploading}
                                    sx={{
                                        bgcolor: '#4caf50',
                                        color: '#fff',
                                        boxShadow: 'none',
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#43a047', boxShadow: 'none' }
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Categories;
