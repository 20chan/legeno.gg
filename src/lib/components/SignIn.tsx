'use client';

import classNames from 'classnames';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export function SignIn({
  redirectTo,
  className,
}: {
  redirectTo?: string;
  className?: string;
}) {
  const { data: session } = useSession();

  if (session && redirectTo) {
    redirect(redirectTo);
  }

  return (
    <button
      onClick={() => {
        signIn('discord');
      }}
      className={classNames('block bg-[#5865f2] rounded w-full', className)}
    >
      <div className='flex flex-row'>
        <Image src='https://authjs.dev/img/providers/discord.svg' alt='discord icon' width={24} height={24} />
        <span className='flex-1'>
          Log In with Discord
        </span>
      </div>
    </button>
  )
}
