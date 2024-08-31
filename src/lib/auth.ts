import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { getOrCreateUser } from './db/user';
import { getOrCreateToken } from './db/token';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? '';
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET ?? '';

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      const userEntity = await getOrCreateUser(user.id);
      const tokenEntity = await getOrCreateToken(userEntity.id);
      return true;
    },
    session: async ({ session, token, user }) => {
      if (session.user) {
        (session.user as any).id = token.sub
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export const nextAuth = NextAuth(authOptions);

export const {
  auth,
  handlers,
} = nextAuth;
