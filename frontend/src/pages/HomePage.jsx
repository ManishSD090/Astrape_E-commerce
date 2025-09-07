import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-[#048399]">Welcome to ASTRAPE</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/admin-login')}
          className="bg-[#048399] text-white px-6 py-3 rounded-lg hover:bg-[#036d80] transition-colors"
        >
          Admin Login
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          User Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
