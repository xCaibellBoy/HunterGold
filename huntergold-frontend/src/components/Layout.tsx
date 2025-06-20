"use client"; // Ensure Layout can use useEffect

import React, { useEffect } from 'react'; // Add useEffect
import { initializeMockCodes } from '@/lib/mockMembershipCodes'; // Import initializer

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    initializeMockCodes(); // Initialize codes when layout mounts (client-side)
  }, []);

  return (
    <>
      <header style={{ padding: '1rem', backgroundColor: 'var(--color-primary-black)', borderBottom: '1px solid var(--color-primary-gold)' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-gold)' }}>HunterGold</h1>
        {/* Navigation links can be added here */}
      </header>
      <main className="container">
        {children}
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', borderTop: '1px solid var(--color-primary-gold)', color: 'var(--color-primary-gold)' }}>
        <p>&copy; {new Date().getFullYear()} HunterGold. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
