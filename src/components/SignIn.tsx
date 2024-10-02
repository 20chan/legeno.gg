'use client';

import classNames from 'classnames';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import discordLogo from './discord-icon-svgrepo-com.svg';
import React, { ReactNode } from 'react';

export function SignIn({
  redirectTo,
  className,
  footer,
}: {
  redirectTo?: string;
  className?: string;
  footer?: ReactNode;
}) {
  const { data: session } = useSession();

  if (session && redirectTo) {
    redirect(redirectTo);
  }

  return (
    <button
      onClick={() => {
        signIn('discord');
        const { umami } = window as any;
        umami.track('discord-sign-in-button');
      }}
      className={classNames('block bg-[#5865f2] rounded w-full', className)}
    >
      <div className='flex flex-row justify-center gap-4'>
        <Image src={discordLogo} alt='discord icon' width={24} height={24} />
        <span className=''>
          Log In with Discord
        </span>
      </div>

      {footer}
    </button>
  )
}
