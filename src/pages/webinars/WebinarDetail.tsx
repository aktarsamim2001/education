import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { 
  Video, 
  Clock, 
  Users, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  Edit, 
  Star,
  Award,
  Share2,
  BookOpen,
  Target,
  CheckCircle,
  MapPin,
  Globe,
  Download,
  Heart,
  MessageCircle,
  ArrowLeft,
  PlayCircle,
  User,
  Mail
} from 'lucide-react';
import { fetchWebinarById, registerForWebinar, deleteWebinar } from '../../store/slices/webinarSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { toast } from 'react-toastify';
import ShareModal from '../../components/ShareModal';

// Static fallback data for UI elements
const staticData = {
  rating: 4.9,
  learningOutcomes: [
    'Master compound components and render props patterns',
    'Implement advanced state management techniques',
    'Optimize React application performance',
    'Use React DevTools for debugging and profiling',
    'Apply best practices for scalable React architecture'
  ],
  prerequisites: [
    'Good understanding of React fundamentals',
    'Experience with JavaScript ES6+',
    'Basic knowledge of TypeScript (helpful but not required)'
  ],
  agenda: [
    {
      time: '14:00 - 14:15',
      topic: 'Welcome & Introduction',
      description: 'Overview of advanced React patterns and session outline'
    },
    {
      time: '14:15 - 14:45',
      topic: 'Compound Components',
      description: 'Building flexible and reusable component APIs'
    },
    {
      time: '14:45 - 15:15',
      topic: 'Performance Optimization',
      description: 'Memoization, code splitting, and profiling techniques'
    },
    {
      time: '15:15 - 15:30',
      topic: 'Q&A & Wrap-up',
      description: 'Interactive discussion and next steps'
    }
  ],
  resources: [
    { name: 'Session Slides', type: 'pdf', url: '#' },
    { name: 'Code Examples', type: 'github', url: '#' },
    { name: 'Reading List', type: 'doc', url: '#' }
  ],
  defaultSpeakerBio: 'Experienced software architect with extensive knowledge in modern web development and React ecosystem. Passionate about sharing knowledge and helping developers grow their skills.'
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const WebinarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { webinar, loading, error } = useSelector((state) => state.webinars);
  const authState = useSelector((state) => state.auth) || {};
  const user = authState.user;

  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchWebinarById(id));
    }
  }, [dispatch, id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(registerForWebinar(id)).unwrap();
      toast.success('Successfully registered for the webinar!');
    } catch (error) {
      toast.error(error.message || 'Failed to register for webinar');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this webinar?')) {
      try {
        await dispatch(deleteWebinar(id)).unwrap();
        toast.success('Webinar deleted successfully');
        navigate('/webinars');
      } catch (error) {
        toast.error(error.message || 'Failed to delete webinar');
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {[...Array(50)].map((_, i) => (
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 border-r-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {[...Array(50)].map((_, i) => (
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
        <div className="text-red-400 relative z-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Webinar Not Found</h2>
          <p>{error || 'The webinar you\'re looking for doesn\'t exist.'}</p>
          <button 
            onClick={() => navigate('/webinars')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Back to Webinars
          </button>
        </div>
      </div>
    );
  }

  const webinarDate = new Date(webinar.startTime);
  const isUpcoming = webinarDate > new Date();
  const isOrganizer = user && (user._id === webinar.speaker?._id || user.role === 'admin');
  const isRegistered = user && webinar.attendees.includes(user._id);
  const registrationPercentage = (webinar.attendees.length / (webinar.maxAttendees || 200)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      {[...Array(50)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/webinars')}
                className="flex items-center text-blue-200 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Webinars
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isLiked ? 'text-red-400 bg-red-400/20' : 'text-blue-200 hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-blue-200 hover:text-white transition-colors duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                {isOrganizer && (
                  <>
                    <button 
                      onClick={() => navigate(`/webinars/edit/${webinar._id}`)}
                      className="p-2 rounded-full text-blue-200 hover:text-purple-300 transition-colors duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="p-2 rounded-full text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Section */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isUpcoming ? 'bg-green-400/20 text-green-400' : 'bg-gray-400/20 text-gray-400'
                      }`}>
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-400/20 text-purple-300">
                        {webinar.level || 'Intermediate'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-400/20 text-blue-300">
                        {webinar.category || 'Development'}
                      </span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                      {webinar.title || 'Untitled Webinar'}
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {webinar.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Users className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{webinar.attendees.length || 0}</div>
                    <div className="text-sm text-blue-200">Registered</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Clock className="h-6 w-6 text-purple-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{webinar.duration || 90}</div>
                    <div className="text-sm text-blue-200">Minutes</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Star className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{staticData.rating}</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Globe className="h-6 w-6 text-green-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{webinar.language || 'English'}</div>
                    <div className="text-sm text-blue-200">Language</div>
                  </div>
                </div>

                {/* Speaker */}
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <img
                    src={webinar.speaker?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
                    alt={webinar.speaker?.name || 'Speaker'}
                    className="h-16 w-16 rounded-full border-2 border-white/30"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{webinar.speaker?.name || 'Unknown Speaker'}</h3>
                    <p className="text-blue-200">{webinar.speaker?.role || 'Professional Speaker'} {webinar.speaker?.company ? `at ${webinar.speaker.company}` : ''}</p>
                    <p className="text-sm text-blue-300">{webinar.speaker?.experience || '5+ years'} experience</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white/10 rounded-lg text-blue-200 hover:text-white transition-colors duration-300">
                      <User className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/10 rounded-lg text-blue-200 hover:text-white transition-colors duration-300">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
                <div className="flex border-b border-white/20">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'agenda', label: 'Agenda', icon: Calendar },
                    { id: 'resources', label: 'Resources', icon: Download },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                        activeTab === id
                          ? 'bg-white/10 text-white border-b-2 border-purple-400'
                          : 'text-blue-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">About This Webinar</h3>
                        <p className="text-blue-100 leading-relaxed mb-6">
                          {webinar.longDescription || webinar.description || 'This webinar will provide valuable insights and practical knowledge on the topic.'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">What You'll Learn</h3>
                        <div className="space-y-3">
                          {staticData.learningOutcomes.map((outcome, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-100">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
                        <div className="space-y-3">
                          {staticData.prerequisites.map((prereq, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Target className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <span className="text-blue-100">{prereq}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Speaker Bio</h3>
                        <p className="text-blue-100 leading-relaxed mb-4">
                          {webinar.speaker?.bio || staticData.defaultSpeakerBio}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(webinar.speaker?.expertise || webinar.tags || ['React', 'JavaScript', 'Web Development']).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'agenda' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Session Agenda</h3>
                      {staticData.agenda.map((item, index) => (
                        <div key={index} className="flex space-x-4 p-4 bg-white/5 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">{item.topic}</h4>
                              <span className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded text-sm">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-blue-100">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Session Resources</h3>
                      <div className="grid gap-4">
                        {staticData.resources.map((resource, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Download className="h-5 w-5 text-blue-300" />
                              <div>
                                <h4 className="text-white font-medium">{resource.name}</h4>
                                <p className="text-sm text-blue-200 capitalize">{resource.type} file</p>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Registration Card */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {webinar.price === 0 || !webinar.price ? 'Free' : `$${webinar.price}`}
                    </div>
                    {(webinar.price === 0 || !webinar.price) && (
                      <p className="text-green-400 text-sm">No cost to attend</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-300" />
                      <div>
                        <p className="text-white font-medium">
                          {webinar.startTime && !isNaN(webinarDate.getTime()) ? formatDate(webinar.startTime) : 'Date TBD'}
                        </p>
                        <p className="text-blue-200 text-sm">
                          {webinar.startTime && webinar.endTime && !isNaN(webinarDate.getTime()) ? 
                            `${formatTime(webinar.startTime)} - ${formatTime(webinar.endTime)}` : 
                            'Time TBD'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-purple-300" />
                      <div>
                        <p className="text-white font-medium">Online Event</p>
                        <p className="text-blue-200 text-sm">Join from anywhere</p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-200">Registration</span>
                      <span className="text-white">{webinar.attendees.length}/{webinar.maxAttendees || 200}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${registrationPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-300 mt-1">
                      {Math.round(registrationPercentage)}% full
                    </p>
                  </div>

                  {/* Registration Button */}
                  {isUpcoming ? (
                    isRegistered ? (
                      <div className="space-y-4">
                        <div className="bg-green-400/20 border border-green-400/30 rounded-lg p-4 text-center">
                          <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                          <p className="text-green-400 font-medium">You're registered!</p>
                          <p className="text-green-300 text-sm mt-1">Check your email for the link</p>
                        </div>
                        {webinar.link && (
                          <a
                            href={webinar.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                          >
                            <PlayCircle className="h-5 w-5" />
                            <span>Join Webinar</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleRegister}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <Users className="h-5 w-5" />
                        <span>Register Now</span>
                      </button>
                    )
                  ) : (
                    <div className="bg-gray-400/20 border border-gray-400/30 rounded-lg p-4 text-center">
                      <p className="text-gray-400">This webinar has ended</p>
                      {webinar.recordingUrl && (
                        <a
                          href={webinar.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-blue-300 hover:text-white transition-colors duration-300"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Watch Recording
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {(webinar.tags || ['React', 'JavaScript', 'Performance', 'Patterns']).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-400/20 text-blue-300 rounded-full text-sm hover:bg-blue-400/30 transition-colors duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Share This Webinar</h3>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleShare}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    <button className="px-4 py-2 bg-white/10 text-blue-200 rounded-lg hover:text-white hover:bg-white/20 transition-all duration-300">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          shareUrl={window.location.href}
          title={webinar?.title || ''}
        />
      </div>
    </div>
  );
};

export default WebinarDetail;