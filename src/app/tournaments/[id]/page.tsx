'use client';

import { TournamentContext } from '@/components/TournamentProvider';
import type { TournamentV2Model } from '@/lib/db/tournament_v2';
import { getFinalRanks, updateFirstPick, updateMap, updateWin } from '@/lib/tournamentHelper_v2';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { TournamentEditor } from './TournamentEditor';
import { BracketV2 } from '@/components/Bracket_v2';
import { useSocket } from '@/components/SocketProvider';
import Image from 'next/image';
import { tierInfos } from '@/lib/sl/tier';

export default function TournamentPage({ params }: {
  params: { id: string },
}) {
  const { id } = params;

  const [tournament, setTournament] = useState<TournamentV2Model & { modified: boolean } | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const { socket } = useSocket();

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
  }, [router, id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(`tournament:${id}`, (data: { tournament: TournamentV2Model }) => {
      if (tournament) {
        const currentRanks = getFinalRanks(tournament!);
        const newRanks = getFinalRanks(data.tournament);

        if (currentRanks.length < 4 && newRanks.length === 4) {
          setIsShowResult(true);
        }
      }

      setTournament({
        ...data.tournament,
        modified: false,
      });
    });

    return () => {
      socket.off(`tournament:${id}`);
    };
  }, [id, isOwner, tournament, socket]);

  useEffect(() => {
    (async () => {
      if (!tournament || !session?.user || !isOwner) {
        return;
      }
      if (!tournament.modified) {
        return;
      }

      await fetch(`/api/tournament/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournament }),
      });
    })();
  }, [id, session?.user, isOwner, tournament]);

  const winHandler = useCallback((matchId: number, teamId: number, isThirdMatch: boolean) => {
    setTournament(x => {
      if (!x || !session?.user) {
        return x;
      }
      return {
        ...updateWin(x, { matchId, teamId, isThirdMatch }),
        modified: true,
      };
    });
  }, [session?.user, setTournament]);

  const mapHandler = useCallback((matchId: number, count: number, isThirdMatch: boolean) => {
    setTournament(x => {
      if (!x || !session?.user) {
        return x;
      }
      return {
        ...updateMap(x, { matchId, count, isThirdMatch }),
        modified: true,
      };
    })
  }, [session?.user, setTournament]);

  const pickHandler = useCallback((matchId: number, isThirdMatch: boolean) => {
    setTournament(x => {
      if (!x || !session?.user) {
        return x;
      }

      return {
        ...updateFirstPick(x, { matchId, isThirdMatch }),
        modified: true,
      };
    });
  }, [session?.user, setTournament]);

  const tournamentOnEdit = useCallback((tournament: TournamentV2Model) => {
    setTournament({
      ...tournament,
      modified: true,
    });
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

      <div className='relative max-w-full overflow-x-auto'>
        <TournamentContext.Provider value={{
          mapHandler,
          winHandler,
          pickHandler,
        }}>
          {
            tournament && (
              <BracketV2 model={tournament} />
            )
          }
        </TournamentContext.Provider>
      </div>

      {
        tournament && finalRanks.length > 0 && (
          <div className='fixed bottom-0 mx-auto'>
            <button onClick={() => setIsShowResult(x => !x)} className='bg-half-red/70 hover:bg-half-red/50 px-4 py-2 min-w-96 w-96 sm:w-full'>
              경기 결과 {isShowResult ? '닫기' : '열기'}
            </button>

            {
              isShowResult && (
                <div className='bg-half-black border-half-red/70 border-2 px-10 py-4 sm:text-2xl gap-4'>
                  {
                    finalRanks.map(x => {
                      const team = tournament.teams.find(y => y.id === x.id)!;
                      return (
                        <div key={x.id} className='flex flex-row gap-2'>
                          <span className={classNames('font-noto mr-1 w-16 inline-block')}>
                            <Image alt="" src={tierInfos[x.rank - 1]} width={64} height={64} />
                          </span>

                          <div className='flex flex-col'>
                            <div className='font-clan text-yellow-500 inline-block'>
                            {team.clan}
                            </div>

                            <div className={classNames('font-noto -mt-2 flex flex-row gap-2', {
                              'place-gold': x.rank === 1,
                              'place-silver': x.rank === 2,
                              'text-amber-600': x.rank === 3,
                              'text-half-white/60': x.rank === 4,
                            })}>
                              {team.members.map(y => <span key={y}>{y}</span>)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        )
      }

      <div className='absolute bottom-4 right-4'>
        {
          isOwner && (
            <button onClick={() => setIsEditing(x => !x)} className='bg-half-yellow/70 hover:bg-half-yellow/50 px-4 py-2 rounded'>
              대회 설정
            </button>
          )
        }
      </div>

      {
        (isEditing && tournament) && (
          <div className='absolute inset-0 z-50 bg-black/80 flex flex-col justify-center items-center'>
            <div className='bg-half-black w-[80rem] max-w-full'>
              <TournamentEditor
                tournament={tournament}
                onEdit={tournamentOnEdit}
                onClose={() => setIsEditing(false)}
                router={router}
              />
            </div>
          </div>
        )
      }
    </main>
  )
}
