import Agent from '@/components/Agent';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Interview Generation',
  description: 'Generate interviews with AI',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const Page = async () => {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.fullName! || 'Unknown'}
        userId={user?.id || ''}
        profileImage={user?.imageUrl || 'user.svg'}
        type="generate"
      />
    </>
  );
};

export default Page;
