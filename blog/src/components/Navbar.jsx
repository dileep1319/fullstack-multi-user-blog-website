import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-950 py-4 px-6 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-primary-400 transition-colors duration-200">Blog App</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-primary-400 transition-colors duration-200">Home</Link>
          {token ? (
            <>
              <Link to="/create-blog" className="text-sm font-medium hover:text-primary-400 transition-colors duration-200">Create Blog</Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary-400 transition-colors duration-200">Dashboard</Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 hover:bg-primary-700 transition-colors duration-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary-400 transition-colors duration-200">Login</Link>
              <Link to="/register" className="text-sm font-medium hover:text-primary-400 transition-colors duration-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
