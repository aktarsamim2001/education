import { useEffect, useState, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Search, Filter, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { fetchCourses } from '../../store/slices/courseSlice';
import type { AppDispatch, RootState } from '../../store/store';
import UserContext from '../../context/UserContext';

const CourseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);
  const { user } = useContext(UserContext);
  
  // Filter and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const coursesPerPage = 9;

  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(fetchCourses({ published: 'all' }));
    } else {
      dispatch(fetchCourses());
    }
  }, [dispatch, user]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
      const matchesRating = (course.rating || 0) >= minRating;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'students':
          return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, sortBy, priceRange, minRating]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredAndSortedCourses.slice(startIndex, startIndex + coursesPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, priceRange, minRating]);

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-red-400 text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="fixed w-1 h-1 bg-white rounded-full opacity-10 animate-pulse pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        ></div>
      ))}

      {/* Professional Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Discover Your Next
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Learning Adventure
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Unlock your potential with our comprehensive collection of courses. From beginner-friendly tutorials to advanced masterclasses, find the perfect course to elevate your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">{courses.length}+ Courses Available</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Expert Instructors</span>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                <span className="text-white font-semibold">Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              <option value="" className="bg-gray-800">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            >
              <option value="title" className="bg-gray-800">Sort by Title</option>
              <option value="price-low" className="bg-gray-800">Price: Low to High</option>
              <option value="price-high" className="bg-gray-800">Price: High to Low</option>
              <option value="rating" className="bg-gray-800">Highest Rated</option>
              <option value="students" className="bg-gray-800">Most Popular</option>
              <option value="newest" className="bg-gray-800">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-blue-300 hover:bg-white/20'
                }`}
              >
                <Grid className="h-5 w-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-blue-300 hover:bg-white/20'
                }`}
              >
                <List className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Minimum Rating: {minRating} stars
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-blue-100">
            Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, filteredAndSortedCourses.length)} of {filteredAndSortedCourses.length} courses
          </p>
          {filteredAndSortedCourses.length === 0 && (
            <p className="text-yellow-300">No courses match your current filters</p>
          )}
        </div>

        {/* Course Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          : "space-y-6 mb-8"
        }>
          {paginatedCourses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className={`group bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={viewMode === 'list' ? 'w-1/3' : 'aspect-w-16 aspect-h-9'}>
                <img
                  src={course.thumbnail || 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg'}
                  alt={course.title}
                  className={`object-cover ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
                />
              </div>
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-blue-100 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledStudents?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{course.rating || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">₹{course.price}</span>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium">
                    Enroll Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isVisible = Math.abs(pageNum - currentPage) <= 2 || pageNum === 1 || pageNum === totalPages;
              
              if (!isVisible) {
                if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return <span key={pageNum} className="px-2 text-blue-300">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;