import { authOptions } from '@/lib/auth';
import { deleteTournament, getTournamentById, updateTournament } from '@/lib/db/tournament_v2';
import { NextApiRequest, NextApiResponseIO } from 'next';
import { getServerSession } from 'next-auth';

const ADMIN_ID = process.env.ADMIN_ID;

export default async function handler(req: NextApiRequest, resp: NextApiResponseIO) {
  const params = { id: req.query.id as string };
  if (req.method === 'GET') {
    return GET(req, resp, { params });
  } else if (req.method === 'PATCH') {
    return PATCH(req, resp, { params });
  } else if (req.method === 'DELETE') {
    return DELETE(req, resp, { params });
  }
}

async function GET(
  req: NextApiRequest,
  resp: NextApiResponseIO,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const tournament = await getTournamentById(id);
  if (!tournament) {
    return resp.status(404).json({
      ok: false,
    });
  }

  const session = await getServerSession(req, resp, authOptions);
  const userId = (session?.user as any)?.id;
  const isOwner = userId === ADMIN_ID || userId === tournament.userId;

  return resp.status(200).json({
    ok: true,
    isOwner,
    tournament,
  });
}

async function PATCH(
  req: NextApiRequest,
  resp: NextApiResponseIO,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { tournament: input } = req.body;

  const session = await getServerSession(req, resp, authOptions);
  if (!session?.user) {
    return resp.status(401).json({
      ok: false,
    });
  }

  const tournament = await getTournamentById(id);
  if (!tournament) {
    return resp.status(401).json({
      ok: false,
    });
  }

  const userId = (session.user as any).id as string;
  if (userId !== ADMIN_ID && userId !== tournament.userId) {
    return resp.status(401).json({
      ok: false,
    });
  }

  const result = await updateTournament(input);
  resp.socket.server.io.emit(`tournament:${id}`, { tournament: result });

  return resp.status(200).json({
    ok: true,
    tournament: result,
  });
}

async function DELETE(
  req: NextApiRequest,
  resp: NextApiResponseIO,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(req, resp, authOptions);
  if (!session?.user) {
    return resp.status(401).json({
      ok: false,
    });
  }

  const tournament = await getTournamentById(id);
  if (!tournament) {
    return resp.status(401).json({
      ok: false,
    });
  }

  const userId = (session.user as any).id as string;
  if (userId !== ADMIN_ID && userId !== tournament.userId) {
    return resp.status(401).json({
      ok: false,
    });
  }

  await deleteTournament(id);

  return Response.json({
    ok: true,
  });
}
