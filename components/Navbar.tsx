import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const router = useRouter();
  const session = getSession();
  const [userId, setUserId] = useState('');
  // const { data: session } = useSession();

  session.then((data) => {
    // console.log(, 'wlsdkwdk');
    let userIdEx = (data && data.user.id) || '';
    setUserId(userIdEx);
  });

  // const handleLogout = async () => {
  //   const response = await fetch('/api/auth/signOut', {
  //     method: 'POST',
  //   });

  //   if (response.ok) {
  //     // Optionally clear any frontend state or local storage entries related to the user
  //     // Navigate the user to the homepage or login page after logging out
  //     router.push('/');
  //   } else {
  //     console.error('Failed to log out');
  //   }
  // };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // <-- Use signOut here with an optional callback URL
  };

  // useEffect(() => {})

  return (
    <nav className='bg-cyan-900 shadow-sm'>
      <div className='container mx-auto px-4 py-2 flex justify-between items-center'>
        <h1 className='text-xl font-semibold text-white flex items-center space-x-2'>
          {/* <img
            src='/path-to-logo-icon.png'
            alt='Mini LinkedIn Logo'
            className='w-8 h-8'
          />{' '} */}
          {/* Add the path to your logo or LinkedIn's logo if you have it */}
          <Link href="/">Mini LinkedIn</Link>
        </h1>
        {userId && (
          <div className='flex items-center space-x-4'>
            <Link
              href={`/feed/`}
              className='text-white hover:bg-cyan-800 p-2 px-4 rounded transition duration-150'
            >
              Feed
            </Link>
            <Link
              href={`/profile/${userId}`}
              className='text-white hover:bg-cyan-800 p-2 px-4 rounded transition duration-150'
            >
              Profile
            </Link>

            <Link
              href={`/connections`}
              className='text-white hover:bg-cyan-800 p-2 px-4 rounded transition duration-150'
            >
              Connections
            </Link>
            <button
              onClick={handleLogout}
              className='text-white hover:bg-cyan-800 p-2 px-4 rounded transition duration-150'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
