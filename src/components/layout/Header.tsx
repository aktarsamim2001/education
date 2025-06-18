import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, BookOpen, Video, PenTool, Home, Phone } from 'lucide-react';
import UserContext from '../../context/UserContext';
import NotificationBadge from '../notifications/NotificationBadge';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/webinars', label: 'Webinars', icon: Video },
    { path: '/blogs', label: 'Blog', icon: PenTool },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <header className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 bg-opacity-90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-white" />
                LearningHub
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'border-purple-500 text-white'
                        : 'border-transparent text-blue-100 hover:text-purple-300 hover:border-white/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2 text-white" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative flex items-center space-x-4">
                {/* Desktop User Menu */}
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                  {user && user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="relative">
                      <NotificationBadge />
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive('/dashboard')
                        ? 'text-purple-300'
                        : 'text-blue-100 hover:text-purple-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-blue-100 hover:text-purple-300 flex items-center space-x-1 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-blue-100 hover:text-purple-300 flex items-center space-x-1 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110">
                      <LogOut className="h-5 w-5 text-white" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-100 hover:text-purple-300 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-purple-300 focus:outline-none transition-colors duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'border-purple-500 text-white bg-white/20'
                      : 'border-transparent text-blue-100 hover:bg-white/15 hover:border-white/50 hover:text-purple-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2 text-white" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-white/20">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-100 hover:bg-white/15 hover:border-white/50 hover:text-purple-300 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-100 hover:bg-white/15 hover:border-white/50 hover:text-purple-300 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-100 hover:bg-white/15 hover:border-white/50 hover:text-purple-300 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-100 hover:bg-white/15 hover:border-white/50 hover:text-purple-300 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 border-purple-500 text-base font-medium text-white bg-white/20 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;