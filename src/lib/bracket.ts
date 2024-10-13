import type { MatchType, ParticipantType } from "@g-loot/react-tournament-brackets/dist/cjs";
import { TournamentModel, TournamentTeamModel } from './db/tournament';

export const mapNames = [
  '정오',
  '석양',
  '심야',
  '비',
  '성층권',
  '공장',
];

export type ParticipantExt = ParticipantType & {
  clan: string;
  members: string[];
  maps: number[] | null;
  depth: number;
  index: number;

  isThirdMatch: boolean;
}

interface BracketPosition {
  id: number;
  depth: number;
  index: number;

  teamIndex: number;
  /**
   * @summary null이면 LOSE | null일 수 있음. 재확인 필요
   */
  win: boolean | null;
  map: number[];
}

export function getPositionOfCoord(teams: TournamentTeamModel[], depth: number, index: number): BracketPosition | null {
  const len = teams.length;
  const base = { depth, index };

  if (depth === undefined || index === undefined) {
    return null;
  }

  if (depth < 0) {
    return null;
  }

  if (depth === 0) {
    if (index >= len) {
      return null;
    }

    const enemyIndex = index % 2 === 0 ? index + 1 : index - 1;

    return {
      ...base,
      id: teams[index].id,
      teamIndex: index,
      win: teams[index].wins[0] ? true : teams[enemyIndex]?.wins[0] === true ? false : null,
      map: teams[index].maps[0],
    }
  }

  const max = Math.ceil(len / (2 ** depth));
  if (index >= max) {
    return null;
  }

  const left = getPositionOfCoord(teams, depth - 1, index * 2);
  const right = getPositionOfCoord(teams, depth - 1, index * 2 + 1);

  if (left?.win || right?.win) {
    const winner = (left?.win ? left : right) as BracketPosition;
    return {
      ...base,
      id: winner.id,
      teamIndex: winner.teamIndex,
      win: teams[winner.teamIndex].wins[depth] ?? null,
      map: teams[winner.teamIndex].maps[depth],
    }
  }


  return null;
}

export function getEnemyPosition(depth: number, index: number): { depth: number, index: number } {
  return {
    depth,
    index: index % 2 === 0 ? index + 1 : index - 1,
  };
}

/* 1 2 3 4
 * 1   3
 * 1
 */

export function createParticipants(teams: TournamentTeamModel[],): ParticipantExt[] {
  const maxDepth = Math.ceil(Math.log2(teams.length));
  const result: ParticipantExt[] = [];

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const max = Math.ceil(teams.length / (2 ** depth));
    for (let index = 0; index < max; index += 1) {
      const x = getPositionOfCoord(teams, depth, index);

      if (x === null) {
        continue;
      }

      const member = teams[x.teamIndex];
      const item: ParticipantExt = {
        id: x.teamIndex,
        name: `${member.id}`,
        clan: member.clan,
        members: member.members,
        maps: member.maps[depth] ?? null,
        status: '',
        isWinner: x.win ?? false,
        resultText: x.win ? '승' : x.win === false ? '패' : null,
        depth,
        index,
        isThirdMatch: false,
      };

      if (x.win === null) {
        const enemyIndex = index % 2 === 0 ? index + 1 : index - 1;
        const enemyPosition = getPositionOfCoord(teams, depth, enemyIndex);

        if (enemyPosition?.win === true) {
          item.resultText = '패';
        }
      }
      result.push(item);
    }
  }

  return result;
}

export function createMatches(model: TournamentModel): MatchType[] {
  const teams = model.teams;
  const participants = createParticipants(teams);

  const maxDepth = Math.ceil(Math.log2(teams.length));

  const result: MatchType[] = [];
  for (let depth = 0; depth < maxDepth; depth += 1) {
    const count = Math.ceil(teams.length / (2 ** (depth + 1)));
    for (let i = 0; i < count; i += 1) {
      const indices = [
        i * 2,
        i * 2 + 1,
      ].filter(x => x < teams.length)
      const members = indices
        .map(x => participants.find(y => y.depth === depth && y.index === x))
        .filter((x): x is NonNullable<ParticipantExt> => x !== undefined);

      result.push({
        id: depth * teams.length + i,
        name: '',
        startTime: `${members[0]?.status ?? ''}`,
        nextMatchId: depth === maxDepth - 1 ? null : (depth + 1) * teams.length + Math.floor(i / 2),
        tournamentRoundText: '',
        state: '',
        participants: members,
      });
    }
  }

  return result;
}

export function createThirdPlaceMatches(model: TournamentModel): MatchType[] {
  const teams = model.teams;
  const maxDepth = Math.ceil(Math.log2(teams.length));
  const result: MatchType[] = [];


  const positions = [
    getPositionOfCoord(teams, maxDepth - 2, 0),
    getPositionOfCoord(teams, maxDepth - 2, 1),
    getPositionOfCoord(teams, maxDepth - 2, 2),
    getPositionOfCoord(teams, maxDepth - 2, 3),
  ].filter((x): x is BracketPosition => x !== null && !x.win);

  const participants: ParticipantExt[] = positions.map((x, i) => ({
    id: x.teamIndex,
    name: `${teams[x.teamIndex].id}`,
    clan: teams[x.teamIndex].clan,
    members: teams[x.teamIndex].members,
    status: '',
    maps: model.thirdPlaceMaps,
    isWinner: i === model.thirdPlaceWinIndex,
    resultText: model.thirdPlaceWinIndex === -1 ? null : model.thirdPlaceWinIndex === i ? '승' : '패',
    depth: 0,
    index: i,
    isThirdMatch: true,
  }));

  if (participants.length > 2) {
    return [{
      id: 0,
      name: '',
      startTime: '',
      nextMatchId: null,
      tournamentRoundText: '',
      state: '',
      participants: [],
    }];
  }

  result.push({
    id: result.length,
    name: '',
    startTime: '',
    nextMatchId: null,
    tournamentRoundText: '',
    state: '',
    participants,
  });

  return result;

}
