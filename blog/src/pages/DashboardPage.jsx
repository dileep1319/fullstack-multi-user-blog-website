import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function DashboardPage() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [user, setUser] = useState(null); // New state for user info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user's blogs
        const blogsResponse = await api.get('/blogs/my'); // Assuming a /api/blogs/my endpoint for user's blogs
        setMyBlogs(blogsResponse.data);

        // Fetch user info (assuming a /api/auth/me endpoint or similar)
        const userResponse = await api.get('/auth/me'); // This endpoint needs to exist on your backend
        setUser(userResponse.data);

      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, navigate]);

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${blogId}`);
        setMyBlogs(myBlogs.filter((blog) => blog.id !== blogId));
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog. You might not be the owner.');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* User Info Section */}
        {user && (
          <div className="bg-dark-800 rounded-lg shadow-xl p-8 text-center border border-dark-700">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome, {user.username}!</h2>
            <p className="text-dark-300 text-lg">{user.email}</p>
          </div>
        )}

        {/* My Blogs Section */}
        <div className="bg-dark-800 rounded-lg shadow-xl p-8 border border-dark-700">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">My Blogs</h1>
          {myBlogs.length === 0 ? (
            <p className="text-center text-dark-300">You haven't created any blogs yet. <Link to="/create-blog" className="text-primary-400 hover:underline">Create one!</Link></p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBlogs.map((blog) => (
                <div key={blog.id} className="bg-dark-700 rounded-lg p-6 flex flex-col justify-between h-full border border-dark-600 hover:shadow-md transition-shadow duration-200">
                  <div>
                    <Link to={`/blogs/${blog.id}`}>
                      <h2 className="text-xl font-bold text-white hover:text-primary-400 transition-colors duration-200 mb-2 leading-tight">{blog.title}</h2>
                    </Link>
                    <p className="text-dark-300 text-sm mb-4 line-clamp-3">{blog.content.substring(0, 100)}...</p>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <Link
                      to={`/edit-blog/${blog.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
