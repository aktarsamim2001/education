import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  Calendar,
  Video,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  fetchEnrolledCourses,
  fetchCertificates,
  fetchRecommendedCourses,
  fetchQuizResults,
  fetchUpcomingWebinars,
} from '../../store/slices/studentSlice';
import type { AppDispatch, RootState } from '../../store/store';

const StudentDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    enrolledCourses,
    certificates,
    recommendedCourses,
    quizResults,
    upcomingWebinars,
    loading,
    error,
  } = useSelector((state: RootState) => state.student);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
    dispatch(fetchCertificates());
    dispatch(fetchRecommendedCourses());
    dispatch(fetchQuizResults());
    dispatch(fetchUpcomingWebinars());
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              label: 'Enrolled Courses',
              value: enrolledCourses?.length || 0,
            },
            {
              icon: Award,
              label: 'Certificates Earned',
              value: certificates?.length || 0,
            },
            {
              icon: Clock,
              label: 'Learning Hours',
              value: enrolledCourses?.reduce((acc, course) => {
                return acc + (course.courseId?.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0);
              }, 0) || 0,
            },
            {
              icon: Star,
              label: 'Average Progress',
              value: `${Math.round(
                enrolledCourses?.reduce((acc, course) => acc + (course.progress || 0), 0) /
                  (enrolledCourses?.length || 1)
              )}%`,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-100 truncate">
                        {stat.label}
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Courses */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Your Courses
                </h3>
                <Link
                  to="/courses"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors duration-300"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1 text-white" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses?.map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={enrollment.courseId?.thumbnail || 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg'}
                      alt={enrollment.courseId?.title || 'Course thumbnail'}
                      className="h-48 w-full object-cover border-b border-white/20"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-medium text-white">
                        {enrollment.courseId?.title || 'Untitled Course'}
                      </h4>
                      <div className="mt-2 flex items-center">
                        <img
                          src={enrollment.courseId?.instructorId?.profileImage || 'https://placehold.co/40'}
                          alt={enrollment.courseId?.instructorId?.name || 'Instructor'}
                          className="h-6 w-6 rounded-full border border-white/20"
                        />
                        <span className="ml-2 text-sm text-blue-100">
                          {enrollment.courseId?.instructorId?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-blue-100">
                          <span>Progress</span>
                          <span>{enrollment.progress || 0}%</span>
                        </div>
                        <div className="mt-1 w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${enrollment.courseId?._id}`}
                        className="mt-4 block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Your Certificates
              </h3>
              <div className="space-y-4">
                {certificates?.map((certificate) => (
                  <div
                    key={certificate._id}
                    className="group flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {certificate.courseId?.title || 'Untitled Course'}
                      </h4>
                      <p className="text-sm text-blue-100">
                        Completed on {certificate.completedAt && !isNaN(new Date(certificate.completedAt).getTime())
                          ? format(new Date(certificate.completedAt), 'PP')
                          : 'Unknown date'}
                      </p>
                    </div>
                    <a
                      href={certificate.certificateUrl || '#'}
                      download
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <Download className="h-4 w-4 mr-2 text-white" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Upcoming Webinars
                </h3>
                <Link
                  to="/webinars"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors duration-300"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1 text-white" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingWebinars?.map((webinar) => (
                  <div
                    key={webinar._id}
                    className="group flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <Video className="h-8 w-8 text-white" />
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-white">
                          {webinar.title || 'Untitled Webinar'}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-white" />
                          <span className="ml-1 text-sm text-blue-100">
                            {webinar.startTime && !isNaN(new Date(webinar.startTime).getTime())
                              ? format(new Date(webinar.startTime), 'PPp')
                              : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/webinars/${webinar._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    >
                      Join
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Results */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Recent Quiz Results
              </h3>
              <div className="space-y-4">
                {quizResults?.map((result, index) => (
                  <div
                    key={index}
                    className="group bg-white/10 border border-white/20 p-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <h4 className="text-sm font-medium text-white">
                      {result.courseTitle || 'Untitled Course'}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {result.results?.map((quiz, quizIndex) => (
                        <div
                          key={quizIndex}
                          className="flex items-center justify-between text-sm text-blue-100"
                        >
                          <span>Quiz {quizIndex + 1}</span>
                          <span className="font-medium text-white">
                            {quiz.totalQuestions
                              ? Math.round((quiz.score / quiz.totalQuestions) * 100)
                              : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;