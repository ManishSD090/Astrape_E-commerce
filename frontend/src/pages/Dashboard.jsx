import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, X, Search, ShoppingCart, User, LogOut, LoaderCircle, AlertTriangle } from 'lucide-react';
import { getProducts, getCart, addToCart } from '../api'; 
import { AuthContext } from '../context/AuthContext'; 

const categories = ["Electronics", "Food & Beverages", "Furniture", "Sports", "Fashion", "Kitchen", "Health & Beauty", "Accessories", "Home Decor", "Books"];
const brands = [
    // Technology & Electronics
    "Apple",
    "Google",
    "Microsoft",
    "Amazon",
    "Samsung",
    "Sony",
    "Netflix",
    "Nike",
    "Adidas",
    "Levi's",
    "Zara",
    "Toyota",
    "Tesla",
    "Mercedes-Benz",
    "Tata Motors",
    "Coca-Cola",
    "McDonald's",
    "Starbucks",
    "Amul",
    "Visa",
    "Reliance",
    "Disney", 
    "Other"
];
//================================================================================
// 1. Dashboard Navbar Component
//================================================================================
const DashboardNavbar = ({ searchTerm, setSearchTerm, cartItemCount, user, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-[#048399]">ASTRAPE</h1>
          </div>
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048399] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className="relative text-gray-600 hover:text-[#048399] transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-600 hover:text-[#048399] transition-colors"
                aria-label="User Menu"
              >
                <User className="h-6 w-6" />
              </button>
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br/>
                    <span className="font-medium">{user?.username || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden pt-2 pb-4">
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               placeholder="Search products..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#048399] focus:border-transparent"
             />
           </div>
        </div>
      </div>
    </nav>
  );
};

//================================================================================
// 2. Sidebar Component
//================================================================================
const Sidebar = ({ isOpen, onClose, filters, setFilters, maxPrice, isMobile = false }) => {
  const handleCategoryChange = (category) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters(prev => ({ ...prev, categories: updatedCategories }));
  };

  const handleBrandChange = (brand) => {
    const updatedBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters(prev => ({ ...prev, brands: updatedBrands }));
  };

  const handlePriceChange = (value) => {
      const newMax = parseInt(value, 10);
      if (newMax >= filters.priceRange[0]) {
        setFilters(prev => ({...prev, priceRange: [prev.priceRange[0], newMax]}));
      }
  };
  
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      minRating: 0
    });
  };

  const sidebarContent = (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        {isMobile && (
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
            style={{
              background: `linear-gradient(to right, #048399 0%, #048399 ${ (filters.priceRange[1] / maxPrice) * 100}%, #e5e7eb ${ (filters.priceRange[1] / maxPrice) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{0}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-[#048399] focus:ring-[#048399] focus:ring-offset-0 focus:ring-1"
              />
              <span className="ml-3 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Brands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
              {/* Ensure this is mapping the static 'brands' array from the top */}
              {brands.map((brand) => (
                  <label key={brand} className="flex items-center cursor-pointer">
                      <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="rounded border-gray-300 text-[#048399] focus:ring-[#048399] focus:ring-offset-0 focus:ring-1"
                      />
                      <span className="ml-3 text-sm text-gray-700">{brand}</span>
                  </label>
              ))}
          </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={clearAllFilters}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <div className={`fixed top-0 left-0 h-full w-80 shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
        </div>
      </>
    );
  }
  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen sticky top-16">
      {sidebarContent}
    </aside>
  );
};

//================================================================================
// 3. Product Card Component (Updated for Numeric Rating & Fallback Image)
//================================================================================
const ProductCard = ({ product, viewMode = 'grid', addToCart }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const price = product.price ?? 0;
  const image = product.image ?? 'https://via.placeholder.com/300';
  const name = product.name ?? 'Unnamed Product';
  const rating = product.rating ?? (Math.random() * 2 + 3); // Random 3-5
  const reviews = product.reviews ?? Math.floor(Math.random() * 50 + 1);
  const discount = product.originalPrice ? product.originalPrice - price : null;

  return viewMode === 'grid' ? (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="aspect-square overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 flex-grow">{name}</h3>
        <div className="text-sm text-gray-500 mb-3">Rating: {rating.toFixed(1)}/5 ({reviews} reviews)</div>
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">{formatCurrency(price)}</span>
            {product.originalPrice && <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>}
          </div>
          {discount && <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">{Math.round((discount / product.originalPrice) * 100)}% OFF</span>}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-auto bg-[#048399] text-white py-2 px-4 rounded-lg hover:bg-[#036d80] transition-colors duration-200 flex items-center justify-center space-x-2 active:scale-95 transform"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col sm:flex-row w-full">
      <div className="w-full sm:w-48 md:w-56 flex-shrink-0">
        <img src={image} alt={name} className="w-full h-48 sm:h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand ?? ''}</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{name}</h3>
          <div className="text-sm text-gray-500 mb-3">Rating: {rating.toFixed(1)}/5 ({reviews} reviews)</div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-4">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
              {product.originalPrice && <span className="text-base text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>}
            </div>
            {discount && <span className="text-sm font-semibold text-green-800">You save {formatCurrency(discount)}</span>}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full sm:w-auto bg-[#048399] text-white py-2 px-5 rounded-lg hover:bg-[#036d80] transition-colors duration-200 flex items-center justify-center space-x-2 active:scale-95 transform"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

//================================================================================
// 4. Main Dashboard Component
//================================================================================
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [toastMessage, setToastMessage] = useState('');

  const maxPrice = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return 50000;
    const max = products.reduce((acc, p) => (typeof p.price === 'number' && p.price > acc ? p.price : acc), 0);
    return Math.ceil(max / 1000) * 1000 || 50000;
  }, [products]);

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, maxPrice],
    minRating: 0
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
  }, [maxPrice]);

useEffect(() => {
  const fetchInitialData = async () => {
    setLoading(true); 
    setError(null);

    try {
      const productsResponse = await getProducts(); // Axios GET /api/items
      const productsData = Array.isArray(productsResponse?.data) ? productsResponse.data : [];

      // Map backend fields to frontend expected fields
      const mappedProducts = productsData.map(p => ({
        _id: p._id,
        name: p.name ?? 'Unnamed Product',
        brand: p.brand ?? 'Other',
        category: p.category ?? 'Other',
        price: p.price ?? 0,
        image: p.imageUrl ?? 'https://via.placeholder.com/300',
        rating: p.rating ?? (Math.random() * 2 + 3),
        description: p.description ?? '',
        stock: p.stock ?? 0
      }));

      setProducts(mappedProducts);

      // Fetch cart items
      try {
        const cartResponse = await getCart();
        const cartItems = Array.isArray(cartResponse?.data?.items) ? cartResponse.data.items : [];
        setCartItemCount(cartItems.length);
      } catch (cartErr) {
        console.error("Cart fetch failed:", cartErr);
        setCartItemCount(0);
      }

    } catch (err) {
      console.error("Products fetch failed:", err);
      setError("Could not load products. Please try again later.");
    } finally { 
      setLoading(false); 
    }
  };

  fetchInitialData();
}, []);

const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    // Create a list of all your primary, known brands for the check
    const knownBrands = brands.filter(b => b !== 'Other');

    return products.filter(product => {
        if (!product || typeof product !== 'object') return false;
        const name = product.name ?? '';
        const brand = product.brand ?? '';
        const category = product.category ?? '';
        const price = product.price ?? 0;
        const rating = product.rating || (Math.random() * 2 + 3);

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategories = filters.categories.length === 0 || filters.categories.includes(category);
        const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
        const matchesRating = rating >= filters.minRating;
        const matchesBrands = filters.brands.length === 0 || filters.brands.some(selectedBrand => {
            if (selectedBrand === 'Other') {
                return brand && !knownBrands.includes(brand);
            }
            return brand === selectedBrand;
        });
        return matchesSearch && matchesCategories && matchesBrands && matchesPrice && matchesRating;
    });
}, [products, searchTerm, filters]);

  const showToast = (message) => {
    setToastMessage(''); setTimeout(() => setToastMessage(message), 100); setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCartHandler = async (product) => {
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      setCartItemCount(prev => prev + 1);
      showToast(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Add to cart failed:', err);
      showToast('Failed to add item to cart');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({ categories: [], brands: [], priceRange: [0, maxPrice], minRating: 0 });
  };

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-96"><LoaderCircle className="animate-spin h-12 w-12 text-[#048399]" /></div>;
    if (error) return <div className="text-center py-12"><div className="max-w-md mx-auto"><AlertTriangle className="text-6xl text-red-400 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3><p className="text-gray-500">{error}</p></div></div>;
    if (filteredProducts.length > 0) return <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>{filteredProducts.map(product => <ProductCard key={product._id || product.id} product={product} viewMode={viewMode} addToCart={addToCartHandler} />)}</div>;
    return <div className="text-center py-12"><div className="max-w-md mx-auto"><div className="text-6xl text-gray-300 mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3><p className="text-gray-500">Try adjusting your search criteria or filters to find what you're looking for.</p><button onClick={resetFilters} className="mt-4 bg-[#048399] text-white px-6 py-2 rounded-lg hover:bg-[#036d80] transition-colors duration-200">Clear All Filters</button></div></div>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItemCount={cartItemCount} user={user} logout={logout} />
      <div className="flex">
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar filters={filters} setFilters={setFilters} maxPrice={maxPrice} isMobile={false} />
        </div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} filters={filters} setFilters={setFilters} maxPrice={maxPrice} isMobile={true} />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden bg-[#048399] text-white px-4 py-2 rounded-lg hover:bg-[#036d80] transition-colors duration-200 flex items-center space-x-2"><Filter className="h-4 w-4" /><span>Filters</span></button>
            <div className="flex items-center space-x-4 ml-auto">
              {!loading && !error && <span className="text-gray-600 text-sm lg:text-base">{filteredProducts.length} products found</span>}
              <div className="flex items-center space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-[#048399] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}><Grid className="h-4 w-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-[#048399] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          {renderContent()}
        </main>
      </div>
      {toastMessage && <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-5 rounded-lg shadow-lg flex items-center animate-fade-in-out"><p>{toastMessage}</p></div>}
    </div>
  );
};

export default Dashboard;
