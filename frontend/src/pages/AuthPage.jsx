import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/ASTRAPE.svg'; // Make sure you have this image in src/assets
import { login, signup } from "../api"; // We will create this file
import { AuthContext } from '../context/AuthContext'; // We will create this context
import { IoArrowBackCircleSharp } from "react-icons/io5";

const AuthPage = () => {
  const [signInMode, setSignInMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login: contextLogin } = useContext(AuthContext); // Get login function from context

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    number: '',
    password: ''
  });

  const toggleMode = () => {
    setSignInMode(!signInMode);
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', number: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (signInMode) {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await signup({
          username: formData.username,
          email: formData.email,
          number: formData.number,
          password: formData.password,
        });
      }

      const { token, user } = response.data;
      
      // Use context to set user state globally
      contextLogin(user, token);

      setSuccess(signInMode ? "Login successful! Redirecting..." : "Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-2 sm:p-4 ">
    <div className='max-w-4xl absolute '>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-[42em] text-[#048399] hover:text-[#036d80] transition-colors flex items-center"
      >
        <IoArrowBackCircleSharp size={25} className="mr-1" /> Back
      </button>
      </div>
      <div className="flex items-center justify-center w-full min-h-screen">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-4xl min-h-[400px] md:min-h-[500px] relative">
        
        {/* Error/Success Messages */}
        {error && (
          <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-100 bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm max-w-[90%]">
              {error}
          </div>
        )}
        {success && (
          <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-100 bg-green-100 border border-green-400 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm max-w-[90%]">
              {success}
          </div>
        )}
        
        {/* Mobile Layout (sm and below) */}
          <div className="md:hidden h-full ">
          <div className="h-full flex flex-col">
              {/* Toggle Buttons for Mobile */}
              <div className="flex bg-gray-50 rounded-t-lg">
              <button
                  onClick={() => setSignInMode(true)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                  signInMode 
                      ? 'bg-white text-[#048399] border-b-2 border-[#048399]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                  Sign In
              </button>
              <button
                  onClick={() => setSignInMode(false)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                  !signInMode 
                      ? 'bg-white text-[#048399] border-b-2 border-[#048399]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                  Sign Up
              </button>
              </div>

              {/* Form Container */}
              <div className="flex-1 px-6 py-8 sm:px-8">
              <form onSubmit={handleSubmit} className="flex flex-col justify-center h-full space-y-4">
                  <h1 className="font-bold text-[#048399] text-xl sm:text-2xl mb-4 text-center">
                  {signInMode ? 'Welcome Back!' : 'Create Account'}
                  </h1>
                  
                  {!signInMode && (
                  <input 
                      required
                      type="text" 
                      name="username"
                      placeholder="Username" 
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-gray-200 py-3 px-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399] text-sm" 
                  />
                  )}
                  
                  <input 
                  required
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-200 py-3 px-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399] text-sm" 
                  />
                  
                  {!signInMode && (
                  <input 
                      required
                      type="text" 
                      name="number"
                      placeholder="Phone Number" 
                      value={formData.number}
                      onChange={handleInputChange}
                      className="bg-gray-200 py-3 px-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399] text-sm" 
                  />
                  )}
                  
                  <input 
                  required
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-200 py-3 px-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399] text-sm" 
                  />
                  
                  {signInMode && (
                  <a href="#" className="text-gray-600 text-xs hover:text-gray-800 text-center">
                      Forgot your password?
                  </a>
                  )}
                  
                  <button 
                  type="submit"
                  disabled={loading}
                  className="rounded-full border border-[#048399] bg-[#048399] text-white text-xs font-bold py-3 px-8 mt-4 tracking-wide uppercase hover:bg-[#036d80] active:scale-95 transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {loading ? (signInMode ? 'Signing In...' : 'Creating Account...') : (signInMode ? 'Sign In' : 'Sign Up')}
                  </button>
              </form>
              </div>
          </div>
          </div>
        
        {/* Desktop/Tablet Layout (md and above) */}
        <div className="hidden z-0 md:flex h-full">

          {/* Sign Up Container */}
          <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 ${
            signInMode ? 'opacity-0 z-0' : 'transform translate-x-full opacity-100 z-50'
          }`}>
            <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-8 lg:px-12 h-full text-center">
              <h1 className="font-bold text-[#048399] text-xl lg:text-2xl mb-6">Create Account</h1>
              <input 
                required
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <input 
                required
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <input 
                required
                type="text" 
                name="number"
                placeholder="Phone Number" 
                value={formData.number}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <input 
                required
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <button 
                type="submit"
                disabled={loading}
                className="rounded-full border border-[#048399] bg-[#048399] text-white text-xs font-bold py-3 px-8 lg:px-11 mt-4 tracking-wide uppercase hover:bg-[#036d80] active:scale-95 transition-transform duration-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Sign In Container */}
          <div className={`absolute top-0 h-full transition-all duration-500 ease-in-out left-0 w-1/2 z-0 ${
            signInMode ? '' : 'transform translate-x-full'
          }`}>
            <form onSubmit={handleSubmit} className="bg-white flex items-center justify-center flex-col px-8 lg:px-12 h-full text-center">
              <h1 className="font-bold text-[#048399] text-xl lg:text-2xl mb-6">Sign In</h1>
              <input 
                required
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <input 
                required
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-200 py-3 px-4 my-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#048399]" 
              />
              <a href="#" className="text-gray-600 text-sm my-4 hover:text-gray-800">Forgot your password?</a>
              <button 
                type="submit"
                disabled={loading}
                className="rounded-full border border-[#048399] bg-[#048399] text-white text-xs font-bold py-3 px-8 lg:px-11 tracking-wide uppercase hover:bg-[#036d80] active:scale-95 transition-transform duration-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Overlay */}
          <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-500 ease-in-out z-0 ${
            signInMode ? '' : 'transform -translate-x-full'
          }`}>
            <div
              style={{ backgroundImage: `url(${bgImage})` }}
              className={`bg-cover bg-center text-[#048399] relative -left-full h-full w-[200%] transition-transform duration-500 ease-in-out ${
                signInMode ? 'translate-x-0' : 'translate-x-1/2'
              }`}
            >

            {/* Left Overlay — Sign In Side */}
              <div
                className={`absolute flex items-center justify-center flex-col px-6 lg:px-10 text-center top-0 h-full w-1/2 transition-transform duration-500 ease-in-out ${
                  signInMode ? '-translate-x-1/5' : 'translate-x-0' // Small adjustment for centering text
                }`}
              >
                <h1 className="font-bold text-4xl text-white mb-2">Welcome Back!</h1>
                <p className="text-white text-sm lg:text-lg font-medium leading-5 my-5 mb-8">
                    Sign in to continue shopping your favorite products and track your cart seamlessly!
                </p>
                <button
                  onClick={toggleMode}
                  className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-8 lg:px-11 tracking-wide uppercase hover:bg-white hover:text-[#048399] active:scale-95 transition-transform duration-75"
                >
                  Sign In
                </button>
              </div>

              {/* Right Overlay — Sign Up Side */}
              <div
                className={`absolute flex items-center justify-center flex-col px-6 lg:px-10 text-center top-0 h-full w-1/2 right-0 transition-transform duration-500 ease-in-out ${
                  signInMode ? 'translate-x-0' : 'translate-x-1/5' // Small adjustment for centering text
                }`}
              >
                <h1 className="font-bold text-4xl text-white mb-2">New Here?</h1>
                <p className="text-white text-sm lg:text-lg font-medium leading-5 my-5 mb-8">
                  Create an account to explore exclusive deals and enjoy a smooth shopping experience!
                </p>
                <button
                  onClick={toggleMode}
                  className="rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-8 lg:px-11 tracking-wide uppercase hover:bg-white hover:text-[#048399] active:scale-95 transition-transform duration-75"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div> 
    </div>
  );
};

export default AuthPage;