import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import api from '../api';
import axios from 'axios';

const categories = ["Electronics", "Food & Beverages", "Furniture", "Sports", "Fashion", "Kitchen", "Health & Beauty", "Accessories", "Home Decor", "Books"];
const brands = [
  "Apple", "Google", "Microsoft", "Amazon", "Samsung", "Sony", "Nike", "Adidas", "Levi's", "Zara", "Toyota", "Tesla", "Mercedes-Benz", "Tata Motors", "Coca-Cola", "McDonald's", "Starbucks", "Amul", "Visa", "Reliance", "Disney", "Other"
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin-login');
    }
  }, [navigate]);

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    brand: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    image: ''
  });
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await api.get("/items");
      const mappedProducts = res.data.map(item => ({
        ...item,
        productId: item._id,
        image: item.imageUrl || 'https://via.placeholder.com/150', // fallback
      }));
      setProducts(mappedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  fetchProducts();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "ecommerce_unsigned");

    setUploading(true);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dxevxrf2x/image/upload",
        formDataUpload
      );
      setFormData(prev => ({ ...prev, image: res.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price || !formData.image || !formData.description || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      price: parseInt(formData.price),
      quantity: parseInt(formData.quantity || 1),
      description: formData.description,
      category: formData.category,
      imageUrl: formData.image
    };

    try {
      if (editing) {
        await api.put(`/items/${formData.productId}`, newProduct);
        setProducts(prev => prev.map(p => (p.productId === formData.productId ? { ...p, ...newProduct, image: newProduct.imageUrl } : p)));
        setEditing(false);
      } else {
        const res = await api.post("/items", newProduct);
        setProducts(prev => [...prev, { ...newProduct, productId: res.data._id, image: newProduct.imageUrl }]);
      }
      setFormData({
        productId: '',
        name: '',
        brand: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
        image: ''
      });
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      productId: product.productId,
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setProducts(prev => prev.filter(p => p.productId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#048399]">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />
        <select
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        >
          <option value="">Select Brand</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input type="file" onChange={handleImageUpload} className="w-1/2 h-8 p-1 text-white bg-[#048399] rounded-lg hover:bg-[#036d80] transition-colors" />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-24 object-cover rounded" />}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-[#048399] text-white py-2 rounded-lg hover:bg-[#036d80] transition-colors"
        >
          {editing ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Product List</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Brand</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.productId} className="text-center">
                    <td className="p-2 border">
                      <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded mx-auto" />
                    </td>
                    <td className="p-2 border">{product.name}</td>
                    <td className="p-2 border">{product.brand}</td>
                    <td className="p-2 border">{product.category}</td>
                    <td className="p-2 border">₹{product.price}</td>
                    <td className="p-2 border">{product.quantity}</td>
                    <td className="p-2 border flex justify-center space-x-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                        <IoCreateOutline size={20} />
                      </button>
                      <button onClick={() => handleDelete(product.productId)} className="text-red-500 hover:text-red-700">
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
