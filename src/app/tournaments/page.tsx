import { getTournaments } from '@/lib/db/tournament';
import Link from 'next/link';

export default async function Page() {
  const tournaments = await getTournaments({});
  tournaments.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return (
    <main className="flex min-h-screen flex-col items-center mt-10 pb-10">
      <Link href='/' className='text-6xl sm:text-7xl font-title'>
        legeno.
        <span className='text-half-red'>gg</span>
      </Link>

      <div className='text-lg sm:text-xl font-sans mt-5'>
        대회 토너먼트
      </div>

      <div className='flex flex-col items-stretch max-w-[90%] w-[48rem] flex-wrap gap-y-4 mt-8'>
        {tournaments.map(tournament => {
          const isEnded = tournament.thirdPlaceEnabled;

          return (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className={`py-4 px-4 ${isEnded ? 'bg-half-green/70 hover:bg-half-green/50' : 'bg-half-yellow/70 hover:bg-half-yellow/50'}
            `}>
              <div className='text-2xl font-sans font-bold'>
                {tournament.title}
              </div>

              <div className=''>
                {tournament.startDate.toLocaleDateString()}

                <span>
                  {' '}({isEnded ? '종료' : '진행중'})
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  );
}
