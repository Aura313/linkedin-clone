import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

const Login = () => {
  const router = useRouter();
  const fromSignup = router.query.from === "signup";


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn('credentials', {
      email: formData.email,
      password: formData.password,
      callbackUrl: `/feed`
    });
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      {fromSignup && <p className="text-2xl mb-6 font-mono"> You have successfully signed up! Please Login below to continue! :) </p>}
      <div className='p-6 bg-white rounded shadow-md w-96'>
        <h1 className='text-2xl mb-5 text-black font-mono'>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm mb-2 text-black' htmlFor='email'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='p-2 w-full border rounded text-gray-600'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm mb-2 text-black' htmlFor='password'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='p-2 w-full border rounded text-gray-600'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full p-2 bg-cyan-900 hover:bg-cyan-800  text-white rounded-full'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
