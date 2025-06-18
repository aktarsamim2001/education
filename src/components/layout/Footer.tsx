import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-blue-900 py-12 relative overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-10 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        ></div>
      ))}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              LearningHub
            </h3>
            <p className="text-blue-100 text-base leading-relaxed mb-6 max-w-md">
              Empowering education through innovative technology. Our platform connects passionate students with exceptional instructors, creating meaningful learning experiences that transform lives.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer">
                <Phone className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/courses', label: 'Courses' },
                { to: '/instructors', label: 'Instructors' },
                { to: '/about', label: 'About Us' },
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-blue-100 hover:text-white text-sm transition-all duration-300 group relative inline-block"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Get in Touch
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
            </h4>
            <div className="space-y-4">
              <div className="group">
                <p className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wide">Email</p>
                <a
                  href="mailto:support@learninghub.com"
                  className="text-blue-100 hover:text-white text-sm transition-colors duration-300 block"
                >
                  support@learninghub.com
                </a>
              </div>
              <div className="group">
                <p className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wide">Phone</p>
                <a
                  href="tel:+15551234567"
                  className="text-blue-100 hover:text-white text-sm transition-colors duration-300 block"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="group">
                <p className="text-blue-200 text-xs font-medium mb-1 uppercase tracking-wide">Support Hours</p>
                <p className="text-blue-100 text-sm">
                  Mon - Fri: 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <p className="text-blue-100 text-sm mb-2">
                © {currentYear} LearningHub. All rights reserved.
              </p>
              <p className="text-blue-200 text-xs">
                Transforming education, one student at a time.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a
                href="#"
                className="text-blue-100 hover:text-white text-sm transition-all duration-300 group relative"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white text-sm transition-all duration-300 group relative"
              >
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white text-sm transition-all duration-300 group relative"
              >
                Cookie Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;