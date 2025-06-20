"use client"; // This is a client component

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';
import { MockUser } from '@/types'; // Import MockUser

const RegisterForm = () => {
  const router = useRouter(); // Initialized router
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic client-side validation
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Mock API Interaction
    console.log('Simulating registration for:', { fullName, email });

    // Simulate storing user data in localStorage
    try {
      const newUser: MockUser = { // Use the imported MockUser type
        id: Date.now().toString(),
        fullName,
        email,
        passwordHash: `mock_hashed_${password}`,
        role: 'user',
        isEmailVerified: false,
        // Initialize optional fields to undefined or default if necessary
        failedLoginAttempts: 0,
        lockedUntil: undefined,
        isTwoFactorEnabled: false,
        twoFactorSecret: undefined,
        walletAddress: undefined,
        activeMembership: undefined,
      };

      const existingUsersJSON = localStorage.getItem('mockUsers');
      const existingUsers: MockUser[] = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

      if (existingUsers.find(user => user.email === email)) {
        setError('User with this email already exists (mock).');
        return;
      }

      existingUsers.push(newUser); // Use newUser which conforms to the full MockUser type
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

      setMessage('Registration successful (mock)! Please check your email to verify your account (simulated).');
      console.log('Mock user stored in localStorage:', newUser);
      console.log('Simulated: Verification email sent to', email);

      router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (e) {
      console.error('Mock registration error:', e);
      setError('An error occurred during mock registration.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      {message && !error && <p className={styles.message}>{message}</p>}

      <div className={styles.inputGroup}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
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
        <label htmlFor="password">Password (min. 12 chars):</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={12}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={12}
          required
        />
      </div>
      <button type="submit" className={styles.button}>Register</button>
    </form>
  );
};

export default RegisterForm;
