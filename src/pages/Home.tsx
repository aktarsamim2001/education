import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { BookOpen, Calendar, Clock, Users, ArrowRight, Star, Play, Award, TrendingUp, ChevronLeft, ChevronRight, Shield, Zap, Globe, HeadphonesIcon, Trophy, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchBanners } from '../store/slices/bannerSlice';
import { fetchFeatures } from '../store/slices/featureSlice';
import { fetchStats } from '../store/slices/statSlice';
import { fetchTestimonials } from '../store/slices/testimonialSlice';
import { fetchFaqs } from '../store/slices/faqSlice';
import { fetchWhyChooseUs } from '../store/slices/whyChooseUsSlice';
import { fetchCourses } from '../store/slices/courseSlice';
import { fetchBlogs } from '../store/slices/blogSlice';
import { fetchWebinars } from '../store/slices/webinarSlice';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  enrolledStudents: string[];
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  authorId: {
    name: string;
    profileImage: string;
  };
  createdAt: string;
}

interface Webinar {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  speaker: {
    name: string;
    profileImage: string;
  };
  attendees: string[];
}

// Add interfaces for new dynamic sections
interface Banner { _id: string; img: string; headline: string; subheadline: string; ctas: any[]; stats: any[]; badge?: { icon: any; text: string }; }
interface Feature { _id: string; title: string; description: string; icon?: string; order?: number; }
interface Stat { _id: string; value: string; label: string; order?: number; }
interface Testimonial { _id: string; img: string; text: string; name: string; title: string; }
interface FAQ { _id: string; question: string; answer: string; order?: number; }
interface WhyChooseUs { _id: string; title: string; description: string; icon?: string; order?: number; }

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux selectors for all dynamic sections
  const banners = useSelector((state: RootState) => state.banners.items);
  const bannersLoading = useSelector((state: RootState) => state.banners.loading);
  const bannersError = useSelector((state: RootState) => state.banners.error);

  const features = useSelector((state: RootState) => state.features.items);
  const stats = useSelector((state: RootState) => state.stats.items);
  const testimonials = useSelector((state: RootState) => state.testimonials.items);
  const faqs = useSelector((state: RootState) => state.faqs.items);
  const whyChooseUs = useSelector((state: RootState) => state.whyChooseUs.items);
  const courses = useSelector((state: RootState) => state.courses.courses);
  const coursesLoading = useSelector((state: RootState) => state.courses.loading);
  const coursesError = useSelector((state: RootState) => state.courses.error);
  const blogs = useSelector((state: RootState) => state.blogs.blogs);
  const blogsLoading = useSelector((state: RootState) => state.blogs.loading);
  const blogsError = useSelector((state: RootState) => state.blogs.error);
  const webinars = useSelector((state: RootState) => state.webinars.webinars);
  const webinarsLoading = useSelector((state: RootState) => state.webinars.loading);
  const webinarsError = useSelector((state: RootState) => state.webinars.error);

  useEffect(() => {
    dispatch(fetchBanners());
    dispatch(fetchFeatures());
    dispatch(fetchStats());
    dispatch(fetchTestimonials());
    dispatch(fetchFaqs());
    dispatch(fetchWhyChooseUs());
    dispatch(fetchCourses());
    dispatch(fetchBlogs());
    dispatch(fetchWebinars());
  }, [dispatch]);

  if (bannersLoading) {
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
        <div className="flex flex-col items-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-r-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-blue-100 font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  if (bannersError) {
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
        <div className="text-center bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl relative z-10">
          <div className="text-red-400 text-lg font-semibold mb-4">{bannersError}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Full-width Banner Slider Section with Hero Content */}
      <section className="relative w-full min-h-screen overflow-hidden ">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={900}
          loop={true}
          navigation={{ prevEl: ".banner_prev", nextEl: ".banner_next" }}
          className="w-full min-h-screen"
        >
          {banners.length > 0 ? banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <div className="relative w-full min-h-screen flex items-center justify-center">
                <img
                  src={banner.img}
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover object-center z-0 brightness-75"
                />
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center h-full">
                  {banner.badge && (
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                      {banner.badge.icon && <span className="mr-2">{banner.badge.icon}</span>}
                      {banner.badge.text}
                    </div>
                  )}
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    {banner.headline}
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                    {banner.subheadline}
                  </p>
                  {/* Optionally render CTAs and stats if available */}
                </div>
              </div>
            </SwiperSlide>
          )) : <SwiperSlide><div className="min-h-screen flex items-center justify-center text-white">No banners available</div></SwiperSlide>}
        </Swiper>
        {/* Custom Navigation Buttons */}
        <button className="banner_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-20">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="banner_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-20">
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Why Choose Our Educational Platform */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Trophy className="w-4 h-4 mr-2 text-orange-400" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Why Choose Our Educational Platform?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover what makes us the preferred choice for professionals and students worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.length > 0 ? whyChooseUs.map((item) => (
              <div key={item._id} className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 transition-all duration-300 transform hover:scale-105 hover:bg-white/15">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  {/* Optionally render icon if available */}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-blue-100 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )) : <div className="text-white">No features available</div>}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8">
            {stats.length > 0 ? stats.map((stat) => (
              <div className="text-center" key={stat._id}>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            )) : <div className="text-white col-span-4">No stats available</div>}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Featured Courses
              </h2>
              <p className="text-xl text-blue-100">Discover our most popular and highly-rated courses</p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative mb-8">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              navigation={{
                prevEl: ".courses_prev",
                nextEl: ".courses_next",
              }}
            >
              {courses.length > 0 ? courses.map((course) => (
                <SwiperSlide key={course._id}>
                  <Link
                    to={`/courses/${course._id}`}
                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 block"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={course.thumbnail || 'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg'}
                        alt={course.title || 'Course thumbnail'}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-400/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold">
                          Bestseller
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-white ml-1">{course.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {course.title || 'Untitled Course'}
                      </h3>
                      <p className="text-blue-100 mb-4 line-clamp-2 leading-relaxed">
                        {course.description || 'No description available.'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-4 w-4 mr-2 text-white" />
                          <span className="text-sm">{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-4 w-4 mr-2 text-white" />
                          <span className="text-sm">12 weeks</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">
                          ₹{course.price?.toLocaleString() || '0'}
                        </span>
                        <div className="flex items-center text-green-400 bg-green-400/20 px-3 py-1 rounded-full">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span className="text-sm font-semibold">Popular</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )) : <SwiperSlide><div className="min-h-screen flex items-center justify-center text-white">No courses available</div></SwiperSlide>}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="courses_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="courses_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center md:hidden">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Latest Insights
              </h2>
              <p className="text-xl text-blue-100">Stay updated with industry trends and expert knowledge</p>
            </div>
            <Link
              to="/blogs"
              className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative mb-8">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              navigation={{
                prevEl: ".blogs_prev",
                nextEl: ".blogs_next",
              }}
            >
              {blogs.length > 0 ? blogs.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 block"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={blog.thumbnail || 'https://images.pexels.com/photos/3243/pen-notebook-notes-studying.jpg'}
                        alt={blog.title || 'Blog thumbnail'}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-indigo-400/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {blog.title || 'Untitled Blog'}
                      </h3>
                      <p className="text-blue-100 mb-6 line-clamp-3 leading-relaxed">
                        {blog.content || 'No content available.'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={blog.authorId?.profileImage || 'https://placehold.co/40'}
                            alt={blog.authorId?.name || 'Author'}
                            className="h-10 w-10 rounded-full mr-3 object-cover border border-white/20"
                          />
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              {blog.authorId?.name || 'Unknown Author'}
                            </span>
                            <span className="text-xs text-blue-100">Author</span>
                          </div>
                        </div>
                        <span className="text-sm text-blue-100 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                          {blog.createdAt && !isNaN(new Date(blog.createdAt).getTime())
                            ? format(new Date(blog.createdAt), 'MMM d, yyyy')
                            : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )) : <SwiperSlide><div className="min-h-screen flex items-center justify-center text-white">No blogs available</div></SwiperSlide>}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="blogs_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="blogs_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center md:hidden">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Live Webinars
              </h2>
              <p className="text-xl text-blue-100">Join live sessions with industry experts</p>
            </div>
            <Link
              to="/webinars"
              className="hidden md:inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Webinars
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative mb-8">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              speed={1000}
              loop={true}
              navigation={{
                prevEl: ".webinars_prev",
                nextEl: ".webinars_next",
              }}
            >
              {webinars.length > 0 ? webinars.map((webinar) => (
                <SwiperSlide key={webinar._id}>
                  <Link
                    to={`/webinars/${webinar._id}`}
                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 block"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-400/20 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            Live Soon
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-400/20 text-blue-400">
                            Free
                          </span>
                        </div>
                        <div className="flex items-center text-blue-100 bg-white/10 border border-white/20 px-3 py-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-4 w-4 mr-2 text-white" />
                          <span className="font-semibold">{webinar.attendees?.length || 0}</span>
                          <span className="ml-1">registered</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                        {webinar.title || 'Untitled Webinar'}
                      </h3>
                      
                      <p className="text-blue-100 mb-6 text-lg leading-relaxed line-clamp-3">
                        {webinar.description || 'No description available.'}
                      </p>
                      
                      <div className="flex items-center mb-6">
                        <img
                          src={webinar.speaker?.profileImage || 'https://placehold.co/60'}
                          alt={webinar.speaker?.name || 'Speaker'}
                          className="h-12 w-12 rounded-full mr-4 object-cover border border-white/20"
                        />
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {webinar.speaker?.name || 'Expert Speaker'}
                          </p>
                          <p className="text-blue-100">Industry Expert & Trainer</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xl">
                        <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="h-5 w-5 mr-2 text-white" />
                          <span className="font-semibold">
                            {webinar.startTime && !isNaN(new Date(webinar.startTime).getTime())
                              ? format(new Date(webinar.startTime), 'PPp')
                              : 'Unknown date'}
                          </span>
                        </div>
                        <div className="flex items-center text-blue-100 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-5 w-5 mr-2 text-white" />
                          <span className="font-semibold">{webinar.duration || 60} mins</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          to={`/webinars/${webinar._id}`}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Register Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )) : <SwiperSlide><div className="min-h-screen flex items-center justify-center text-white">No webinars available</div></SwiperSlide>}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="webinars_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="webinars_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center md:hidden">
            <Link
              to="/webinars"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Webinars
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Slider) */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              What Our Learners Say
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Success Stories & Testimonials
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Hear from professionals and students who have transformed their careers with us.
            </p>
          </div>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            speed={1000}
            loop={true}
            navigation={{ prevEl: ".testimonials_prev", nextEl: ".testimonials_next" }}
          >
            {testimonials.length > 0 ? testimonials.map((t) => (
              <SwiperSlide key={t._id}>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 flex flex-col items-center text-center max-w-xl mx-auto">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-blue-500/30" />
                  <p className="text-blue-100 mb-4 italic">“{t.text}”</p>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-blue-200 text-sm">{t.title}</div>
                </div>
              </SwiperSlide>
            )) : <SwiperSlide><div className="text-white">No testimonials available</div></SwiperSlide>}
          </Swiper>
          {/* Custom Navigation Buttons */}
          <button className="testimonials_prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="testimonials_next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 z-10">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
              Got Questions? We’ve Got Answers
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Find answers to the most common questions about our platform, courses, and support.
            </p>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join over 50,000 professionals who have advanced their careers with our expert-led courses. 
              Start your journey today with a free trial.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Browse Courses
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-blue-200 mb-4">Trusted by professionals from</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-white font-bold text-lg">Google</div>
              <div className="text-white font-bold text-lg">Microsoft</div>
              <div className="text-white font-bold text-lg">Amazon</div>
              <div className="text-white font-bold text-lg">Meta</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      {faqs.length > 0 ? faqs.map((faq, idx) => (
        <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
          <button
            className="w-full flex justify-between items-center p-6 focus:outline-none"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            aria-expanded={openIdx === idx}
          >
            <span className="font-bold text-white text-left">{faq.question}</span>
            <ChevronRight className={`w-6 h-6 text-blue-200 transition-transform duration-300 ${openIdx === idx ? 'rotate-90' : ''}`} />
          </button>
          {openIdx === idx && (
            <div className="px-6 pb-6 text-blue-100 animate-fadeIn">
              {faq.answer}
            </div>
          )}
        </div>
      )) : <div className="text-white">No FAQs available</div>}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
}

export default Home;