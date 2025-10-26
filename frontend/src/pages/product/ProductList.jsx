import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Corrected import
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, CircularProgress, FormControl,
    InputLabel, Select, MenuItem, useTheme, useMediaQuery, Alert, Container // Added Container
} from '@mui/material';

// A modern, reusable Product Card component with enhanced styling
const ProductCard = ({ product }) => (
    <Paper
        elevation={0}
        variant="outlined"
        component={Link}
        to={`/product/${product._id}`}
        sx={{
            textDecoration: 'none',
            display: 'block',
            overflow: 'hidden',
            position: 'relative',
            height: '100%', // Ensure card takes full height of grid item
            borderRadius: 2, // Softer corners
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 4px 20px ${theme.palette.action.hover}`,
            },
            '&:hover .product-image': {
                transform: 'scale(1.05)',
            },
        }}
    >
        <Box
            className="product-image"
            sx={{
                width: '100%',
                paddingTop: '125%', // Aspect ratio for a taller, modern look
                backgroundImage: `url(${product.images[0]?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.4s ease',
            }}
        />
        <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>{product.brand?.name || 'Brand'}</Typography>
            <Typography variant="subtitle1" component="h3" noWrap className="product-title" sx={{ fontWeight: 600 }}>
                {product.name}
            </Typography>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, mt: 1 }}>
                ₹{product.price.toLocaleString()}
            </Typography>
        </Box>
    </Paper>
);

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [_brands, setBrands] = useState([]); // Variable name changed to avoid shadowing
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Parse filters from URL query parameters for shareable links
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [filters, setFilters] = useState({
        category: queryParams.get('category') || '',
        brand: queryParams.get('brand') || '',
        sort: queryParams.get('sort') || 'name-asc',
    });

    // Fetch categories and brands for the filter dropdowns just once
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axiosInstance.get('/api/v1/categories'),
                    axiosInstance.get('/api/v1/brands'),
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) { // Capture specific error
                console.error("Error fetching filter options:", err);
                setError('Failed to load filter options.');
            }
        };
        fetchFilterOptions();
    }, []);

    // Fetch products whenever filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(''); // Clear previous errors
            try {
                const { data } = await axiosInstance.get('/api/v1/product', {
                    params: {
                        category: filters.category,
                        brand: filters.brand,
                        sort: filters.sort,
                        limit: 100, // Fetch a larger number of products to group them effectively
                    },
                });
                setProducts(data.products);
            } catch (err) { // Capture specific error
                console.error("Error fetching products:", err);
                setError(err.response?.data?.message || "Failed to fetch products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();

        // Update the URL with the current filters without reloading the page
        const newSearch = new URLSearchParams();
        if(filters.category) newSearch.set('category', filters.category);
        if(filters.brand) newSearch.set('brand', filters.brand);
        if(filters.sort) newSearch.set('sort', filters.sort);
        // Only navigate if search params actually change to prevent loops
        if (location.search !== `?${newSearch.toString()}`) {
            navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
        }

    // Include location.search in dependencies if needed, carefully
    }, [filters, navigate, location.pathname, location.search]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Group products by their category name for organized display
    const groupedProducts = useMemo(() => {
        if (filters.category) {
            // If filtering by a specific category, don't group further
            const categoryName = categories.find(c => c._id === filters.category)?.name || 'Filtered Results';
            return { [categoryName]: products };
        }
        // Otherwise, group all products by their category
        return products.reduce((acc, product) => {
            // Defensive check for product and category
            const categoryName = product?.category?.name || 'Other';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            // Ensure product is valid before pushing
            if (product?._id) {
                acc[categoryName].push(product);
            }
            return acc;
        }, {});
    }, [products, filters.category, categories]);

    return (
        // Use Container for responsive max-width and centering
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
            {/* Header and Filters Section */}
            <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Products
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}> {/* Adjusted grid sizes */}
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Category</InputLabel>
                            <Select name="category" value={filters.category} label="Category" onChange={handleFilterChange}>
                                <MenuItem value=""><em>All Categories</em></MenuItem>
                                {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}> {/* Adjusted grid sizes */}
                         <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select name="sort" value={filters.sort} label="Sort By" onChange={handleFilterChange}>
                                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                                <MenuItem value="price-asc">Price (Low to High)</MenuItem>
                                <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                                {/* Consider adding 'createdAt-desc' for Newest */}
                            </Select>
                        </FormControl>
                    </Grid>
                     {/* Placeholder for potential Brand filter */}
                     {/* <Grid item xs={12} sm={6} md={4}> ... Brand Filter ... </Grid> */}
                </Grid>
            </Paper>

            {/* Product Display Section */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
            ) : products.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6">No Products Found</Typography>
                    <Typography color="text.secondary">Try adjusting your filters to find what you're looking for.</Typography>
                </Paper>
            ) : (
                Object.keys(groupedProducts).map(categoryName => (
                    <Box key={categoryName} sx={{ mb: 5 }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid', borderColor: 'divider', pb: 1, mb: 3 }}>
                            {categoryName}
                        </Typography>
                        {/* Ensure Grid container takes full width */}
                        <Grid container spacing={isMobile ? 2 : 3} sx={{ width: '100%' }}>
                            {groupedProducts[categoryName].map((product) => (
                                // --- STYLE FIX: Added xl breakpoint ---
                                <Grid item key={product._id} xs={6} sm={6} md={4} lg={3} xl={2.4}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))
            )}
        </Container>
    );
};

export default ProductList;