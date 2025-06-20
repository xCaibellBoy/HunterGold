"use client"; // Required for HOCs that use client-side hooks like useRouter

import Layout from '@/components/Layout';
import withAuth from '@/components/Auth/withAuth'; // Import the HOC
import React from 'react'; // Import React

function AdminDashboardPage() {
  const [adminEmail, setAdminEmail] = React.useState('Admin');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionJSON = localStorage.getItem('mockUserSession');
      if (sessionJSON) {
        try {
          const session = JSON.parse(sessionJSON);
          setAdminEmail(session.email || 'Admin');
        } catch (e) {
          console.error("Failed to parse session from localStorage", e);
        }
      }
    }
  }, []);

  return (
    <Layout>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Administrator {adminEmail}!</p>
      <p>This is the protected admin content area.</p>
      {/* Further admin elements will be added here */}

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

// Protect the component, allowing only 'admin' role
export default withAuth(AdminDashboardPage, ['admin']);
