import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function UserManagement() {
  return (
    <>
      <Head title="User Management" />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <p className="text-lg">This is a placeholder for the User Management page. Here you would manage users, their roles, and permissions.</p>
        </div>
      </div>
    </>
  );
}

UserManagement.layout = (page: React.ReactNode) => <AppLayout children={page} />;
