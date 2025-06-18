import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageSquare, Tag, User } from 'lucide-react';
import { fetchBlogs } from '../../store/slices/blogSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { UserContext } from '../../context/UserContext';

const BlogList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);
  const { user } = useContext(UserContext);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

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

  if (error) {
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
          {error}
        </div>
      </div>
    );
  }

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
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          {user && (user.role === 'admin' || user.role === 'instructor') && (
            <Link
              to="/blogs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              Create New Post
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <Link to={`/blogs/${blog._id}`}>
                <img
                  src={blog.thumbnail || 'https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg'}
                  alt={blog.title || 'Blog thumbnail'}
                  className="w-full h-48 object-cover border-b border-white/20"
                />
              </Link>
              
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="ml-2 text-sm text-blue-100">{blog.authorId?.name || 'Unknown'}</span>
                  <span className="mx-2 text-white/20">•</span>
                  <time className="text-sm text-blue-100">
                    {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                      ? format(new Date(blog.createdAt), 'MMM d, yyyy')
                      : 'Unknown date'}
                  </time>
                </div>
                
                <Link to={`/blogs/${blog._id}`}>
                  <h2 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                    {blog.title || 'Untitled Blog'}
                  </h2>
                </Link>
                
                <p className="text-blue-100 mb-4 line-clamp-3">
                  {blog.content || 'No content available.'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-5 w-5" />
                      <span className="ml-1 text-sm">{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-5 w-5" />
                      <span className="ml-1 text-sm">{blog.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  {blog.tags?.length > 0 && (
                    <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                      <Tag className="h-4 w-4" />
                      <span className="ml-1 text-sm">
                        {blog.tags[0]}
                        {blog.tags.length > 1 && ` +${blog.tags.length - 1}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;