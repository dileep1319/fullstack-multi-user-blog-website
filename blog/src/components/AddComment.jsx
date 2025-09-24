import { useState, useContext } from 'react';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function AddComment({ blogId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to add a comment.');
      return;
    }
    try {
      await api.post(`/comments/${blogId}`, { content });
      setContent('');
      onCommentAdded(); // Notify parent to refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border-b border-dark-600 focus:outline-none focus:border-primary-500 bg-dark-700 text-white resize-y"
          rows="3"
          placeholder="What are your thoughts? Join the conversation..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default AddComment;
