import Link from 'next/link'

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-10">
      <div className='text-7xl sm:text-9xl font-title'>
        legeno.
        <span className='text-half-red'>gg</span>
      </div>

      <div className='text-lg sm:text-xl font-sans mt-5'>
        스매시 레전드 유저 주최 대회/토너먼트
      </div>

      <div className='flex flex-col items-center flex-wrap gap-y-4 mt-8 w-full'>
        <Link href='/tournaments' className='flex flex-col justify-center items-center w-96 max-w-[90%] py-2 bg-half-yellow/70 hover:bg-half-yellow/50'>
          <div className='text-4xl sm:text-5xl mb-1 font-title'>
            tournaments
          </div>

          <div className='text-lg'>
            일반 대회/토너먼트
          </div>
        </Link>

        <Link href='/clanwar' className='flex flex-col justify-center items-center w-96 max-w-[90%] py-2 bg-half-yellow/70 hover:bg-half-yellow/50'>
          <div className='text-4xl sm:text-5xl mb-1 font-title'>
            clan war
          </div>

          <div className='text-lg'>
            2024 클랜전
          </div>
        </Link>

      </div>
    </main>
  )
}
