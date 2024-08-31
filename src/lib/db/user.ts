import { prisma } from '../prisma';

export async function getOrCreateUser(providerAccountId: string) {
  const found = await prisma.user.findFirst({
    where: {
      providerAccountId,
    },
  });

  if (found) {
    return found;
  }

  const created = await prisma.user.create({
    data: {
      providerAccountId,
    },
  });

  return created;
}
