import { getEnemyPosition, getPositionOfCoord } from './bracket';
import type { TournamentModel } from './db/tournament';
import { mapInfos } from './sl/map';
import { shuffle } from './utils/shuffle';

export function updateWin(model: TournamentModel, input: {
  depth: number;
  index: number;
  isThirdMatch: boolean;
}): TournamentModel {
  const { depth, index, isThirdMatch } = input;
  const teams = model.teams.slice();

  if (isThirdMatch) {
    if (model.thirdPlaceWinIndex === index) {
      model.thirdPlaceWinIndex = -1;
    } else {
      model.thirdPlaceWinIndex = index;
    }
    return {
      ...model,
    };
  }

  if (depth === 0) {
    const team = teams[index];
    team.wins[0] = !team.wins[0];
  } else {
    const teamId = getPositionOfCoord(teams, depth, index)?.id;
    if (!teamId) {
      return model;
    }

    const team = teams.find(x => x.id === teamId)!;
    if (team.wins[depth] === true) {
      team.wins = new Array<boolean>(depth).fill(true);
    } else {
      team.wins[depth] = !team.wins[depth];
    }
  }

  return {
    ...model,
    teams,
  };
}

export function updateMap(model: TournamentModel, input: {
  depth: number;
  index: number;
  count: number;
  isThirdMatch: boolean;
}): TournamentModel {
  const { depth, index, count, isThirdMatch } = input;
  const teams = model.teams.slice();

  const maps = shuffle([...mapInfos]).slice(0, count).map(x => x.id);

  if (isThirdMatch) {
    model.thirdPlaceMaps = maps;
    return {
      ...model,
    };
  }

  if (depth === 0) {
    const team = teams[index];
    team.maps[depth] = maps;

    const enemy = getEnemyPosition(depth, index);
    teams[enemy.index].maps[depth] = maps;
  } else {
    const teamId = getPositionOfCoord(teams, depth, index)?.id;
    const enemyCoord = getEnemyPosition(depth, index);
    const enemyId = getPositionOfCoord(teams, enemyCoord.depth, enemyCoord.index)?.id;
    if (!teamId || !enemyId) {
      return model;
    }

    const team = teams.find(x => x.id === teamId)!;
    team.maps[depth] = maps;

    const enemy = teams.find(x => x.id === enemyId)!;
    enemy.maps[depth] = maps;
  }

  return {
    ...model,
    teams,
  };
}

export function getFinalRanks(model: TournamentModel) {
  const maxDepth = Math.ceil(Math.log2(model.teams.length));

  const firstMatches = [
    getPositionOfCoord(model.teams, maxDepth - 1, 0),
    getPositionOfCoord(model.teams, maxDepth - 1, 1),
  ].filter(x => x !== null);

  const isFirstPlaceMatchEnd = firstMatches.length === 2;
  const isThirdPlaceMatchEnd = model.thirdPlaceWinIndex !== -1;

  const result: { id: number, rank: number }[] = [];
  if (isFirstPlaceMatchEnd) {
    const winner = firstMatches.find(x => x?.win)
    const loser = firstMatches.find(x => !x?.win)

    if (winner && loser) {
      result.push({ id: winner.id, rank: 1 });
      result.push({ id: loser.id, rank: 2 });
    }
  }

  if (isThirdPlaceMatchEnd) {
    const positions = [
      getPositionOfCoord(model.teams, maxDepth - 2, 0),
      getPositionOfCoord(model.teams, maxDepth - 2, 1),
      getPositionOfCoord(model.teams, maxDepth - 2, 2),
      getPositionOfCoord(model.teams, maxDepth - 2, 3),
    ].filter(x => x !== null && !x.win);

    if (positions.length === 2) {
      result.push({ id: positions[0]!.id, rank: 3 });
      result.push({ id: positions[1]!.id, rank: 4 });
    }
  }

  return result;
}
