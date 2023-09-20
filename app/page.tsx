import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex items-center justify-between p-48'>
      <div className=' flex w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='flex-row'>
          <h1 className='text-3xl'>Welcome to Mini LinkedIn Clone!</h1>
          <div className='mt-6'>
            <Link className='underline text-lg' href='/login'> Login </Link> &nbsp; &nbsp;
            <Link className='underline text-lg' href='/signup'> Signup </Link>
          </div>
        </div>

        <Image
          src='/assets/dxf91zhqd2z6b0bwg85ktm5s4.svg'
          alt='LL Logo'
          width={500}
          height={200}
          priority
        />
      </div>
    </main>
  );
}
