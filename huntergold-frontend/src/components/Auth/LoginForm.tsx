"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css'; // Reuse styles
import Link from 'next/link';
import { MockUser } from '@/types'; // Import MockUser

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // This message might be shown briefly before redirect

  const MAX_LOGIN_ATTEMPTS = 3;
  const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const usersJSON = localStorage.getItem('mockUsers');
      if (!usersJSON) {
        setError('No user data found. Please register first (mock).');
        return;
      }
      const users: MockUser[] = JSON.parse(usersJSON); // Uses imported MockUser
      const userIndex = users.findIndex(u => u.email === email && u.role === role);

      if (userIndex === -1) {
        setError('Invalid credentials or role (mock).');
        return;
      }

      const user = users[userIndex]; // This will be of type MockUser

      // Check for lockout
      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 60000);
        setError(`Account locked due to too many failed attempts. Try again in ${remainingTime} minute(s).`);
        return;
      } else if (user.lockedUntil && user.lockedUntil <= Date.now()) {
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
      }

      if (user.passwordHash !== `mock_hashed_${password}`) {
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
          user.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          setError(`Invalid password. Account locked for ${LOCKOUT_DURATION_MS / 60000} minutes (mock).`);
        } else {
          setError(`Invalid password. ${MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts} attempts remaining (mock).`);
        }
        localStorage.setItem('mockUsers', JSON.stringify(users));
        return;
      }

      if (!user.isEmailVerified) {
        setError('Email not verified. Please check your email or use the mock verification link (simulated).');
        setMessage(
          `Email not verified. <a href="/auth/verify-email-mock?email=${encodeURIComponent(user.email)}">Simulate verification for ${user.email}</a>`
        );
        return;
      }

      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      localStorage.setItem('mockUsers', JSON.stringify(users));

      localStorage.setItem('mockUserSession', JSON.stringify({ userId: user.id, email: user.email, role: user.role, loggedInAt: Date.now() }));

      if (user.isTwoFactorEnabled) {
        setMessage('Login successful! Redirecting to 2FA verification...');
        console.log('User has 2FA enabled, redirecting to 2FA verification page.');
        router.push(`/auth/verify-2fa?userId=${user.id}`);
      } else {
        setMessage('Login successful! Redirecting to 2FA setup...');
        console.log('User does not have 2FA enabled, redirecting to 2FA setup page.');
        router.push('/auth/setup-2fa');
      }

    } catch (e) {
      console.error('Mock login error:', e);
      localStorage.removeItem('mockUserSession');
      setError('An error occurred during mock login.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.message} dangerouslySetInnerHTML={{ __html: message }}></p>}

      <div className={styles.inputGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="role">Role:</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')}>
          <option value="user">User</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      <button type="submit" className={styles.button}>Login</button>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Don't have an account? <Link href="/register" style={{color: 'var(--color-primary-gold)'}}>Register here</Link>
      </p>
    </form>
  );
};

export default LoginForm;
