import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function EditBlogPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError('Failed to fetch blog for editing.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/blogs/${id}`, { title, content });
      navigate(`/blogs/${id}`); // Redirect to the updated blog
    } catch (err) {
      console.error('Error updating blog:', err);
      alert('Failed to update blog. You might not be the owner.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading blog for editing...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto bg-dark-800 rounded-lg shadow-xl p-8 border border-dark-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Edit Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-dark-700 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="content">Content</label>
            <textarea
              id="content"
              className="w-full px-4 py-2 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-dark-700 text-white"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlogPage;
