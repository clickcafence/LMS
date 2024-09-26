import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='py-4'>
      <div className='container'>
      <p className='text-center mt-2'>
          <Link href="/request-teacher">
           Request for a Teacher
          </Link>
        </p>
        <p className='text-center text-sm text-gray-500'>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
  
      </div>
    </footer>
  );
}
