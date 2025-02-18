// src/hooks/useDiscoverUsers.js
import { useQuery } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDiscoverUsers } from '../api';

export default function useDiscoverUsers() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['discover', user?.sub],
    queryFn: () => fetchDiscoverUsers(getAccessTokenSilently),
    enabled: isAuthenticated && !!user,
    retry: false,
  });

  return { discoverUsers: data, error, isLoading, refetch };
}
