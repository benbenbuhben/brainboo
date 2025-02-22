import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { getMatches } from "../api/match";

export default function useMatches() {
  const { getAccessTokenSilently } = useAuth0();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches(getAccessTokenSilently);
        console.log("Fetched matches:", data);
        setMatches(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [getAccessTokenSilently]);

  return { matches, isLoading, error };
}
