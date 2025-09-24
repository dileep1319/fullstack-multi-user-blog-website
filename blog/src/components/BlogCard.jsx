import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

function BlogCard({ blog }) {
  return (
    <div className="bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between h-full border border-dark-700">
      <div>
        <Link to={`/blogs/${blog.id}`}>
          <h2 className="text-2xl font-bold text-white hover:text-primary-400 transition-colors duration-200 mb-2 leading-tight">{blog.title}</h2>
        </Link>
        <p className="text-dark-300 text-sm mb-4 line-clamp-3">{blog.content.substring(0, 150)}...</p>
      </div>
      <div className="flex items-center justify-between text-dark-400 text-xs mt-4">
        <span className="flex items-center">
          Likes: {blog.likesCount || 0}
        </span>
        <LikeButton blogId={blog.id} initialLikes={blog.likesCount} initialIsLiked={blog.isLiked} />
        <span className="flex items-center">
          Comments: {blog.commentCount || 0}
        </span>
      </div>
    </div>
  );
}

export default BlogCard;
