import { Game, GameExt } from 'react-tournament-bracket/lib/components/model';
import { TournamentV2Model } from './db/tournament_v2';

function createMatchGame(model: TournamentV2Model, matchId: number): GameExt {
  const match = model.matches.find(x => x.id === matchId)!;

  const getTeam1 = () => {
    if (match.shape.match1TeamId !== null) {
      return match.shape.match1TeamId;
    } else if (match.shape.prevMatch1Id !== null) {
      const prevMatch = model.matches.find(x => x.id === match.shape.prevMatch1Id)!;

      if (prevMatch.winner !== null) {
        return prevMatch.winner;
      } else {
        return null;
      }
    }
    return null;
  };
  const getTeam2 = () => {
    if (match.shape.match2TeamId !== null) {
      return match.shape.match2TeamId;
    } else if (match.shape.prevMatch2Id !== null) {
      const prevMatch = model.matches.find(x => x.id === match.shape.prevMatch2Id)!;

      if (prevMatch.winner !== null) {
        return prevMatch.winner;
      } else {
        return null;
      }
    }
    return null;
  };

  const team1 = model.teams.find(x => x.id === getTeam1());
  const team2 = model.teams.find(x => x.id === getTeam2());

  return {
    id: match.id.toString(),
    name: '',
    scheduled: 0,
    sides: {
      home: {
        seed: match.shape.prevMatch1Id !== null ? {
          sourceGame: createMatchGame(model, match.shape.prevMatch1Id!),
          displayName: '',
          rank: 1,
          sourcePool: {},
        } : undefined,
        team: team1 ? {
          id: team1.id.toString(),
          name: team1.name,
          clan: team1.clan,
          members: team1.members,
        } : undefined,
        score: {
          score: match.win === 0 ? 1 : 0,
        },
      },
      visitor: {
        seed: match.shape.prevMatch2Id !== null ? {
          sourceGame: createMatchGame(model, match.shape.prevMatch2Id!),
          displayName: '',
          rank: 1,
          sourcePool: {},
        } : undefined,
        team: team2 ? {
          id: team2.id.toString(),
          name: team2.name,
          clan: team2.clan,
          members: team2.members,
        } : undefined,
        score: {
          score: match.win === 1 ? 1 : 0,
        },
      },
    },
    maps: match.maps,
    match,
  };
}

export function createGame(model: TournamentV2Model): Game {
  const finalMatch = model.matches.find(x => x.shape.nextMatchId === null)!;

  return createMatchGame(model, finalMatch.id);
}