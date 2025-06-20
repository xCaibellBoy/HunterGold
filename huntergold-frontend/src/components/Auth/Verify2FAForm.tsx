"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './AuthForm.module.css'; // Reuse styles
import { MockUser, MockUserSession } from '@/types'; // Import types

const Verify2FAForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID not provided. Cannot verify 2FA.");
      return;
    }

    try {
      const usersJSON = localStorage.getItem('mockUsers');
      if (!usersJSON) {
        setError('Mock user data not found.');
        return;
      }
      const users: MockUser[] = JSON.parse(usersJSON); // Uses imported MockUser
      const user = users.find(u => u.id === userId && u.isTwoFactorEnabled);

      if (!user || !user.twoFactorSecret) {
        setError('2FA not enabled for this user or user not found (mock).');
        return;
      }
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching user for 2FA verify:", err);
      setError("An error occurred while fetching user data.");
    }
  }, [userId, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentUser || !currentUser.twoFactorSecret) {
      setError('User data or 2FA secret not available. Please try logging in again.');
      return;
    }

    if (!verificationCode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    console.log(`Simulating 2FA verification for user ${currentUser.email} with code: ${verificationCode} against secret: ${currentUser.twoFactorSecret}`);

    setMessage('2FA verification successful (mock)! Redirecting to your dashboard...');

    const sessionJSON = localStorage.getItem('mockUserSession');
    let role = 'user';
    if (sessionJSON) {
        try {
            const session: MockUserSession = JSON.parse(sessionJSON); // Uses imported MockUserSession
            if (session.userId === currentUser.id) {
                role = session.role;
            } else {
                setError("Session mismatch. Please login again.");
                localStorage.removeItem("mockUserSession");
                router.push('/login');
                return;
            }
        } catch (parseError) {
            setError("Invalid session. Please login again.");
            localStorage.removeItem("mockUserSession");
            router.push('/login');
            return;
        }
    } else {
        setError("No active session. Please login again.");
        router.push('/login');
        return;
    }

    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    }, 2000);
  };

  if (!userId && !error) {
      return (
          <div className={styles.form} style={{textAlign: 'center'}}>
              <p>Loading user information...</p>
          </div>
      );
  }

  if (error && !currentUser) {
      return (
          <div className={styles.form} style={{textAlign: 'center'}}>
              <h2>Verify Two-Factor Authentication (2FA)</h2>
              <p className={styles.error}>{error}</p>
          </div>
      );
  }

  return (
    <div className={styles.form}>
      <h2>Verify Two-Factor Authentication (2FA)</h2>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <p>Enter the 6-digit code from your authenticator app for user: <strong>{currentUser?.email || '...'}</strong></p>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            required
            disabled={!!message}
          />
        </div>
        <button type="submit" className={styles.button} style={{marginTop: '1rem'}} disabled={!!message}>
          Verify Code
        </button>
      </form>
    </div>
  );
};

export default Verify2FAForm;
