"use client";

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/components/Auth/AuthForm.module.css'; // Reuse styles

export default function CheckEmailPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Attempt to get the email from localStorage or query params for display
    // This is a simple way, a more robust solution might pass email via router state or encrypted query param
    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get('email');
    if (queryEmail) {
      setEmail(decodeURIComponent(queryEmail));
      return;
    }
    // Fallback to last registered user (very simplified for mock)
    const usersJSON = localStorage.getItem('mockUsers');
    if (usersJSON) {
      const users = JSON.parse(usersJSON);
      if (users.length > 0) {
        setEmail(users[users.length - 1].email);
      }
    }
  }, []);

  return (
    <Layout>
      <div className={styles.form} style={{ textAlign: 'center' }}>
        <h2>Check Your Email</h2>
        {email ? (
          <p>A (simulated) verification link has been sent to <strong>{email}</strong>.</p>
        ) : (
          <p>A (simulated) verification link has been sent to your email address.</p>
        )}
        <p>Please click the link in the email to verify your account. This link will expire in 15 minutes (simulated).</p>
        <p>
          (For testing purposes, you can simulate verification using development tools or specific test routes if available).
        </p>
        <br />
        <Link href="/login" className={styles.button}>Back to Login</Link>
        {/* In a real app, you wouldn't provide a direct verification link here for security reasons */}
        {/* This is purely for mock testing convenience */}
        {email && (
          <div style={{ marginTop: '20px', fontSize: '0.9em', opacity: 0.8 }}>
            <p>Mock Verification Helper:</p>
            <Link href={`/auth/verify-email-mock?email=${encodeURIComponent(email)}`} className={styles.button}>
              Simulate Clicking Verification Link for {email}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
