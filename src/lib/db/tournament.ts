import { Tournament } from '@prisma/client';
import { prisma } from '../prisma';

type CreateAction<T> = T | Omit<T, 'id' | 'createdAt' | 'startDate'>;

export interface TournamentModel {
  id: string;
  createdAt: Date;
  startDate: Date;
  userId: string;

  title: string;
  teams: TournamentTeamModel[];

  thirdPlaceEnabled: boolean;
  thirdPlaceWinIndex: number;
  thirdPlaceMaps: number[];
}

export interface TournamentTeamModel {
  id: number;
  clan: string;
  members: string[];
  maps: number[][];
  wins: boolean[];
}

export namespace TournamentModel {
  export function createNew(userId: string): CreateAction<TournamentModel> {
    return {
      title: '',
      userId,
      teams: new Array(16).fill(0).map((_, i) => ({
        id: i + 1,
        clan: '',
        members: ['', '', ''],
        maps: [],
        wins: [],
      })),
      thirdPlaceEnabled: true,
      thirdPlaceWinIndex: -1,
      thirdPlaceMaps: [],
    };
  }

  export function serialize(model: TournamentModel): Tournament {
    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teamIds: JSON.stringify(model.teams.map(x => x.id)),
      clanNames: JSON.stringify(model.teams.map(x => x.clan)),
      teamMembers: JSON.stringify(model.teams.map(x => x.members)),
      maps: JSON.stringify(model.teams.map(x => x.maps)),
      wins: JSON.stringify(model.teams.map(x => x.wins)),
      thirdPlaceEnabled: model.thirdPlaceEnabled,
      thirdPlaceWinIndex: model.thirdPlaceWinIndex,
      thirdPlaceMaps: JSON.stringify(model.thirdPlaceMaps),
    };
  }
  export function serializeCreate(model: CreateAction<TournamentModel>): CreateAction<Tournament> {
    return {
      userId: model.userId,
      title: model.title,
      teamIds: JSON.stringify(model.teams.map(x => x.id)),
      clanNames: JSON.stringify(model.teams.map(x => x.clan)),
      teamMembers: JSON.stringify(model.teams.map(x => x.members)),
      maps: JSON.stringify(model.teams.map(x => x.maps)),
      wins: JSON.stringify(model.teams.map(x => x.wins)),
      thirdPlaceEnabled: model.thirdPlaceEnabled,
      thirdPlaceWinIndex: model.thirdPlaceWinIndex,
      thirdPlaceMaps: JSON.stringify(model.thirdPlaceMaps),
    };
  }

  export function deserialize(model: Tournament): TournamentModel {
    const teamIds: number[] = JSON.parse(model.teamIds);

    const clans = JSON.parse(model.clanNames);
    const members = JSON.parse(model.teamMembers);
    const maps = JSON.parse(model.maps);
    const wins = JSON.parse(model.wins);

    return {
      id: model.id,
      createdAt: model.createdAt,
      startDate: model.startDate,
      userId: model.userId,
      title: model.title,
      teams: teamIds.map((id, i) => ({
        id,
        clan: clans[i],
        members: members[i],
        maps: maps[i],
        wins: wins[i],
      })),
      thirdPlaceEnabled: model.thirdPlaceEnabled,
      thirdPlaceWinIndex: model.thirdPlaceWinIndex,
      thirdPlaceMaps: JSON.parse(model.thirdPlaceMaps),
    };
  }
}

export async function getTournaments(options: { take?: number }): Promise<TournamentModel[]> {
  const found = await prisma.tournament.findMany({
    take: options.take,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return found.map(TournamentModel.deserialize);
}

export async function getTournamentById(id: string): Promise<TournamentModel | null> {
  const found = await prisma.tournament.findFirst({
    where: {
      id,
    },
  });

  return found ? TournamentModel.deserialize(found) : null;
}

export async function createTournament(model: CreateAction<TournamentModel>): Promise<Tournament> {
  const created = await prisma.tournament.create({
    data: TournamentModel.serializeCreate(model),
  });

  return created;
}

export async function updateTournament(model: TournamentModel): Promise<Tournament> {
  const updated = await prisma.tournament.update({
    where: {
      id: model.id,
    },
    data: TournamentModel.serialize(model),
  });

  return updated;
}
