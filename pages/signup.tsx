import { useState } from 'react';
import { useRouter } from 'next/router';

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Call your signup API
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data, 'daatta');
    if (response.ok) {
      // After a successful signup:
      router.push('/login?from=signup');
    } else {
      // Handle errors from the server
      console.error(data.error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='p-6 bg-white rounded shadow-md w-96'>
        <h1 className='text-2xl mb-5 text-black font-mono'>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm mb-2 text-black' htmlFor='name'>
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='p-2 w-full border rounded text-gray-600'
              required
            />
          </div>
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
