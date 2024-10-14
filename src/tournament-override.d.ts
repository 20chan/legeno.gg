import 'react-tournament-bracket/lib/components/model';
import { TournamentV2MatchModel } from './lib/db/tournament_v2';

declare module 'react-tournament-bracket/lib/components/model' {
  interface SideInfoExt {
    score?: {
      score: number;
    };
    seed?: {
      displayName: string;
      rank: number;
      sourceGame: Game;
      sourcePool: object;
    };
    team?: {
      id: string;
      name: string;
      clan: string;
      members: string[];
    };
  }

  interface Game {
    maps: number[];
    sides: {
      [side in Side]: SideInfoExt;
    };
  }

  interface GameExt extends Game {
    maps: number[];
    sides: {
      [side in Side]: SideInfoExt;
    };
    match: TournamentV2MatchModel;
  }
}