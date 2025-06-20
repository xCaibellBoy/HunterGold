"use client";

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/components/Auth/AuthForm.module.css'; // Reuse styles
import { MockUser } from '@/types'; // Import MockUser

export default function VerifyEmailMockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailToVerify = searchParams.get('email');
  const [message, setMessage] = useState('Verifying your email (simulated)...');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!emailToVerify) {
      setError('No email provided for verification.');
      setMessage('');
      return;
    }

    try {
      const usersJSON = localStorage.getItem('mockUsers');
      if (!usersJSON) {
        setError('No mock user data found.');
        setMessage('');
        return;
      }

      const users: MockUser[] = JSON.parse(usersJSON); // Uses imported MockUser
      const userIndex = users.findIndex(user => user.email === emailToVerify && !user.isEmailVerified);

      if (userIndex === -1) {
        const alreadyVerifiedUser = users.find(user => user.email === emailToVerify && user.isEmailVerified);
        if (alreadyVerifiedUser) {
          setMessage(`Email ${emailToVerify} is already verified. You can now log in.`);
        } else {
          setError(`Verification failed: User ${emailToVerify} not found or already verified (simulated).`);
          // Clear message if error is set for clarity
          setMessage('');
        }
        return;
      }

      users[userIndex].isEmailVerified = true;
      localStorage.setItem('mockUsers', JSON.stringify(users));

      setMessage(`Email ${emailToVerify} successfully verified (simulated)! You will be redirected to login shortly.`);
      console.log(`Mock user ${emailToVerify} email verified.`);

      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (e) {
      console.error('Mock email verification error:', e);
      setError('An error occurred during mock email verification.');
      setMessage('');
    }
  }, [emailToVerify, router]);

  return (
    <Layout>
      <div className={styles.form} style={{ textAlign: 'center' }}>
        <h2>Email Verification</h2>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!message && !error && <p>Processing...</p>}
        {(message || error) && (
          <div style={{marginTop: "20px"}}>
            <Link href="/login" className={styles.button}>Go to Login</Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
