import { TournamentV2Model } from './db/tournament_v2';
import { mapInfos } from './sl/map';
import { shuffle } from './utils/shuffle';

export function updateWin(model: TournamentV2Model, input: {
  matchId: number;
  teamId: number;
  isThirdMatch: boolean;
}): TournamentV2Model {
  const { matchId, teamId, isThirdMatch } = input;
  if (isThirdMatch) {
    return {
      ...model,
      options: {
        ...model.options,
        thirdPlaceWinId: model.options.thirdPlaceWinId === teamId ? null : teamId,
      },
    };
  }

  const matches = model.matches.slice();

  const match = matches.find(x => x.id === matchId)!;
  match.winner = teamId;

  const prevMatch1 = matches.find(x => x.id === match.shape.prevMatch1Id);
  const prevMatch2 = matches.find(x => x.id === match.shape.prevMatch2Id);

  const team1 = match.shape.match1TeamId ?? prevMatch1?.winner ?? null;
  const team2 = match.shape.match2TeamId ?? prevMatch2?.winner ?? null;

  if (team1 === teamId) {
    if (match.win === 0) {
      match.win = null;
      match.winner = null;
      match.loser = null;
    } else {
      match.win = 0;
      match.loser = team2;
    }
  } else {
    if (match.win === 1) {
      match.win = null;
      match.winner = null;
      match.loser = null;
    } else {
      match.win = 1;
      match.loser = team1;
    }
  }

  return {
    ...model,
    matches,
  };
}

export function updateMap(model: TournamentV2Model, input: {
  matchId: number;
  count: number;
  isThirdMatch: boolean;
}): TournamentV2Model {
  const { matchId, count, isThirdMatch } = input;

  const maps = shuffle([...mapInfos]).slice(0, count).map(x => x.id);
  if (isThirdMatch) {
    return {
      ...model,
      options: {
        ...model.options,
        thirdPlaceMaps: maps,
      },
    };
  }

  const matches = model.matches.slice();
  const match = matches.find(x => x.id === matchId)!;
  match.maps = maps;

  return {
    ...model,
    matches,
  };
}

export function updateFirstPick(model: TournamentV2Model, input: {
  matchId: number;
  isThirdMatch: boolean;
}): TournamentV2Model {
  const { matchId, isThirdMatch } = input;

  if (isThirdMatch) {
    return {
      ...model,
      options: {
        ...model.options,
        thirdPlaceFirstPick: Math.random() < 0.5 ? 0 : 1,
      },
    };
  }

  const matches = model.matches.slice();
  const match = matches.find(x => x.id === matchId)!;
  if (match.firstPick !== null) {
    match.firstPick = null;
  } else {
    match.firstPick = Math.random() < 0.5 ? 0 : 1;
  }

  return {
    ...model,
    matches,
  };
}

export function getThirdMatch(model: TournamentV2Model) {
  const finalMatch = model.matches.find(x => x.shape.nextMatchId === null)!;

  const match0 = model.matches.find(x => x.id === finalMatch.shape.prevMatch1Id)!;
  const match1 = model.matches.find(x => x.id === finalMatch.shape.prevMatch2Id)!;

  const result: Array<number | null> = [];

  if (match0.win === null) {
    result.push(null);
  } else {
    const loser = model.teams.find(x => x.id === match0.loser);
    result.push(loser?.id ?? null);
  }

  if (match1.win === null) {
    result.push(null);
  } else {
    const loser = model.teams.find(x => x.id === match1.loser);
    result.push(loser?.id ?? null);
  }

  return result;
}

export function getFinalRanks(model: TournamentV2Model): Array<{ id: number, rank: number }> {
  const matches = model.matches;
  const teams = model.teams;

  const finalMatch = matches.find(x => x.shape.nextMatchId === null)!;

  const winner = teams.find(x => x.id === finalMatch.winner)!;
  const loser = teams.find(x => x.id === finalMatch.loser)!;

  const result = finalMatch.winner === null ? [] : [
    { id: winner.id, rank: 1 },
    { id: loser.id, rank: 2 },
  ];

  if (model.options.thirdPlaceEnabled && model.options.thirdPlaceWinId !== null) {
    const thirdMatchTeamIds = getThirdMatch(model) as number[];

    const thirdPlaceId = model.options.thirdPlaceWinId;
    const fourthPlaceId = model.options.thirdPlaceWinId === thirdMatchTeamIds[0] ? thirdMatchTeamIds[1] : thirdMatchTeamIds[0];

    result.push({ id: thirdPlaceId, rank: 3 });
    result.push({ id: fourthPlaceId, rank: 4 });
  }

  return result;
}