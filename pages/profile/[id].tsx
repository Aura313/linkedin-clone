import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ProfileHeader from '@/components/UserDetails/ProfileHeader';
import UserInfo from '@/components/UserDetails/UserInfo';
import UserPosts from '@/components/UserDetails/UserPosts';
import Modal from '@/components/Modal';
import ProfileEditForm from '@/components/ProfileEditForm';
import { getSession } from 'next-auth/react';

import { User } from '../../types/user';

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const session = getSession();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [loggedInUserId, setloggedInUserId] = useState('');

  const [connectionStatus, setConnectionStatus] = useState('Own');

  session.then((data) => {
    let userIdEx = (data && data.user.id) || '';
    setloggedInUserId(userIdEx);
  });

  const handleSave = async (updatedData: User) => {
    await fetch(`/api/profile?userId=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // On successful update, close the modal and update local user data
        // setIsEditing(false);
        setUserData(updatedData);
      })
      .catch((error) => {
        console.error('Error updating user profile:', error);
        // Handle error appropriately. Maybe show an error notification to the user.
      });

    setIsEditing(false);
    setUserData(updatedData);
  };

  useEffect(() => {
    if (id) {
      // Fetch user data when id is available
      fetch(`/api/profile?userId=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    }
    if (
      loggedInUserId !== undefined &&
      loggedInUserId &&
      id !== loggedInUserId
    ) {
      fetch(
        `/api/connections/status?loggedInUserId=${loggedInUserId}&targetUserId=${id}`
      )
        .then((res) => res.json())
        .then((data) => setConnectionStatus(data.status))
        .catch((error) =>
          console.error('Failed to fetch connection status:', error)
        );
    }
  }, [id, loggedInUserId]);

  const sendConnectionRequest = async () => {
    try {
      const response = await fetch('/api/connections/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: loggedInUserId,
          receiverId: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send connection request');
      }

      const data = await response.json();

      // Assuming your API returns the updated connection status
      setConnectionStatus(data.status);
    } catch (error) {
      console.error(error);
      // Handle the error accordingly. Maybe show a user-friendly error message.
    }
  };

  const renderConnectionButton = () => {
    switch (connectionStatus) {
      case 'NOT_CONNECTED':
        return (
          <button
            className='bg-cyan-900 hover:bg-cyan-800 text-white px-4 py-2 rounded transition duration-150 ease-in-out'
            onClick={sendConnectionRequest}
          >
            Connect
          </button>
        );
      case 'PENDING':
        return (
          <span className='bg-yellow-400 text-white px-4 py-2 rounded'>
            Request Sent
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className='bg-green-500 text-white px-4 py-2 rounded'>
            Connected
          </span>
        );
      case 'REJECTED':
        return (
          <button
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-150 ease-in-out'
            onClick={sendConnectionRequest}
          >
            Reconnect
          </button>
        );
      default:
        return null;
    }
  };

  if (loading) return <p className='text-center text-lg mt-6'>Loading...</p>;

  if (!userData)
    return <p className='text-center text-lg mt-6'>User not found.</p>;

  // console.log('Updated userData:', userData);

  return (
    <div className='container mx-auto mt-8 p-6 bg-white rounded shadow'>
      <ProfileHeader
        profilePic={
          userData.profile?.profilePicUrl || '/assets/userplaceholder.jpeg'
        }
        name={userData.name}
        currentJob={userData.profile?.currentJob || 'No job title'}
        renderConnectionButton={renderConnectionButton}
        isCurrentUser={loggedInUserId === id}
      />
      {id === loggedInUserId && (
        <div className='mt-4 border-t border-gray-200 pt-4 flex justify-end'>
          <button
            onClick={() => setIsEditing(true)}
            className='text-cyan-900 px-4 py-2 rounded-full border border-cyan-900 hover:bg-cyan-800 hover:text-white'
          >
            Edit Profile
          </button>
        </div>
      )}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title='Edit Profile'
      >
        <ProfileEditForm userData={userData} onSave={handleSave} />
      </Modal>
      <div className='mt-6'>
        <UserInfo
          email={userData.email}
          bio={userData.profile?.bio}
          skills={userData.profile?.skills}
          education={userData.profile?.education}
          previousJobs={userData.profile?.previousJobs}
        />
      </div>
      <div className='mt-6 border-t border-gray-200 pt-4'>
        <UserPosts posts={userData.profile?.posts || []} />
      </div>
    </div>
  );
};

export default UserProfile;
