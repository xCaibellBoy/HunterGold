"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MockUserSession {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  loggedInAt: number;
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: Array<'user' | 'admin'>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      let session: MockUserSession | null = null;
      try {
        const sessionJSON = localStorage.getItem('mockUserSession');
        if (sessionJSON) {
          session = JSON.parse(sessionJSON) as MockUserSession;
        }
      } catch (error) {
        console.error("Error parsing mock user session:", error);
        localStorage.removeItem('mockUserSession'); // Clear corrupted session
      }

      if (!session) {
        console.log('No active session, redirecting to login.');
        router.replace('/login'); // Use replace to prevent going back to protected route
        return;
      }

      // Role-based access control
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
        console.log(`User role '${session.role}' not allowed for this page. Redirecting.`);
        // Redirect to a generic dashboard or an unauthorized page if available
        // For now, redirecting to login, but a dedicated '/unauthorized' page would be better
        router.replace('/login?error=unauthorized');
        return;
      }

      // Optional: Check for session expiry if we implement it later
      // const sessionDuration = 24 * 60 * 60 * 1000; // e.g., 24 hours
      // if (Date.now() - session.loggedInAt > sessionDuration) {
      //   localStorage.removeItem('mockUserSession');
      //   router.replace('/login?error=session_expired');
      //   return;
      // }

    }, [router, allowedRoles]); // Added allowedRoles to dependency array

    // Render the wrapped component if authenticated and authorized
    // We might want to show a loading spinner while checking auth
    // For simplicity, rendering null or the component directly
    const sessionJSON = typeof window !== 'undefined' ? localStorage.getItem('mockUserSession') : null;
    if (!sessionJSON && typeof window !== 'undefined') { // Check typeof window !== 'undefined' for client-side only
       // Still show a loading or blank state until useEffect kicks in for client-side check
      return null;
    }

    // Add role check here too for initial render if possible, though useEffect is more reliable for client-side
    // This pre-emptive check might reduce flicker of unauthorized content
    if (sessionJSON && allowedRoles && allowedRoles.length > 0) {
      try {
          const currentSession = JSON.parse(sessionJSON) as MockUserSession;
          if (!allowedRoles.includes(currentSession.role)) {
              // This won't redirect immediately but prevents rendering content before useEffect redirects
              // In useEffect, router.replace will handle the actual redirect.
              // Consider returning a dedicated "Unauthorized" component or null here.
              return <p>Loading...</p>; // Or some other placeholder
          }
      } catch (e) {
        // If session is corrupted, useEffect will handle redirect.
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`; // Add display name
  return AuthComponent;
};

export default withAuth;
