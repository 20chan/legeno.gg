import { TournamentModel } from '@/lib/db/tournament';
import { shuffle } from '@/lib/utils/shuffle';
import { useCallback, useMemo, useState } from 'react';
import type { useRouter } from 'next/navigation'

export function TournamentEditor({
  tournament,
  onEdit,
  onClose,
  router,
}: {
  tournament: TournamentModel;
  onEdit: (tournament: TournamentModel) => void;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {

  const [newTournament, setNewTournament] = useState(tournament);

  const clear = useCallback(() => {
    setNewTournament(x => {
      const teams = x.teams.map(team => ({
        ...team,
        wins: [],
        maps: [],
      }));

      return {
        ...x,
        teams,
        thirdPlaceWinIndex: -1,
        thirdPlaceMaps: [],
      };
    })
  }, [setNewTournament]);

  const shuffleMatch = useCallback(() => {
    setNewTournament(x => {
      const teams = shuffle(x.teams.map(team => ({
        ...team,
        wins: [],
        maps: [],
      })));

      return {
        ...x,
        teams,
        thirdPlaceWinIndex: -1,
        thirdPlaceMaps: [],
      };
    })
  }, [setNewTournament]);

  const sortMatch = useCallback(() => {
    setNewTournament(x => {
      const teams = x.teams.slice().sort((a, b) => a.id - b.id).map(team => ({
        ...team,
        wins: [],
        maps: [],
      }));
      return {
        ...x,
        teams,
        thirdPlaceWinIndex: -1,
        thirdPlaceMaps: [],
      };
    })
  }, [setNewTournament]);

  const teamsSortedById = useMemo(() => {
    return newTournament.teams.slice().sort((a, b) => a.id - b.id);
  }, [newTournament.teams]);

  const deleteTournament = useCallback(() => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      fetch(`/api/tournament/${tournament.id}`, {
        method: 'DELETE',
      }).then(() => {
        router.push('/tournaments');
      });
    }
  }, [tournament.id, router]);

  const setThirdPlaceEnabled = useCallback((enabled: boolean) => {
    setNewTournament(x => {
      return {
        ...x,
        thirdPlaceEnabled: enabled,
      };
    });
  }, [setNewTournament]);

  const shrinkTo8 = useCallback(() => {
    setNewTournament(x => ({
      ...x,
      teams: x.teams.slice(0, 8),
    }));
  }, [setNewTournament]);

  const expandTo16 = useCallback(() => {
    setNewTournament(x => ({
      ...x,
      teams: x.teams.concat(new Array(8).fill(0).map((_, i) => ({
        id: i + 9,
        clan: '',
        members: ['', '', ''],
        maps: [],
        wins: [],
      }))),
    }));
  }, [setNewTournament]);

  return (
    <div className='flex flex-col h-full px-4 py-8 gap-y-4'>
      <div className='text-4xl text-center'>
        토너먼트 수정
      </div>

      <div className='flex flex-row'>
        <div className='w-24 mr-2'>
          대회 이름:
        </div>

        <input
          className='w-80 py-0.5 bg-half-white/10 focus:outline-none px-2 font-mono text-xl'
          value={newTournament.title}
          spellCheck={false}
          onTimeUpdate={e => console.log(e)}
          onChange={e => setNewTournament(x => { return ({ ...x, title: e.target.value }) })}
        />

      </div>

      <div className='flex flex-row'>
        <div className='w-24 mr-2'>
          대회 시작일:
        </div>

        <input
          type='date'
          className='w-80 py-0.5 bg-half-white/10 focus:outline-none px-2 font-mono text-xl'
          defaultValue={(tournament.startDate as unknown as string).slice(0, 10)}
          spellCheck={false}
          onChange={e => {
            const date = new Date(e.target.value);

            if (date.toString() !== 'Invalid Date') {
              setNewTournament(x => { return ({ ...x, startDate: date.toISOString() as any }) });
            }
          }}
        />

      </div>

      <div className='flex flex-row'>
        <div className='flex flex-row'>
          <div className='w-24 mr-2'>
            팀 설정:
          </div>

          <div className='flex flex-col font-sans'>
            <div className='flex flex-row gap-x-4 text-half-white/80'>
              <div className='w-10 text-right'>
                팀
              </div>

              <div className='w-20 text-center'>
                CLAN
              </div>

              <div className='w-36 text-center'>
                팀원1
              </div>

              <div className='w-36 text-center'>
                팀원2
              </div>

              <div className='w-36 text-center'>
                팀원3
              </div>
            </div>
            {
              teamsSortedById.map((team, i) => (
                <div key={i} className='flex flex-row gap-x-4'>
                  <div className='w-10 text-right'>
                    {team.id}팀
                  </div>
                  <input
                    className='w-20 bg-half-white/10 focus:outline-none px-1 font-clan text-yellow-500'
                    value={team.clan}
                    spellCheck={false}
                    onChange={e => {
                      setNewTournament(x => {
                        const teams = x.teams.slice();
                        teams.find(y => y.id === team.id)!.clan = e.target.value;
                        return {
                          ...x,
                          teams,
                        };
                      });
                    }}
                  />
                  <div className='flex flex-row gap-x-4'>
                    {team.members.map((member, j) => (
                      <input key={j}
                        className='w-36 bg-half-white/10 focus:outline-none px-1 font-noto'
                        value={member}
                        spellCheck={false}
                        onChange={e => {
                          setNewTournament(x => {
                            const teams = x.teams.slice();
                            const found = teams.find(y => y.id === team.id)!;

                            found.members[j] = e.target.value;
                            return {
                              ...x,
                              teams,
                            };
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className='flex flex-row ml-8'>
          <div className='w-20 mr-6'>
            매치 순서:
          </div>

          <div className='flex flex-col font-sans'>
            {
              newTournament.teams.map((team, i) => (
                <div key={i} className='flex flex-row gap-x-1'>
                  <button
                    className='bg-half-yellow/50 hover:bg-half-yellow/70 px-2'
                    onClick={() => setNewTournament(x => {
                      const teams = x.teams.slice();
                      const index = teams.indexOf(team);
                      if (index === 0) {
                        return x;
                      }
                      const temp = teams[index - 1];
                      teams[index - 1] = teams[index];
                      teams[index] = temp;
                      return {
                        ...x,
                        teams,
                      };
                    }
                    )}
                  >
                    ↑
                  </button>

                  <button
                    className='bg-half-yellow/50 hover:bg-half-yellow/70 px-2'
                    onClick={() => setNewTournament(x => {
                      const teams = x.teams.slice();
                      const index = teams.indexOf(team);
                      if (index === teams.length - 1) {
                        return x;
                      }
                      const temp = teams[index + 1];
                      teams[index + 1] = teams[index];
                      teams[index] = temp;
                      return {
                        ...x,
                        teams,
                      };
                    }
                    )}
                  >
                    ↓
                  </button>

                  <div className='w-24'>
                    {team.id}팀 {team.clan}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-x-4'>
        <div className='w-20 mr-2'>
          경기 설정:
        </div>

        <button onClick={clear} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          승리 결과 / 맵 전부 초기화
        </button>

        <button onClick={shuffleMatch} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          결과 초기화 + 조 순서 랜덤 추첨
        </button>

        <button onClick={sortMatch} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          결과 초기화 + 조 순서 초기화
        </button>
      </div>

      <div className='flex flex-row gap-x-4'>
        <div className='w-20 mr-2'>
          기타:
        </div>

        <button onClick={deleteTournament} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          대회 삭제
        </button>

        <button onClick={() => setThirdPlaceEnabled(true)} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          3위전 활성화
        </button>

        <button onClick={() => setThirdPlaceEnabled(false)} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          3위전 비활성화
        </button>

        <button onClick={shrinkTo8} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          8팀으로 축소
        </button>

        <button onClick={expandTo16} className='py-2 px-4 bg-half-red/50 hover:bg-half-red/70'>
          16팀으로 확장
        </button>
      </div>

      <div className='flex-1' />

      <div className='flex flex-row justify-center gap-x-8'>
        <button
          onClick={() => setNewTournament(x => { onEdit(x); return x; })}
          className='w-80 bg-half-yellow/50 hover:bg-half-yellow/70 py-4 text-lg'
        >
          적용하기
        </button>
        <button
          onClick={onClose}
          className='w-80 bg-half-yellow/50 hover:bg-half-yellow/70 py-4 text-lg'
        >
          닫기
        </button>
      </div>
    </div>
  )
}