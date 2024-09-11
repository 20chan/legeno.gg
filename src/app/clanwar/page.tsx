import { Contact } from '@/components/Contact';
import Link from 'next/link';
import Image from 'next/image';
import logoImage from './logo.png';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-10 pb-10">
      <Link href='/' className='text-6xl sm:text-7xl font-title'>
        legeno.
        <span className='text-half-red'>gg</span>
      </Link>

      <div className='text-xl sm:text-2xl font-sans mt-5'>
        클랜전
      </div>

      <Image src={logoImage} alt='logo' width={300} height={310} className='mt-16' />

      <div className='mt-10'>
        <p>
          10월 시범 예정
        </p>
        <p>
          자세한건 몰?루
        </p>
      </div>

      <div className='absolute bottom-14'>
        <Contact />
      </div>
    </main>
  )
}
