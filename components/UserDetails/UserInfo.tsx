import React from 'react';

interface Props {
  email: string;
  bio?: string;
  skills?: string[];
  education?: string[];
  previousJobs?: string[];
}

const UserInfo: React.FC<Props> = ({ email, bio, skills, education, previousJobs }) => {
    return (
      <div className="p-6 bg-white shadow-sm border border-gray-200 rounded-lg mt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Information</h2>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {email}</p>
        <p className="mt-2 text-gray-700"><span className="font-semibold">Bio:</span> {bio}</p>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Skills</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-700">
            {skills?.length ? skills.map(skill => <li key={skill}>{skill}</li>) : <p> No Skills Added!</p>}
          </ul>
        </div>
        {/* Repeat similar blocks for education and previous jobs */}
      </div>
    );
  }
  

export default UserInfo;
