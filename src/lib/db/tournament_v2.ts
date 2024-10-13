import type { TournamentV2 } from '@prisma/client';
import { TournamentModel } from './tournament';
import { createMatchesFromShape } from '../bracketShapes';
import { createParticipants, getPositionOfCoord } from '../bracket';

export interface TournamentV2Model {
  id: string;
  createdAt: Date;
  startDate: Date;
  userId: string;

  title: string;

  teams: TournamentV2TeamModel[];
  matches: TournamentV2MatchModel[];

  options: {
    thirdPlaceEnabled: boolean;
    thirdPlaceWinIndex: number;
    thirdPlaceMaps: number[];
  };
}

export interface TournamentV2TeamModel {
  id: number;
  clan: string;
  members: string[];
  name: string;
}

export interface TournamentV2MatchModel {
  id: number;

  shape: {
    depth: number;
    index: number | null;

    mapCount: number;

    prevMatch1Id: number | null;
    prevMatch2Id: number | null;

    prevMatch1Win: boolean | null;
    prevMatch2Win: boolean | null;

    match1TeamId: number | null;
    match2TeamId: number | null;

    nextMatchId: number | null;
    nextMatchIndex: number | null;
  }

  maps: number[];
  win: number | null;
  winner: number | null;
  loser: number | null;
}

export namespace TournamentV2Model {
  export function serialize(model: TournamentV2Model): TournamentV2 {
    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teamsSerialized: JSON.stringify(model.teams),
      matchesSerialized: JSON.stringify(model.matches),
      optionsSerialized: JSON.stringify(model.options),
    };
  }

  export function deserialize(model: TournamentV2): TournamentV2Model {
    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teams: JSON.parse(model.teamsSerialized),
      matches: JSON.parse(model.matchesSerialized),
      options: JSON.parse(model.optionsSerialized),
    };
  }

  export function migrateFromV1(model: TournamentModel): TournamentV2Model {
    const matches = createMatchesFromShape(model.teams.length);
    const participants = createParticipants(model.teams);

    matches.forEach((match, i) => {
      const index0 = match.id % 100 * 2;
      const index1 = index0 + 1;
      const team0 = participants.find(x => x.depth === match.shape.depth && x.index === index0)!;
      const team1 = participants.find(x => x.depth === match.shape.depth && x.index === index1)!;

      if (match.shape.match1TeamId !== null) {
        match.shape.match1TeamId = model.teams[match.shape.match1TeamId - 1].id;
      }
      if (match.shape.match2TeamId !== null) {
        match.shape.match2TeamId = model.teams[match.shape.match2TeamId - 1].id;
      }

      if (team0.isWinner) {
        match.win = 0;
        match.winner = parseInt(team0.name!);
        match.loser = parseInt(team1.name!);
      } else if (team1.isWinner) {
        match.win = 1;
        match.winner = parseInt(team1.name!);
        match.loser = parseInt(team0.name!);
      }

      match.maps = team0.maps ?? team1.maps ?? [];
    });

    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teams: model.teams.map(x => ({
        id: x.id,
        clan: x.clan,
        members: x.members,
        name: '',
      })),
      matches,
      options: {
        thirdPlaceEnabled: model.thirdPlaceEnabled,
        thirdPlaceWinIndex: model.thirdPlaceWinIndex,
        thirdPlaceMaps: model.thirdPlaceMaps,
      },
    };
  }
}