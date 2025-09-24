import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import LikeButton from '../components/LikeButton';
import CommentList from '../components/CommentList';
import AddComment from '../components/AddComment';

function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false); // New state for userLiked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('BlogDetailsPage: Component rendered with ID', id);

  const fetchBlogDetails = useCallback(async () => {
    console.log('fetchBlogDetails: Attempting to fetch for ID', id);
    if (!id) {
      console.log('fetchBlogDetails: ID is undefined, skipping fetch.');
      setLoading(false);
      setError('Blog ID not provided.');
      return;
    }
    try {
      const blogResponse = await api.get(`/blogs/${id}`);
      console.log('fetchBlogDetails: Blog response data', blogResponse.data);
      setBlog(blogResponse.data);

      const commentsResponse = await api.get(`/comments/${id}`);
      console.log('fetchBlogDetails: Comments response data', commentsResponse.data);
      setComments(commentsResponse.data);

      const likesResponse = await api.get(`/likes/${id}`);
      console.log('fetchBlogDetails: Likes response data', likesResponse.data);
      setLikes(likesResponse.data.total); // Changed from likesResponse.data.likes to likesResponse.data.total
      setUserLiked(likesResponse.data.userLiked); // Set userLiked state
    } catch (err) {
      setError('Failed to fetch blog details.');
      console.error('fetchBlogDetails: Error caught', err);
    } finally {
      setLoading(false);
      console.log('fetchBlogDetails: Loading set to false');
    }
  }, [id]);

  useEffect(() => {
    console.log('useEffect: calling fetchBlogDetails');
    fetchBlogDetails();
  }, [fetchBlogDetails]);

  const handleCommentAdded = () => {
    console.log('handleCommentAdded: refreshing blog details');
    fetchBlogDetails(); // Refresh comments and likes after a new comment is added
  };

  const handleLikeToggle = () => {
    console.log('handleLikeToggle: refreshing blog details');
    fetchBlogDetails(); // Refresh likes after like/unlike action
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading blog...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="container mx-auto py-8 text-center">Blog not found.</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto bg-dark-800 rounded-lg shadow-xl p-8 border border-dark-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{blog.title}</h1>
        <p className="text-dark-300 text-sm mb-6">
          By <span className="font-semibold text-primary-400">@{blog.author}</span> on {
            blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Invalid Date'
        }</p>
        
        <div className="prose max-w-none text-white leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />
        
        <div className="flex justify-between items-center mb-10 pb-4">
          <LikeButton blogId={blog.id} initialLikes={likes} initialUserLiked={userLiked} onLikeToggle={handleLikeToggle} />
          <span className="text-dark-300 text-sm font-medium">{comments.length} Comments</span>
        </div>

        <CommentList comments={comments} />
        <AddComment blogId={blog.id} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
}

export default BlogDetailsPage;
