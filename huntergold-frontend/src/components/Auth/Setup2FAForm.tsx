"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css'; // Reuse styles
import { MockUser, MockUserSession } from '@/types'; // Import types

const Setup2FAForm = () => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [mockSecret, setMockSecret] = useState('YOUR_MOCK_SECRET_KEY_123');
  const [qrCodePlaceholder, setQrCodePlaceholder] = useState('Placeholder for QR Code Image');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const sessionJSON = localStorage.getItem('mockUserSession');
    if (sessionJSON) {
      try {
        const session: MockUserSession = JSON.parse(sessionJSON); // Uses imported MockUserSession
        setCurrentUserEmail(session.email);
        setMockSecret(`MOCKSECRET${Date.now().toString().slice(-6)}`);
      } catch (parseError) {
        console.error("Error parsing session JSON:", parseError);
        setError("Invalid session data. Please login again.");
        localStorage.removeItem('mockUserSession');
        router.push('/login');
      }
    } else {
      setError("No active session. Please login again.");
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentUserEmail) {
      setError("User session not found. Cannot setup 2FA.");
      return;
    }

    if (!verificationCode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    console.log(`Simulating 2FA verification for code: ${verificationCode} with secret: ${mockSecret}`);

    try {
      const usersJSON = localStorage.getItem('mockUsers');
      if (!usersJSON) {
        setError('Mock user data not found.');
        return;
      }
      const users: MockUser[] = JSON.parse(usersJSON); // Uses imported MockUser
      const userIndex = users.findIndex(u => u.email === currentUserEmail);

      if (userIndex === -1) {
        setError('Current user not found in mock database.');
        return;
      }

      users[userIndex].isTwoFactorEnabled = true;
      users[userIndex].twoFactorSecret = mockSecret;
      localStorage.setItem('mockUsers', JSON.stringify(users));

      setMessage('2FA setup successful (mock)! Redirecting to dashboard...');
      console.log(`Mock 2FA enabled for user ${currentUserEmail} with secret ${mockSecret}`);

      const sessionJSON = localStorage.getItem('mockUserSession');
      let role = 'user';
      if (sessionJSON) {
          const session: MockUserSession = JSON.parse(sessionJSON); // Uses imported MockUserSession
          role = session.role;
      }

      setTimeout(() => {
        router.push(role === 'admin' ? '/admin' : '/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error during mock 2FA setup:', err);
      setError('An error occurred during mock 2FA setup.');
    }
  };

  return (
    <div className={styles.form}>
      <h2>Setup Two-Factor Authentication (2FA)</h2>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message}>{message}</p>}

      <p>Scan the QR code with your authenticator app (e.g., Google Authenticator) or enter the secret key manually.</p>

      <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid var(--color-primary-gold)', textAlign: 'center', backgroundColor: 'white', color: 'black' }}>
        {qrCodePlaceholder}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="secretKey">Secret Key (save this securely):</label>
        <input type="text" id="secretKey" value={mockSecret} readOnly style={{backgroundColor: '#333', color: 'var(--color-accent-green)'}}/>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="verificationCode">Enter 6-digit code from authenticator:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        <button type="submit" className={styles.button} style={{marginTop: '1rem'}}>Verify & Enable 2FA</button>
      </form>
      <p style={{fontSize: '0.8em', marginTop: '1rem', textAlign: 'center'}}>
        Once 2FA is enabled, you will be required to enter a code from your authenticator app each time you log in.
        The QR code and secret key will not be shown again.
      </p>
    </div>
  );
};

export default Setup2FAForm;
