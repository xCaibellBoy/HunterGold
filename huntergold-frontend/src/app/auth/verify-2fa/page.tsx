"use client"; // Required as withAuth and Verify2FAForm are client components

import Layout from '@/components/Layout';
import Verify2FAForm from '@/components/Auth/Verify2FAForm';
// This page is part of the login flow, so withAuth might not be strictly necessary
// if LoginForm correctly redirects here only after primary auth.
// However, adding it can prevent direct access if no session is partially formed.
import withAuth from '@/components/Auth/withAuth';
import React from 'react';

function Verify2FAPageInternal() {
  return (
    <Layout>
      <Verify2FAForm />
    </Layout>
  );
}
// Protecting with 'user' and 'admin' ensures a session must exist.
export default withAuth(Verify2FAPageInternal, ['user', 'admin']);
