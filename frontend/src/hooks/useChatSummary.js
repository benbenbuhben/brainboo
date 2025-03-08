import { useMutation } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { streamChatSummary } from '../api/chatSummary';

export default function useChatSummary() {
  const { getAccessTokenSilently } = useAuth0();

  return useMutation({
    mutationFn: ({ senderId, receiverId, onChunk }) =>
      streamChatSummary(getAccessTokenSilently, senderId, receiverId, onChunk),
  });
}
