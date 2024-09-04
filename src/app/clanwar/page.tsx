import Link from 'next/link';

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

      <div className='mt-10'>
        <p>
          10월 시범 예정
        </p>
        <p>
          자세한건 몰?루
        </p>
      </div>
    </main>
  )
}
