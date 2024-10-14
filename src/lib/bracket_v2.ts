import type { MatchType, ParticipantType } from "@g-loot/react-tournament-brackets/dist/cjs";
import { TournamentV2Model, TournamentV2TeamModel } from './db/tournament_v2';
import { getThirdMatch } from './tournamentHelper_v2';

export type ParticipantExt = ParticipantType & {
  clan: string;
  members: string[];
}

export type MatchExt = MatchType & {
  maps: number[];
  isThirdMatch: boolean;
}

function createEmptyParticipant(matchId: number, index: number): ParticipantExt {
  return {
    id: 10000 + matchId * 10 + index,
    name: '',
    clan: '',
    members: [],
  };
}

function createParticipant(team: TournamentV2TeamModel): ParticipantExt {
  return {
    id: team.id,
    name: team.name,
    clan: team.clan,
    members: team.members,
  };
}

export function createMatches(model: TournamentV2Model): MatchExt[] {
  const matches: MatchExt[] = [];
  for (const match of model.matches) {
    const participants: ParticipantType[] = [];

    if (match.shape.match1TeamId !== null) {
      const team = model.teams.find(x => x.id === match.shape.match1TeamId)!;
      participants.push(createParticipant(team));
    } else if (match.shape.prevMatch1Id !== null) {
      const prevMatch = model.matches.find(x => x.id === match.shape.prevMatch1Id)!;

      if (prevMatch.winner !== null) {
        participants.push(createParticipant(model.teams.find(x => x.id === prevMatch.winner)!));
      } else {
        participants.push(createEmptyParticipant(prevMatch.id, 0));
      }
    } else {
      participants.push(createEmptyParticipant(match.id, 0));
    }

    if (match.shape.match2TeamId !== null) {
      const team = model.teams.find(x => x.id === match.shape.match2TeamId)!;
      participants.push(createParticipant(team));
    } else if (match.shape.prevMatch2Id !== null) {
      const prevMatch = model.matches.find(x => x.id === match.shape.prevMatch2Id)!;

      if (prevMatch.winner !== null) {
        participants.push(createParticipant(model.teams.find(x => x.id === prevMatch.winner)!));
      } else {
        participants.push(createEmptyParticipant(prevMatch.id, 1));
      }
    } else {
      participants.push(createEmptyParticipant(match.id, 1));
    }

    if (match.win !== null) {
      participants[match.win].isWinner = true;
      participants[match.win].resultText = '승';
      participants[1 - match.win].isWinner = false;
      participants[1 - match.win].resultText = '패';
    }

    matches.push({
      id: match.id,
      nextMatchId: match.shape.nextMatchId,
      startTime: '',
      state: '',
      maps: match.maps,
      participants: participants,
      isThirdMatch: false,
    });
  }

  return matches;
}

export function createThirdPlaceMatches(model: TournamentV2Model): MatchExt[] {
  const finalMatch = model.matches.find(x => x.shape.nextMatchId === null)!;

  const thirdMatchTeamIds = getThirdMatch(model);

  const matchEnded = model.options.thirdPlaceWinId !== null;
  const win0 = model.options.thirdPlaceWinId === thirdMatchTeamIds[0];
  const win1 = model.options.thirdPlaceWinId === thirdMatchTeamIds[1];

  const participants: ParticipantExt[] = [];

  if (thirdMatchTeamIds[0] === null) {
    participants.push(createEmptyParticipant(999, 0));
  } else {
    participants.push({
      ...createParticipant(model.teams.find(x => x.id === thirdMatchTeamIds[0])!),
      isWinner: win0,
      resultText: !matchEnded ? null : win0 ? '승' : '패',
    });
  }

  if (thirdMatchTeamIds[1] === null) {
    participants.push(createEmptyParticipant(999, 1));
  } else {
    participants.push({
      ...createParticipant(model.teams.find(x => x.id === thirdMatchTeamIds[1])!),
      isWinner: win1,
      resultText: !matchEnded ? null : win1 ? '승' : '패',
    });
  }

  return [{
    id: 999,
    nextMatchId: null,
    startTime: '',
    state: '',
    maps: model.options.thirdPlaceMaps,
    participants: participants,
    isThirdMatch: true,
  }];
}