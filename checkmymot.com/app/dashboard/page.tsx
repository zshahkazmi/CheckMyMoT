import React from 'react';
import { useSession } from 'next-auth/react';
import MotCard from '@/components/MotCard';
import SearchForm from '@/components/SearchForm';

const DashboardPage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <h1>Please log in to access your dashboard</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to your Dashboard, {session.user.name}!</h1>
      <SearchForm />
      <MotCard />
    </div>
  );
};

export default DashboardPage;