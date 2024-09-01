import { createContext, useContext } from 'react';

type TournamentContextProps = {
  winHandler: (depth: number, index: number, thirdPlace: boolean) => void;
  mapHandler: (depth: number, index: number, count: number, thirdPlace: boolean) => void;
};

export const TournamentContext = createContext<TournamentContextProps>({
  winHandler: () => { },
  mapHandler: () => { },
});

export const useTournamentContext = () => {
  return useContext(TournamentContext);
}
