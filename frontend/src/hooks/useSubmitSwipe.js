// src/hooks/useSubmitSwipe.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { submitSwipe } from '../api';

export default function useSubmitSwipe() {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (swipeData) => submitSwipe(getAccessTokenSilently, swipeData),
    onSuccess: (data) => {
      // Invalidate the discover query so that the list refreshes if needed.
      queryClient.invalidateQueries({ queryKey: ['discover'] });
    },
  });
}
