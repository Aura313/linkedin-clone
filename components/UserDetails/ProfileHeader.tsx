import React from 'react';

interface Props {
  profilePic?: string;
  name: string;
  currentJob?: string;
  renderConnectionButton: () => any;
}

const ProfileHeader: React.FC<Props> = ({ profilePic, name, currentJob, renderConnectionButton }) => {
  return (
    <div className="flex items-center space-x-4 p-6 bg-white shadow-sm border border-gray-200 rounded-lg">
      <img src={profilePic || '/default-profile-pic.jpg'} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
        <p className="text-gray-600 text-sm mt-1">{currentJob}</p>
      </div>
      {renderConnectionButton()}
    </div>
  );
}


export default ProfileHeader;
