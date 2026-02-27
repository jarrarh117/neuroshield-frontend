
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { CosmicPortalLoader } from '@/components/cosmic/CosmicPortalLoader';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // If user is not logged in, redirect to landing page
        router.push('/landing');
      }
    }
  }, [user, loading, router]);

  // Show enhanced loader while checking auth status
  if (showLoader && loading) {
    return <CosmicPortalLoader onComplete={() => setShowLoader(false)} duration={2000} />;
  }

  // Fallback for quick redirects
  return null;
}
