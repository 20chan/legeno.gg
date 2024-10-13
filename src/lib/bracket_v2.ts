import type { MatchType, ParticipantType } from "@g-loot/react-tournament-brackets/dist/cjs";
import { TournamentV2Model, TournamentV2TeamModel } from './db/tournament_v2';

export type ParticipantExt = ParticipantType & {
  clan: string;
  members: string[];
}

export type MatchExt = MatchType & {
  maps: number[];
}

function createEmptyParticipant(matchId: number, index: number): ParticipantExt {
  return {
    id: matchId * 2 + index,
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
    });
  }

  return matches;
}