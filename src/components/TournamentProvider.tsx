import { createContext, useContext } from 'react';

type TournamentContextProps = {
  winHandler: (matchId: number, teamId: number, thirdPlace: boolean) => void;
  mapHandler: (matchId: number, count: number, thirdPlace: boolean) => void;
  pickHandler: (matchId: number, thirdPlace: boolean) => void;
};

export const TournamentContext = createContext<TournamentContextProps>({
  winHandler: () => { },
  mapHandler: () => { },
  pickHandler: () => { },
});

export const useTournamentContext = () => {
  return useContext(TournamentContext);
}
