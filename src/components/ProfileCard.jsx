import React from 'react';
import { Facebook, Linkedin, Mail, Twitter } from 'lucide-react';

const ProfileCard = ({ user }) => {
  const isActive = user?.status === 'active';

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0 sm:space-x-6">
      {/* Profile Image & Info */}
      <div className="relative flex items-center space-x-4">
        {/* Status Badge (Mobile) */}
        <span
          className={`absolute -top-3 -left-3 px-3 py-1 text-xs font-medium rounded-full ${
            isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          } sm:hidden`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>

        <div className={`rounded-full p-1 ${isActive ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400'}`}>
          <img
            src="https://i.pravatar.cc/150?img=43"
            alt="User Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-gray-100 shadow-md"
          />
        </div>

        <div>
          <h2 className="font-bold text-lg capitalize sm:text-xl text-gray-800">
            {user?.fullName || 'Anonymous User'}
          </h2>
          <p className="text-sm text-gray-500">Seen 50 minutes ago</p>
        </div>
      </div>

      {/* Status Badge (Desktop) */}
      <div className="hidden sm:flex sm:items-center sm:justify-center">
        <span
          className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base shadow-sm ${
            isActive ? 'bg-green-500 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Social Media Section */}
      <div className="flex flex-col items-center sm:items-end">
        <span className="text-xs text-gray-500 mb-2">Connect</span>
        <div className="flex space-x-3">
          <a
            href="#"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
          >
            <Twitter size={18} />
          </a>
          <a
            href="#"
            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full transition"
          >
            <Facebook size={18} />
          </a>
          <a
            href="#"
            className="bg-[#0077b5] hover:bg-[#005f91] text-white p-2 rounded-full transition"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="#"
            className="bg-gray-600 hover:bg-gray-800 text-white p-2 rounded-full transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
