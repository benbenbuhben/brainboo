import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { getMatches } from "../api";

export default function useMatches() {
    const { user, getAccessTokenSilently } = useAuth0();

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['matches', user?.sub],
        queryFn: () => getMatches(getAccessTokenSilently),
        enabled: !!user,
        retry: false,
    })

    return { matches: data, error, isLoading, refetch };
};