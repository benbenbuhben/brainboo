import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchOrCreateProfile } from '../api/profile';

export default function useUserProfile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const queryKey = useMemo(() => ['profile', user?.sub], [user?.sub]);

  const { data: profile, error, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchOrCreateProfile(getAccessTokenSilently, user),
    enabled: isAuthenticated && !!user,
    retry: false,
  });

  return { profile, error, isLoading, refetch };
}
