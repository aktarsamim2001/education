import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Heart, MessageSquare, Tag, Trash2, Edit, User } from 'lucide-react';
import { fetchBlogById, toggleBlogLike, addBlogComment, deleteBlog } from '../../store/slices/blogSlice';
import type { AppDispatch, RootState } from '../../store/store';
import ShareModal from '../../components/ShareModal';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { blog, loading, error } = useSelector((state: RootState) => state.blogs);
  const authState = useSelector((state: RootState) => state.auth) || {};
  const user = authState.user;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      await dispatch(toggleBlogLike(id));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await dispatch(deleteBlog(id!)).unwrap();
        navigate('/blogs');
      } catch (error) {
        console.error('Failed to delete blog:', error);
      }
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const form = e.currentTarget;
    const content = new FormData(form).get('comment') as string;

    if (content.trim() && id) {
      try {
        await dispatch(addBlogComment({ id, content })).unwrap();
        form.reset();
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl text-red-400 relative z-10">
          {error || 'Blog not found'}
        </div>
      </div>
    );
  }

  const isAuthor = user && (user._id === blog.authorId?._id || user.role === 'admin');
  const hasLiked = user && blog.likes?.includes(user._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        ></div>
      ))}
      
      <div className="max-w-4xl mx-auto relative z-10">
        <article className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105">
          <img
            src={blog.thumbnail || 'https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg'}
            alt={blog.title || 'Blog thumbnail'}
            className="w-full h-64 object-cover border-b border-white/20"
          />
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="h-10 w-10 text-white bg-white/10 border border-white/20 rounded-full p-2" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{blog.authorId?.name || 'Unknown'}</p>
                  <time className="text-sm text-blue-100">
                    {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                      ? format(new Date(blog.createdAt), 'PPP')
                      : 'Unknown date'}
                  </time>
                </div>
              </div>
              
              {isAuthor && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                    className="p-2 text-blue-100 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
                    aria-label="Edit blog"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-blue-100 hover:text-red-400 transition-colors duration-300 transform hover:scale-110"
                    aria-label="Delete blog"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              {blog.title || 'Untitled Blog'}
            </h1>
            <button
              onClick={handleShare}
              className="ml-2 p-2 rounded-full text-blue-200 hover:text-white transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75l3 3-3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 9.75H9" />
              </svg>
            </button>
            
            {blog.tags?.length > 0 && (
              <div className="flex items-center mb-6">
                <Tag className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="ml-2 flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="prose prose-invert max-w-none mb-8">
              {blog.content?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-blue-100">
                  {paragraph || 'No content available.'}
                </p>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-white/20 pt-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors duration-300 ${
                  hasLiked ? 'text-red-400' : 'text-blue-100 hover:text-red-400'
                }`}
                aria-label={hasLiked ? 'Unlike blog' : 'Like blog'}
              >
                <Heart className="h-5 w-5 transform hover:scale-110 transition-transform duration-300" fill={hasLiked ? 'currentColor' : 'none'} />
                <span>{blog.likes?.length || 0} likes</span>
              </button>
              
              <div className="flex items-center space-x-2 text-blue-100">
                <MessageSquare className="h-5 w-5 transform hover:scale-110 transition-transform duration-300" />
                <span>{blog.comments?.length || 0} comments</span>
              </div>
            </div>
          </div>
        </article>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
            Comments
          </h2>
          
          {user ? (
            <form onSubmit={handleComment} className="mb-8 group">
              <div className="mb-4">
                <label htmlFor="comment" className="sr-only">
                  Add a comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  placeholder="Add a comment..."
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="text-blue-100 mb-8">
              Please <span className="text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer" onClick={() => navigate('/login')}>log in</span> to comment.
            </p>
          )}
          
          <div className="space-y-6">
            {blog.comments?.map((comment) => (
              <div key={comment._id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 text-white" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{comment.user?.name || 'Unknown'}</p>
                    <time className="text-xs text-blue-100">
                      {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                        ? format(new Date(comment.createdAt), 'PPP')
                        : 'Unknown date'}
                    </time>
                  </div>
                </div>
                <p className="text-blue-100">{comment.content || 'No comment content.'}</p>
              </div>
            ))}
          </div>
        </div>
        
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={window.location.href}
          title={blog?.title || ''}
        />
      </div>
    </div>
  );
};

export default BlogDetail;