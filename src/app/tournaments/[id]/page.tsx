'use client';

import { Bracket } from '@/components/Bracket';
import { TournamentContext } from '@/components/TournamentProvider';
import type { TournamentModel } from '@/lib/db/tournament';
import { getFinalRanks, updateMap, updateWin } from '@/lib/tournamentHelper';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

export default function TournamentPage({ params }: {
  params: { id: string },
}) {
  const { id } = params;

  const [tournament, setTournament] = useState<TournamentModel | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/tournament/${id}`);
      if (!resp.ok) {
        router.push('/tournaments');
      }

      const data = await resp.json();
      setTournament(data.tournament);
      setIsOwner(data.isOwner);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!tournament || !session?.user) {
        return;
      }

      await fetch(`/api/champ/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ tournament }),
      });
    })();
  }, [tournament]);

  const winHandler = useCallback((depth: number, index: number, isThirdMatch: boolean) => {
    setTournament(x => {
      if (!x || !session?.user) {
        return x;
      }
      return updateWin(x, { depth, index, isThirdMatch })
    });
  }, [setTournament]);

  const mapHandler = useCallback((depth: number, index: number, count: number, isThirdMatch: boolean) => {
    setTournament(x => {
      if (!x || !session?.user) {
        return x;
      }
      return updateMap(x, { depth, index, count, isThirdMatch })
    })
  }, [setTournament]);

  const finalRanks = useMemo(() => {
    return tournament ? getFinalRanks(tournament) : [];
  }, [tournament]);

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-10 pb-10 bg-half-black text-half-white">
      <Link href='/' className='text-6xl sm:text-7xl font-title'>
        legeno.
        <span className='text-half-red'>gg</span>
      </Link>

      <div className='text-xl sm:text-3xl font-sans mt-5 mb-5 sm:mb-0 text-half-yellow'>
        {tournament?.title}
      </div>

      {
        (isEditing && tournament) && (
          <div className='absolute inset-0 z-50 bg-black/80 flex flex-col justify-center items-center'>
            <div className='bg-half-black w-2/3 h-4/5'>
            </div>
          </div>
        )
      }

      <div className='relative max-w-full overflow-scroll'>
        <TournamentContext.Provider value={{
          mapHandler,
          winHandler,
        }}>
          {
            tournament && (
              <Bracket model={tournament} />
            )
          }
        </TournamentContext.Provider>
      </div>

      <div className=' sm:fixed sm:right-4 sm:bottom-4 z-10'>
        <div className='flex flex-row items-end'>
          <div className='mr-4 text-lg sm:text-2xl'>
            {
              tournament && finalRanks.map(x => {
                const team = tournament.teams.find(y => y.id === x.id)!;
                return (
                  <div key={x.id}>
                    <span className={classNames('font-bold mr-2.5 w-12 inline-block', {
                      'text-yellow-500': x.rank === 1,
                      'text-[silver]': x.rank === 2,
                      'text-amber-600': x.rank === 3,
                      'text-half-white/60': x.rank === 4,
                    })}>
                      {x.rank}등:
                    </span>
                    <span className='font-clan mr-3 text-yellow-500 sm:w-[4.5rem] inline-block text-right'>
                      {team.clan}
                    </span>

                    <span className={classNames({
                      'place-gold': x.rank === 1,
                      'place-silver': x.rank === 2,
                      'text-amber-600': x.rank === 3,
                      'text-half-white/60': x.rank === 4,
                    })}>
                      {team.members.join(' ')}
                    </span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </main>
  )
}
