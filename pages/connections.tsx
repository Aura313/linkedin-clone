import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

const ConnectionRequests: React.FC = () => {
  const [connections, setConnections] = useState([]);
  const router = useRouter();

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const session = getSession();
  const [userId, setUserId] = useState('');
  // const { data: session } = useSession();

  session.then((data) => {
    console.log(data, 'datadatadata');
    let userIdEx = (data && data.user.id) || '';
    setUserId(userIdEx);
  });

  console.log(userId, 'userIduserId');
  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/connections/list?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error(
        'There was a problem with the fetch operation:',
        error.message
      );
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      const response = await fetch('/api/connections/requests');
      const data = await response.json();

      setReceivedRequests(data.receivedRequests);
      setSentRequests(
        data.sentRequests.filter((i: any) => i.status === 'PENDING')
      );
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      // Handle the error accordingly. Maybe show a user-friendly error message.
    }
  };
  useEffect(() => {
    if (userId) {
      fetchConnections();
    }

    fetchConnectionRequests();
  }, [userId]);

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `/api/connections/requests/${requestId}/accept`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        // Filter out the accepted request
        setReceivedRequests((prev) =>
          prev.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `/api/connections/requests/${requestId}/reject`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        // Filter out the rejected request
        setReceivedRequests((prev) =>
          prev.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error rejecting connection request:', error);
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `/api/connections/requests/${requestId}/cancel`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        // Filter out the cancelled request
        setSentRequests((prev) =>
          prev.filter((request) => request.id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error canceling sent connection request:', error);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen p-6 w-1/2  mx-auto'>
      <h2 className='text-2xl text-cyan-900 mb-4'>My Connections</h2>
      <ul className='space-y-4'>
        {connections.length ? connections.map((connection) => (
          <li
            key={connection.id}
            className='bg-white p-4 rounded shadow mx-auto '
          >
            <div className='flex items-center'>
              <img
                src={
                  connection.profile.profilePicUrl ||
                  '/assets/userplaceholder.jpeg'
                }
                alt={connection.name}
                className='w-12 h-12 rounded-full mr-4'
              />
              <a
                href='#'
                className='text-cyan-900 hover:underline'
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/profile/${connection.id}`);
                }}
              >
                {connection.name}
              </a>
            </div>
          </li>
        )): <span> You have no connections yet!</span>}
      </ul>

      <h2 className='text-2xl text-cyan-900 mt-6 mb-4'>
        Received Connection Requests
      </h2>
      <ul className='space-y-4'>
        {receivedRequests.length ? (
          receivedRequests.map((request) => (
            <li
              key={request.id}
              className='bg-white p-4 rounded shadow flex items-center justify-between'
            >
              <div className='flex items-center'>
                <img
                  src={
                    request.sender?.profile.profilePicUrl ||
                    '/assets/userplaceholder.jpeg'
                  }
                  alt={request.sender?.name}
                  className='w-12 h-12 rounded-full mr-4'
                />
                <strong className='text-cyan-900'>
                  {request.sender?.name}
                </strong>
              </div>
              <div className='space-x-2'>
                <button
                  onClick={() => acceptRequest(request.id)}
                  className='bg-cyan-900 hover:bg-cyan-800 text-white py-1 px-3 rounded'
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(request.id)}
                  className='bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded'
                >
                  Reject
                </button>
              </div>
            </li>
          ))
        ) : (
          <span> You have no Pending requests!</span>
        )}
      </ul>

      <h2 className='text-2xl text-cyan-900 mt-6 mb-4'>
        Sent Connection Requests
      </h2>
      <ul className='space-y-4'>
        {sentRequests.length ? (
          sentRequests.map((request) => (
            <li
              key={request.id}
              className='bg-white p-4 rounded shadow flex items-center justify-between'
            >
              <div className='flex items-center'>
                <img
                  src={
                    request.receiver.profile.profilePicUrl ||
                    '/assets/userplaceholder.jpeg'
                  }
                  alt={request.receiver.name}
                  className='w-12 h-12 rounded-full mr-4'
                />
                <span className='text-cyan-900'>{request.receiver.name}</span>
              </div>
              <button
                onClick={() => cancelRequest(request.id)}
                className='bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded'
              >
                Cancel
              </button>
            </li>
          ))
        ) : (
          <span> You have no Sent requests!</span>
        )}
      </ul>
    </div>
  );
};

export default ConnectionRequests;
