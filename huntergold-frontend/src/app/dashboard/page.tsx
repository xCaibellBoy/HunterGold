"use client"; // Required for HOCs that use client-side hooks like useRouter

import Layout from '@/components/Layout';
import withAuth from '@/components/Auth/withAuth'; // Import the HOC
import React from 'react'; // Import React

function DashboardPage() {
  // Mock data - in a real app, this would come from an API call using the session token
  const [userEmail, setUserEmail] = React.useState('User');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionJSON = localStorage.getItem('mockUserSession');
      if (sessionJSON) {
        try {
          const session = JSON.parse(sessionJSON);
          setUserEmail(session.email || 'User');
        } catch (e) {
          console.error("Failed to parse session from localStorage", e);
        }
      }
    }
  }, []);

  return (
    <Layout>
      <h2>User Dashboard</h2>
      <p>Welcome, {userEmail}!</p>
      <p>This is your protected dashboard content.</p>
      {/* Further dashboard elements will be added here */}

      <button onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mockUserSession');
          window.location.href = '/login'; // Simple logout
        }
      }} style={{marginTop: '20px', backgroundColor: 'var(--color-accent-red)', color: 'white'}}>
        Logout (Mock)
      </button>
    </Layout>
  );
}

// Protect the component, allowing only 'user' and 'admin' roles
export default withAuth(DashboardPage, ['user', 'admin']);
