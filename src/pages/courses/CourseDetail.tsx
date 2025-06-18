import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Play, 
  Download, 
  Share2, 
  Heart, 
  CheckCircle, 
  Globe, 
  Award, 
  Calendar,
  User,
  ArrowLeft,
  PlayCircle,
  Lock
} from 'lucide-react';
import { toast } from 'react-toastify';
import UserContext from '../../context/UserContext';
import { fetchCourseById } from '../../store/slices/courseSlice';
import { enrollInCourse } from '../../store/slices/enrollmentSlice';
import { createPayment } from '../../store/slices/paymentSlice';
import type { AppDispatch, RootState } from '../../store/store';
import ShareModal from '../../components/ShareModal';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { course, loading, error } = useSelector((state: RootState) => state.courses);
  const { user, loading: authLoading } = useContext(UserContext);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (id && id !== 'create') {
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id]);

  const handleEnroll = async () => {
    if (!user || !user._id) {
      // Save the course ID to redirect back after login
      sessionStorage.setItem('enrollAfterLogin', id || '');
      navigate('/login');
      return;
    }

    try {
      if (course?.price === 0) {
        await dispatch(enrollInCourse(id!)).unwrap();
        toast.success('Successfully enrolled in the course!');
      } else {
        await dispatch(createPayment(id!)).unwrap();
        // Payment flow will continue through RazorPay
      }
    } catch (error: any) {
      toast.error(error?.message || 'Enrollment failed. Please try again.');
      console.error('Enrollment failed:', error);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const totalDuration = course?.lessons?.reduce((acc, lesson) => acc + (lesson.duration || 0), 0) || 0;
  const isEnrolled = user && course?.enrolledStudents?.includes(user._id);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Course Not Found</h2>
          <p className="text-blue-100 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Browse All Courses
          </button>
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

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 py-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Navigation */}
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center text-blue-200 hover:text-white mb-8 transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </button>

          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-purple-600/30 text-purple-200 text-sm font-medium rounded-full mb-4">
                  {course.category || 'Course'}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                  {course.title}
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-white font-medium">{course.rating || 4.5}</span>
                    <span className="text-blue-200 ml-1">({Math.floor(Math.random() * 1000) + 100} reviews)</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
                    <Users className="h-5 w-5 text-white mr-2" />
                    <span className="text-white">{course.enrolledStudents?.length || 0} students</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
                    <Clock className="h-5 w-5 text-white mr-2" />
                    <span className="text-white">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
                    <Globe className="h-5 w-5 text-white mr-2" />
                    <span className="text-white">English</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{course.instructor?.name || 'Expert Instructor'}</p>
                    <p className="text-blue-200 text-sm">{course.instructor?.title || 'Professional Educator'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Preview/Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-8">
                {/* Course Preview Image/Video */}
                <div className="relative mb-6 rounded-xl overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <PlayCircle className="h-8 w-8 text-white" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">₹{course.price}</span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-lg text-blue-200 line-through ml-2">₹{course.originalPrice}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/courses/${id}/learn`)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-medium flex items-center justify-center"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                    </button>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`flex-1 py-2 px-4 rounded-xl border transition-all duration-300 ${
                        isWishlisted 
                          ? 'bg-red-600/20 border-red-500 text-red-300' 
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <Heart className={`h-5 w-5 mx-auto ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 py-2 px-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Share2 className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Course Includes */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-blue-100">
                      <BookOpen className="h-5 w-5 text-green-400 mr-3" />
                      {course.lessons?.length || 0} lessons
                    </li>
                    <li className="flex items-center text-sm text-blue-100">
                      <Clock className="h-5 w-5 text-green-400 mr-3" />
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m of content
                    </li>
                    <li className="flex items-center text-sm text-blue-100">
                      <Download className="h-5 w-5 text-green-400 mr-3" />
                      Downloadable resources
                    </li>
                    <li className="flex items-center text-sm text-blue-100">
                      <Award className="h-5 w-5 text-green-400 mr-3" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center text-sm text-blue-100">
                      <Globe className="h-5 w-5 text-green-400 mr-3" />
                      Lifetime access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-8 border border-white/20">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'curriculum', label: 'Curriculum' },
                { id: 'instructor', label: 'Instructor' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Course Overview</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-blue-100 text-lg leading-relaxed mb-6">
                      {course.description}
                    </p>
                    
                    <h3 className="text-xl font-semibold text-white mb-4">What you'll learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {(course.learningObjectives || [
                        'Master the fundamentals',
                        'Build real-world projects',
                        'Understand best practices',
                        'Get industry-ready skills'
                      ]).map((objective, index) => (
                        <li key={index} className="flex items-start text-blue-100">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
                    <ul className="space-y-2">
                      {(course.prerequisites || [
                        'Basic computer skills',
                        'Enthusiasm to learn'
                      ]).map((prereq, index) => (
                        <li key={index} className="flex items-start text-blue-100">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                  <div className="space-y-4">
                    {course.lessons?.map((lesson, index) => (
                      <div key={index} className="border border-white/20 rounded-xl overflow-hidden">
                        <div className="p-4 hover:bg-white/5 transition-colors duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-sm font-medium">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="text-white font-medium">{lesson.title}</h4>
                                <p className="text-blue-200 text-sm">{lesson.description || 'Learn the essentials'}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-blue-200 text-sm">{lesson.duration || 15} min</span>
                              {isEnrolled ? (
                                <PlayCircle className="h-5 w-5 text-green-400" />
                              ) : (
                                <Lock className="h-5 w-5 text-blue-300" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Meet Your Instructor</h2>
                  <div className="flex items-start space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {course.instructor?.name || 'Expert Instructor'}
                      </h3>
                      <p className="text-purple-300 mb-4">{course.instructor?.title || 'Professional Educator'}</p>
                      <p className="text-blue-100 leading-relaxed">
                        {course.instructor?.bio || 'An experienced professional with years of industry experience, dedicated to helping students achieve their learning goals through practical, hands-on education.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-blue-200">Reviews will be shown here once students start rating the course.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="space-y-6">
              {/* Course Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Enrolled Students</span>
                    <span className="text-white font-medium">{course.enrolledStudents?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Course Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-white font-medium">{course.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Last Updated</span>
                    <span className="text-white font-medium">
                      {new Date(course.updatedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Language</span>
                    <span className="text-white font-medium">English</span>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">You might also like</h3>
                <div className="space-y-4">
                  {/* Placeholder for related courses */}
                  <div className="text-center py-8">
                    <BookOpen className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                    <p className="text-blue-200 text-sm">Related courses will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={window.location.href}
        title={course?.title || ''}
      />
    </div>
  );
};

export default CourseDetail;