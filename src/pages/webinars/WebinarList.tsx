import { useEffect, useContext, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Video, Clock, Users, Calendar, Search, Filter, ChevronLeft, ChevronRight, Star, Award, PlayCircle } from 'lucide-react';
import { fetchWebinars } from '../../store/slices/webinarSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { UserContext } from '../../context/UserContext';

// Mock data for demonstration
const mockWebinars = [
  {
    _id: '1',
    title: 'Advanced React Patterns and Performance Optimization',
    description: 'Deep dive into advanced React patterns, hooks optimization, and performance best practices for large-scale applications.',
    speaker: { name: 'Dr. Sarah Johnson', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-06-15T14:00:00Z',
    duration: 90,
    attendees: Array(127).fill(null),
    category: 'Frontend Development'
  },
  {
    _id: '2',
    title: 'Machine Learning for Web Developers',
    description: 'Introduction to implementing ML models in web applications using TensorFlow.js and practical use cases.',
    speaker: { name: 'Prof. Michael Chen', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-06-18T16:30:00Z',
    duration: 120,
    attendees: Array(89).fill(null),
    category: 'Machine Learning'
  },
  {
    _id: '3',
    title: 'Cloud Architecture Best Practices',
    description: 'Scalable cloud solutions, microservices architecture, and DevOps practices for modern applications.',
    speaker: { name: 'Dr. Sarah Johnson', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-06-22T13:00:00Z',
    duration: 75,
    attendees: Array(156).fill(null),
    category: 'Cloud Computing'
  },
  {
    _id: '4',
    title: 'UX Design Psychology & User Behavior',
    description: 'Understanding user psychology, behavior patterns, and creating intuitive interfaces that convert.',
    speaker: { name: 'Emma Rodriguez', profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-06-25T15:00:00Z',
    duration: 60,
    attendees: Array(203).fill(null),
    category: 'UX/UI Design'
  },
  {
    _id: '5',
    title: 'Blockchain Development Fundamentals',
    description: 'Smart contracts, DeFi protocols, and building decentralized applications on Ethereum.',
    speaker: { name: 'Alex Thompson', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-06-28T17:00:00Z',
    duration: 105,
    attendees: Array(78).fill(null),
    category: 'Blockchain'
  },
  {
    _id: '6',
    title: 'Data Visualization with D3.js',
    description: 'Creating interactive and beautiful data visualizations for web applications using D3.js and modern techniques.',
    speaker: { name: 'Prof. Michael Chen', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    startTime: '2025-07-02T14:30:00Z',
    duration: 85,
    attendees: Array(134).fill(null),
    category: 'Data Science'
  }
];

const WebinarList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { webinars = mockWebinars, loading, error } = useSelector((state: RootState) => state.webinars);
  const { user } = useContext(UserContext);

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchWebinars());
  }, [dispatch]);

  // Get unique instructors and categories
  const instructors = useMemo(() => {
    const uniqueInstructors = [...new Set(webinars.map(w => w.speaker?.name).filter(Boolean))];
    return uniqueInstructors;
  }, [webinars]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(webinars.map(w => w.category).filter(Boolean))];
    return uniqueCategories;
  }, [webinars]);

  // Filter webinars
  const filteredWebinars = useMemo(() => {
    return webinars.filter(webinar => {
      const matchesSearch = webinar.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           webinar.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesInstructor = !selectedInstructor || webinar.speaker?.name === selectedInstructor;
      const matchesCategory = !selectedCategory || webinar.category === selectedCategory;
      
      return matchesSearch && matchesInstructor && matchesCategory;
    });
  }, [webinars, searchTerm, selectedInstructor, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredWebinars.length / itemsPerPage);
  const paginatedWebinars = filteredWebinars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedInstructor, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-purple-400 border-r-3 border-blue-400 relative z-10"></div>
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
          />
        ))}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl text-red-400 relative z-10">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Professional Banner */}
      <div className="relative z-10 bg-gradient-to-r from-purple-800/80 via-blue-800/80 to-indigo-800/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-blue-400 p-4 rounded-full">
                <PlayCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Professional Webinars
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join industry experts and thought leaders in interactive sessions designed to elevate your skills and advance your career
            </p>
            <div className="flex justify-center items-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-400 mr-2" />
                <span>Certificate of Completion</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-400 mr-2" />
                <span>Interactive Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Upcoming Sessions</h2>
            <p className="text-blue-200">
              {filteredWebinars.length} webinar{filteredWebinars.length !== 1 ? 's' : ''} available
            </p>
          </div>
          {user && (user.role === 'instructor' || user.role === 'admin') && (
            <Link
              to="/webinars/create"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create Webinar
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <input
                type="text"
                placeholder="Search webinars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Instructor Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">All Instructors</option>
                {instructors.map(instructor => (
                  <option key={instructor} value={instructor} className="bg-gray-800">
                    {instructor}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="" className="bg-gray-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedInstructor('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Webinar Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {paginatedWebinars.map((webinar) => (
            <div
              key={webinar._id}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 border border-purple-400/30">
                    {webinar.category || 'General'}
                  </span>
                  <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-4 w-4 mr-1 text-white" />
                    <span className="text-sm">{webinar.duration || 60} mins</span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-200 transition-colors duration-300">
                  {webinar.title || 'Untitled Webinar'}
                </h2>

                <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                  {webinar.description || 'No description available.'}
                </p>

                <div className="flex items-center mb-4">
                  <img
                    src={webinar.speaker?.profileImage || 'https://placehold.co/40'}
                    alt={webinar.speaker?.name || 'Speaker'}
                    className="h-12 w-12 rounded-full border-2 border-white/30 group-hover:border-purple-400/50 transition-colors duration-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors duration-300">
                      {webinar.speaker?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-blue-100">Expert Instructor</p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between text-sm text-blue-100 mb-4">
                    <div className="flex items-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-4 w-4 mr-1 text-white" />
                      {webinar.startTime && !isNaN(new Date(webinar.startTime).getTime())
                        ? format(new Date(webinar.startTime), 'MMM d, yyyy')
                        : 'Unknown date'}
                    </div>
                    <div className="flex items-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-4 w-4 mr-1 text-white" />
                      {webinar.attendees?.length || 0} registered
                    </div>
                  </div>

                  <Link
                    to={`/webinars/${webinar._id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Video className="h-4 w-4 mr-2 text-white" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredWebinars.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-blue-300 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No webinars found</h3>
            <p className="text-blue-200 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedInstructor('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarList;