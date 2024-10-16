'use client';

import { TournamentContext } from '@/components/TournamentProvider';
import type { TournamentV2Model } from '@/lib/db/tournament_v2';
import { getFinalRanks, updateMap, updateWin } from '@/lib/tournamentHelper_v2';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BracketV2, SLGame } from '@/components/Bracket_v2';
import { useSocket } from '@/components/SocketProvider';
import { GameExt } from 'react-tournament-bracket/lib/components/model';
import { createMatchGame } from '@/lib/game_v2';

export default function TournamentPage({ params }: {
  params: { id: string },
}) {
  const { id } = params;

  const [tournament, setTournament] = useState<TournamentV2Model | null>(null);
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
    })();
  }, [router, id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(`tournament:${id}`, (data: { tournament: TournamentV2Model }) => {
      setTournament(data.tournament);
    });

    return () => {
      socket.off(`tournament:${id}`);
    };
  }, [id, socket]);

  const currentGame = useMemo((): GameExt | null => {
    if (!tournament) {
      return null;
    }

    const { matches } = tournament;
    const currentMatch = matches.find(match => match.win === null) ?? matches.find(match => match.shape.nextMatchId === null);

    if (!currentMatch) {
      return null;
    }

    const game = createMatchGame(tournament, currentMatch.id);
    if (game.sides.home.seed) {
      game.sides.home.seed = undefined;
    }
    if (game.sides.visitor.seed) {
      game.sides.visitor.seed = undefined;
    }

    return game;
  }, [tournament]);

  const winHandler = () => { };
  const mapHandler = () => { };
  const pickHandler = () => { };

  return (
    <main className=''>
      <div className='relative max-w-full overflow-x-auto'>
        <TournamentContext.Provider value={{
          mapHandler,
          winHandler,
          pickHandler,
        }}>
          {
            currentGame && (
              <SLGame x={0} y={-12} game={currentGame} customViewBox='0 12 350 82' homeOnTop={true} />
            )
          }
        </TournamentContext.Provider>
      </div>
    </main>
  )
}
