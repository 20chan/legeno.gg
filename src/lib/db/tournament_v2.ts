import type { TournamentV2 } from '@prisma/client';
import { TournamentModel } from './tournament';
import { createMatchesFromShape } from '../bracketShapes';
import { createParticipants, getPositionOfCoord } from '../bracket';
import { prisma } from '../prisma';
import { getFinalRanks } from '../tournamentHelper';

type CreateAction<T> = T | Omit<T, 'id' | 'createdAt' | 'startDate'>;

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
    thirdPlaceWinId: number | null;
    thirdPlaceFirstPick: number | null;
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

    match1TeamId: number | null;
    match2TeamId: number | null;

    nextMatchId: number | null;
    nextMatchIndex: number | null;
  }

  firstPick: number | null;
  maps: number[];
  win: number | null;
  winner: number | null;
  loser: number | null;
}

export namespace TournamentV2Model {
  export function createNew(userId: string, count: number): CreateAction<TournamentV2Model> {
    return {
      title: '',
      userId,
      teams: new Array(count).fill(0).map((_, i) => ({
        id: i + 1,
        clan: '',
        members: ['', '', ''],
        name: '',
      })),
      matches: createMatchesFromShape(count),
      options: {
        thirdPlaceEnabled: true,
        thirdPlaceFirstPick: null,
        thirdPlaceWinId: null,
        thirdPlaceMaps: [],
      },
    }
  }

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

  export function serializeCreate(model: CreateAction<TournamentV2Model>): CreateAction<TournamentV2> {
    return {
      userId: model.userId,
      title: model.title,
      teamsSerialized: JSON.stringify(model.teams),
      matchesSerialized: JSON.stringify(model.matches),
      optionsSerialized: JSON.stringify(model.options),
    };
  }

  export function deserialize(model: TournamentV2): TournamentV2Model {
    const options = JSON.parse(model.optionsSerialized);
    if (options.thirdPlaceFirstPick === undefined) {
      options.thirdPlaceFirstPick = null;
    }

    const matches = JSON.parse(model.matchesSerialized) as TournamentV2MatchModel[];
    matches.forEach(match => {
      if (match.firstPick === undefined) {
        match.firstPick = null;
      }
    });

    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teams: JSON.parse(model.teamsSerialized),
      matches,
      options,
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

    const finalRank = getFinalRanks(model);

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
        thirdPlaceWinId: finalRank[2]?.id ?? null,
        thirdPlaceFirstPick: null,
        thirdPlaceMaps: model.thirdPlaceMaps,
      },
    };
  }
}

export async function getTournaments(options: { take?: number }): Promise<TournamentV2Model[]> {
  const found = await prisma.tournamentV2.findMany({
    take: options.take,
    orderBy: {
      createdAt: 'asc',
    },
  });

  return found.map(TournamentV2Model.deserialize);
}

export async function getTournamentById(id: string): Promise<TournamentV2Model | null> {
  const found = await prisma.tournamentV2.findFirst({
    where: {
      id,
    },
  });

  return found ? TournamentV2Model.deserialize(found) : null;
}

export async function createTournament(model: CreateAction<TournamentV2Model>): Promise<TournamentV2Model> {
  const created = await prisma.tournamentV2.create({
    data: TournamentV2Model.serializeCreate(model),
  });

  return TournamentV2Model.deserialize(created);
}

export async function updateTournament(model: TournamentV2Model): Promise<TournamentV2Model> {
  const updated = await prisma.tournamentV2.update({
    where: {
      id: model.id,
    },
    data: TournamentV2Model.serialize(model),
  });

  return TournamentV2Model.deserialize(updated);
}

export async function deleteTournament(id: string): Promise<void> {
  await prisma.tournamentV2.delete({
    where: {
      id,
    },
  });
}