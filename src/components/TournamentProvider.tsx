import { createContext, useContext } from 'react';

type TournamentContextProps = {
  winHandler: (matchId: number, teamId: number, thirdPlace: boolean) => void;
  mapHandler: (matchId: number, count: number, thirdPlace: boolean) => void;
};

export const TournamentContext = createContext<TournamentContextProps>({
  winHandler: () => { },
  mapHandler: () => { },
});

export const useTournamentContext = () => {
  return useContext(TournamentContext);
}
