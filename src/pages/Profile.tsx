import { useState, useContext, useRef, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { User, LogOut } from 'lucide-react';
import UserContext from '../context/UserContext';

const Profile = () => {
  const { user, updateUserProfile, logout } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  
  const { name, email, password, confirmPassword } = formData;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
        profileImage?: File;
      } = {};
      
      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;
      if (profileImage) updateData.profileImage = profileImage;
      
      await updateUserProfile(updateData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
      setProfileImage(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
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
        <div className="text-center relative z-10">
          <p className="text-lg text-blue-100">User not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
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
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-8">
          My Profile
        </h1>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
          {!isEditing ? (
            // View Mode
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-32 w-32 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full flex items-center justify-center bg-white/10 border border-white/20">
                      <User size={64} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <dl className="divide-y divide-white/20">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-blue-100">Full name</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{user.name}</dd>
                    </div>
                    
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-blue-100">Email address</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{user.email}</dd>
                    </div>
                    
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-blue-100">Role</dt>
                      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2 capitalize">{user.role}</dd>
                    </div>
                    
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-blue-100">Status</dt>
                      <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-400/20 text-green-400' : 
                          user.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' : 
                          'bg-red-400/20 text-red-400'
                        }`}>
                          {user.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="py-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { logout(); window.location.href = '/login'; }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <div 
                      className="h-32 w-32 rounded-full overflow-hidden cursor-pointer border border-white/20 group-hover:scale-105 transition-transform duration-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-white/10">
                          <User size={64} className="text-white" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-blue-100 hover:text-purple-300 text-center w-full transition-colors duration-300"
                    >
                      Change photo
                    </button>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="space-y-6">
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-white">
                          Full name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-300 group-hover:bg-white/15"
                          required
                        />
                      </div>
                      
                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                          Email address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-300 group-hover:bg-white/15"
                          required
                        />
                      </div>
                      
                      <div className="group">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                          New password (leave blank to keep current)
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={password}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-300 group-hover:bg-white/15"
                          minLength={6}
                        />
                      </div>
                      
                      <div className="group">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                          Confirm new password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={handleChange}
                          className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all duration-300 group-hover:bg-white/15"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        password: '',
                        confirmPassword: '',
                      });
                      setProfileImage(null);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-blue-100 bg-white/10 hover:bg-white/15 hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;