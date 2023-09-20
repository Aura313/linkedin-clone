import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const UserCard = ({ profile }) => {
    const router = useRouter();
  
    return (
      <div 
        className="bg-white shadow rounded p-4 cursor-pointer transition hover:bg-gray-100"
        onClick={() => router.push(`/profile/${profile.userId}`)}
      >
        <img src={profile.profilePicUrl || '/assets/userplaceholder.jpeg'} alt={profile.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-semibold">{profile.name}</h3>
        <p className="text-gray-500">{profile.bio}</p>
        {/* Additional information like skills, current job, etc. can be added here */}
      </div>
    );
  };
  

const UserList = () => {
  // State to hold user profile data
  const [profiles, setProfiles] = useState([]);
  // State to handle loading indication
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile data from the API
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setProfiles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  console.log(profiles, 'ososo');
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className='text-2xl text-cyan-900 mb-4'>All Users</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {profiles.map((profile) => (
              <UserCard key={profile.profile.id} profile={profile.profile} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
