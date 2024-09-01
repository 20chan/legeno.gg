import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import AuthProvider from './AuthProvider';

export interface AuthContextProps {
  children: React.ReactNode;
}

export async function ServerAuthProvider({ children }: AuthContextProps) {
  const session = await getServerSession(authOptions);

  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  );
}
