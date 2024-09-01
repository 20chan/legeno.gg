import { authOptions } from '@/lib/auth';
import { getTournamentById, updateTournament } from '@/lib/db/tournament';
import { getServerSession } from 'next-auth';

const ADMIN_ID = process.env.ADMIN_ID;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const tournament = await getTournamentById(id);
  if (!tournament) {
    return Response.json({
      ok: false,
    }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const isOwner = userId === ADMIN_ID || userId === tournament.userId;

  return Response.json({
    ok: true,
    isOwner,
    tournament,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { tournament: input } = await request.json();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({
      ok: false,
    }, { status: 401 });
  }

  const tournament = await getTournamentById(id);
  if (!tournament) {
    return Response.json({
      ok: false,
    }, { status: 404 });
  }

  const userId = (session.user as any).id as string;
  if (userId !== ADMIN_ID && userId !== tournament.userId) {
    return Response.json({
      ok: false,
    }, { status: 401 });
  }

  const result = await updateTournament(input);

  return Response.json({
    ok: true,
    tournament: result,
  });
}
