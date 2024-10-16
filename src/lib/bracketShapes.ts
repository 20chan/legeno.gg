import { TournamentV2MatchModel } from './db/tournament_v2';

type ShapeSkel = {
  id: number;
  depth: number;
} & (
    | { match1: number; team1?: undefined; }
    | { team1: number; match1?: undefined; }
  ) & (
    | { match2: number; team2?: undefined; }
    | { team2: number; match2?: undefined; }
  );

// TODO: 언젠가 team1, team2 1부터 시작하게 하기. 지금은 아래 함수에서 함
const bracketShapes: { [count: number]: ShapeSkel[] } = {
  [2]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
  ],
  [3]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 1, depth: 1, match1: 0, team2: 2 },
  ],
  [4]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 1, depth: 0, team1: 2, team2: 3 },
    { id: 100, depth: 1, match1: 0, match2: 1 },
  ],
  [5]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 101, depth: 1, team1: 3, team2: 4 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
  ],
  [6]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 1, depth: 0, team1: 3, team2: 4 },
    { id: 101, depth: 1, match1: 1, team2: 5 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
  ],
  [7]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 1, depth: 0, team1: 2, team2: 3 },
    { id: 2, depth: 0, team1: 4, team2: 5 },
    { id: 100, depth: 1, match1: 0, match2: 1 },
    { id: 101, depth: 1, match1: 2, team2: 6 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
  ],
  [8]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 1, depth: 0, team1: 2, team2: 3 },
    { id: 2, depth: 0, team1: 4, team2: 5 },
    { id: 3, depth: 0, team1: 6, team2: 7 },
    { id: 100, depth: 1, match1: 0, match2: 1 },
    { id: 101, depth: 1, match1: 2, match2: 3 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
  ],
  [9]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 101, depth: 1, team1: 3, team2: 4 },
    { id: 102, depth: 1, team1: 5, team2: 6 },
    { id: 103, depth: 1, team1: 7, team2: 8 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [10]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 101, depth: 1, team1: 3, team2: 4 },
    { id: 102, depth: 1, team1: 5, team2: 6 },
    { id: 1, depth: 0, team1: 7, team2: 8 },
    { id: 103, depth: 1, team1: 9, match2: 1 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [11]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 101, depth: 1, team1: 3, team2: 4 },
    { id: 1, depth: 0, team1: 5, team2: 6 },
    { id: 102, depth: 1, match1: 1, team2: 7 },
    { id: 2, depth: 0, team1: 8, team2: 9 },
    { id: 103, depth: 1, team1: 10, match2: 2 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [12]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 100, depth: 1, match1: 0, team2: 2 },
    { id: 1, depth: 0, team1: 3, team2: 4 },
    { id: 101, depth: 1, match1: 1, team2: 5 },
    { id: 2, depth: 0, team1: 6, team2: 7 },
    { id: 102, depth: 1, match1: 2, team2: 8 },
    { id: 3, depth: 0, team1: 9, team2: 10 },
    { id: 103, depth: 1, match1: 3, team2: 11 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [13]: [
    { id: 100, depth: 1, team1: 0, match2: 0 },
    { id: 0, depth: 0, team1: 1, team2: 2 },
    { id: 1, depth: 0, team1: 3, team2: 4 },
    { id: 2, depth: 0, team1: 5, team2: 6 },
    { id: 101, depth: 1, match1: 1, match2: 2 },
    { id: 102, depth: 1, team1: 7, match2: 3 },
    { id: 3, depth: 0, team1: 8, team2: 9 },
    { id: 4, depth: 0, team1: 10, team2: 11 },
    { id: 103, depth: 1, match1: 4, team2: 12 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [14]: [
    { id: 100, depth: 1, team1: 0, match2: 0 },
    { id: 0, depth: 0, team1: 1, team2: 2 },
    { id: 1, depth: 0, team1: 3, team2: 4 },
    { id: 2, depth: 0, team1: 5, team2: 6 },
    { id: 101, depth: 1, match1: 1, match2: 2 },
    { id: 3, depth: 0, team1: 7, team2: 8 },
    { id: 4, depth: 0, team1: 9, team2: 10 },
    { id: 102, depth: 1, match1: 3, match2: 4 },
    { id: 5, depth: 0, team1: 11, team2: 12 },
    { id: 103, depth: 1, match1: 5, team2: 13 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [15]: [
    { id: 100, depth: 1, team1: 0, match2: 0 },
    { id: 0, depth: 0, team1: 1, team2: 2 },
    { id: 1, depth: 0, team1: 3, team2: 4 },
    { id: 2, depth: 0, team1: 5, team2: 6 },
    { id: 101, depth: 1, match1: 1, match2: 2 },
    { id: 3, depth: 0, team1: 7, team2: 8 },
    { id: 4, depth: 0, team1: 9, team2: 10 },
    { id: 102, depth: 1, match1: 3, match2: 4 },
    { id: 5, depth: 0, team1: 11, team2: 12 },
    { id: 6, depth: 0, team1: 13, team2: 14 },
    { id: 103, depth: 1, match1: 5, match2: 6 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
  [16]: [
    { id: 0, depth: 0, team1: 0, team2: 1 },
    { id: 1, depth: 0, team1: 2, team2: 3 },
    { id: 2, depth: 0, team1: 4, team2: 5 },
    { id: 3, depth: 0, team1: 6, team2: 7 },
    { id: 4, depth: 0, team1: 8, team2: 9 },
    { id: 5, depth: 0, team1: 10, team2: 11 },
    { id: 6, depth: 0, team1: 12, team2: 13 },
    { id: 7, depth: 0, team1: 14, team2: 15 },
    { id: 100, depth: 1, match1: 0, match2: 1 },
    { id: 101, depth: 1, match1: 2, match2: 3 },
    { id: 102, depth: 1, match1: 4, match2: 5 },
    { id: 103, depth: 1, match1: 6, match2: 7 },
    { id: 200, depth: 2, match1: 100, match2: 101 },
    { id: 201, depth: 2, match1: 102, match2: 103 },
    { id: 300, depth: 3, match1: 200, match2: 201 },
  ],
};

export function createMatchesFromShape(count: number): TournamentV2MatchModel[] {
  const shape = bracketShapes[count];

  if (!shape) {
    return [];
  }

  shape.sort((a, b) => a.id - b.id);

  return shape.map(x => {
    const nextMatch = shape.find(y => y.match1 === x.id || y.match2 === x.id);
    const nextMatchIndex = nextMatch === undefined ? null : nextMatch.match1 === x.id ? 0 : 1;
    const mapCount = nextMatch === undefined ? 5 : 3;

    const match: TournamentV2MatchModel = {
      id: x.id,
      shape: {
        depth: x.depth,
        index: x.id % 100,
        mapCount,
        prevMatch1Id: x.match1 ?? null,
        prevMatch2Id: x.match2 ?? null,
        match1TeamId: x.team1 !== undefined ? x.team1 + 1 : null,
        match2TeamId: x.team2 !== undefined ? x.team2 + 1 : null,
        nextMatchId: nextMatch?.id ?? null,
        nextMatchIndex,
      },

      maps: [],
      win: null,
      winner: null,
      loser: null,
      firstPick: null,
    };

    return match;
  });
}