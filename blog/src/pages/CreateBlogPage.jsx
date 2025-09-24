import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You need to be logged in to create a blog.');
      return;
    }

    try {
      const response = await api.post('/blogs', { title, content });
      // Add a small delay to allow the backend to process and commit the new blog.
      setTimeout(() => {
        navigate(`/blogs/${response.data.blog.id}`); // Redirect to the newly created blog
      }, 500); // 500ms delay
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog.');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto bg-dark-800 rounded-lg shadow-xl p-8 border border-dark-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Create New Blog</h1>
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
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlogPage;
