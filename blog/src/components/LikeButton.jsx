import { useState, useContext, useEffect } from 'react';
import api from '../api/api';
import AuthContext from '../context/AuthContext';

function LikeButton({ blogId, initialLikes, initialUserLiked }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialUserLiked);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    // No need for a placeholder here as initialUserLiked is provided by parent
  }, [blogId, token, initialUserLiked]); // Add initialUserLiked to dependencies

  const handleLikeToggle = async () => {
    if (!token) {
      alert('Please log in to like a blog.');
      return;
    }
    try {
      await api.post(`/likes/${blogId}`);
      if (isLiked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
      // onLikeToggle(); // Notify parent component of change
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to toggle like.');
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center space-x-1 px-4 py-2 rounded-md ${isLiked ? 'text-primary-500 bg-primary-900' : 'text-dark-300 bg-dark-700'} font-semibold focus:outline-none hover:bg-primary-800 hover:text-primary-400 transition-colors duration-200`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${isLiked ? 'fill-current' : 'stroke-current'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {likes}
    </button>
  );
}

export default LikeButton;
