import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Package
} from 'lucide-react';
import { getCart, updateCartQuantity, removeFromCart } from '../api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await getCart();
        // Ensure quantity is a number
        const items = data.items.map(item => ({ ...item, quantity: Number(item.quantity) || 1 }));
        setCartItems(items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  
  // --- Cart Actions ---
  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await updateCartQuantity(productId, quantity);
      const items = data.items.map(item => ({ ...item, quantity: Number(item.quantity) || 1 }));
      setCartItems(items || []);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const { data } = await removeFromCart(productId);
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };
  
  // --- Calculations ---
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 10000 ? 0 : 199;
  const total = subtotal + tax + shipping;

  // --- Navigation ---
  const handleContinueShopping = () => navigate("/dashboard");
  const handleCheckout = () => {
      // In a real app, this would navigate to a checkout page
      alert('Proceeding to checkout!');
      console.log('Proceed to checkout with:', { cartItems, total });
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  // --- Render Logic ---
  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 animate-bounce mx-auto mb-4" />
                <p className="text-lg text-gray-600">Loading your cart...</p>
            </div>
        </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={handleContinueShopping}
              className="flex items-center text-[#048399] hover:text-[#036d80] transition-colors duration-200 mb-4 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any items yet. Start shopping to fill it up!
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#048399] text-white px-8 py-3 rounded-lg hover:bg-[#036d80] transition-colors duration-200 font-medium"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={handleContinueShopping}
            className="flex items-center text-[#048399] hover:text-[#036d80] transition-colors duration-200 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart ({cartItems.length} items)</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item.productId} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Brand: {item.brand}</p>
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(item.price)}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 -mr-2"
                            title="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center mt-4">
                          <span className="text-sm text-gray-600 mr-4">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1 font-medium min-w-[50px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                           <span className="ml-auto text-lg font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2" /> Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                 <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                 </div>
                 {subtotal > 0 && shipping > 0 && 
                    <p className="text-sm text-gray-500">Add {formatCurrency(10000 - subtotal)} more for free shipping</p>
                 }
                 {shipping === 0 && <p className="text-sm text-green-600">🎉 You've qualified for free shipping!</p>}
                 <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                       <span>Total</span>
                       <span>{formatCurrency(total)}</span>
                    </div>
                 </div>
              </div>
              <button
                 onClick={handleCheckout}
                 className="w-full bg-[#048399] text-white py-3 px-6 rounded-lg hover:bg-[#036d80] transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
              >
                 <CreditCard className="h-5 w-5" /> <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
