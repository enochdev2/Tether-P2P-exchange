import { Facebook, Linkedin, Mail, Twitter } from 'lucide-react';
import React from 'react';

const ProfileCard = ({user}) => {
  return (
    <div className="flex items-center justify-between bg-white shadow-lg rounded-lg p-6">
      {/* Profile image */}
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/100" // Add user's avatar
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover bg-[#26a17b]"
        />
        <div className="ml-4">
          <h2 className="font-semibold text-lg">
            {user?.fullName}
          </h2>
          <p className="text-sm text-gray-600">Seen 50 minutes ago</p>
        </div>
      </div>

      {/* Feedback */}
      <div className="flex items-center space-x-4">
        {user?.status == "active" ? 
        (<div className="flex items-center space-x-2">
          <span className="bg-[#26a17b] text-green-100 px-3 py-2 font-bold rounded-full text-base">
            Active
          </span>
        </div>) :
        (<div className="flex items-center space-x-2">
          <span className="bg-red-600 text-red-100 px-5 py-2 rounded-full font-bold text-base">
            InActive
          </span>
        </div>)
        
      }
      </div>

      {/* Social Media Links */}
       <div className="flex space-x-3">
      <a href="#" className="text-blue-500">
        <Twitter size={24} />
      </a>
      <a href="#" className="text-blue-700">
        <Facebook size={24} className='' />
      </a>
      <a href="#" className="text-gray-700">
        <Linkedin size={24} />
      </a>
      <a href="#" className="text-gray-600">
        <Mail size={24} />
      </a>
    </div>
    </div>
  );
};

export default ProfileCard;
