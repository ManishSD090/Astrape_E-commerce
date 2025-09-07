import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Store admin session flag
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin'); // Navigate to admin dashboard
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-[#048399]">Admin Login</h2>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md space-y-4 w-80">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#048399]"
        />

        <button
          type="submit"
          className="w-full bg-[#048399] text-white py-2 rounded-lg hover:bg-[#036d80] transition-colors"
        >
          Login
        </button>
      </form>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-4 text-[#048399] hover:text-[#036d80] transition-colors flex items-center"
      >
        <IoArrowBackCircleSharp size={25} className="mr-1" /> Back
      </button>
    </div>
  );
};

export default AdminLogin;
