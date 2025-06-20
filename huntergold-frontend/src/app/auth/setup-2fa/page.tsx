"use client"; // Required as withAuth and Setup2FAForm are client components

import Layout from '@/components/Layout';
import Setup2FAForm from '@/components/Auth/Setup2FAForm';
import withAuth from '@/components/Auth/withAuth'; // Protect this page too
import React from 'react';

function Setup2FAPageInternal() {
  return (
    <Layout>
      {/* Title is handled within the form component */}
      <Setup2FAForm />
    </Layout>
  );
}
// Protect this page: only logged-in users who haven't set up 2FA should ideally see it.
// withAuth will ensure user is logged in. The form itself can handle if 2FA is already set.
export default withAuth(Setup2FAPageInternal, ['user', 'admin']);
