import { AuthToken } from '@prisma/client';
import { prisma } from '../prisma';
import { v4 as uuidv4 } from 'uuid';

export async function getOrCreateToken(userId: string): Promise<AuthToken> {
  const found = await prisma.authToken.findFirst({
    where: {
      userId,
    },
  });

  if (found) {
    return found;
  }

  let tryCount = 10;
  while (tryCount-- > 0) {
    try {
      const created = await prisma.authToken.create({
        data: {
          userId,
          token: uuidv4(),
        },
      });

      return created;

    } catch { }
  }

  return {} as never;
}
