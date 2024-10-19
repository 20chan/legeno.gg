import { Contact } from '@/components/Contact';
import { SignIn } from '@/components/SignIn';
import { authOptions } from '@/lib/auth';
import { TournamentV2Model, createTournament, getTournaments } from '@/lib/db/tournament_v2';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function createNew() {
  'use server'

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return;
  }

  const userId = (session?.user as any).id as string;

  const created = await createTournament(TournamentV2Model.createNew(userId, 16));
  redirect(`/tournaments/${created.id}`);
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  const tournaments = await getTournaments({});

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${`${date.getMonth() + 1}`.padStart(2, '0')}/${`${date.getDate()}`.padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center pt-10 pb-10">
      <Link href='/' className='text-6xl sm:text-7xl font-title'>
        legeno.
        <span className='text-half-red'>gg</span>
      </Link>

      <div className='text-xl sm:text-2xl font-sans mt-5'>
        대회 토너먼트
      </div>

      <div className='flex flex-col items-stretch max-w-[90%] w-[48rem] flex-wrap gap-y-4 mt-8'>
        {tournaments.map(tournament => {
          const ts = new Date(tournament.startDate);
          const isStarted = formatDate(new Date()) === formatDate(ts);
          const isEnded = tournament.matches.every(x => x.winner !== null);

          return (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className={`py-4 px-4 ${isEnded ? 'bg-half-green/70 hover:bg-half-green/50' : 'bg-half-blue/70 hover:bg-half-blue/50'}
            `}>
              <div className='text-2xl font-sans font-bold'>
                {tournament.title}
              </div>

              <div className=''>
                {formatDate(ts)}

                <span>
                  {' '}({isEnded ? '종료' : isStarted ? '진행중' : '예정'})
                </span>
              </div>
            </Link>
          )
        })}

        {
          session?.user && (
            <form action={createNew} className='relative p-4 flex flex-col justify-center items-center bg-half-yellow/70 hover:bg-half-green/50'>
              <input type='submit' className='w-full h-full absolute inset-0 opacity-0 cursor-pointer' />
              <div className='text-2xl font-sans font-bold'>
                새로 생성
              </div>

              <div className=''>
                새로운 토너먼트를 생성합니다.
              </div>
            </form>
          )
        }
      </div>

      {
        session ? (
          <div className='mt-12 text-sm'>
            logged in as {session.user?.name}
          </div>
        ) : (
          <div className='mt-12 w-80 max-w-full'>
            <SignIn className='px-2 pt-5 pb-4 text-xl' footer={(
              <div className='text-xs text-center'>
                로그인 후 토너먼트를 생성할 수 있습니다.
              </div>
            )} />
          </div>
        )
      }

      <div className='absolute bottom-14'>
        <Contact />
      </div>
    </main>
  );
}
