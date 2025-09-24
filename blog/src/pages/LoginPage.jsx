import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // New state for error messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password }); // Added console.log
    const success = await login(email, password);
    if (success) {
      navigate('/'); // Redirect to home page on successful login
    } else {
      setError('Login failed. Please check your credentials.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="bg-dark-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-dark-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-primary-400 text-sm mb-4 text-center">{error}</p>} {/* Display error */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-dark-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-dark-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
