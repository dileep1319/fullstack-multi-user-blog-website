function CommentList({ comments }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-dark-300 italic">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-md">
              <p className="text-white leading-relaxed mb-2">{comment.content}</p>
              <p className="text-dark-300 text-xs font-medium">By <span className="font-semibold text-primary-400">@{comment.author}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentList;
