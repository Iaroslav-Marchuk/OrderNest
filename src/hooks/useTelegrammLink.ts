import { useMutation } from '@tanstack/react-query';
import { getTelegramLinkApi } from '../services/usersApi';

export const useTelegramLink = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: getTelegramLinkApi,
    onSuccess: data => {
      window.open(data.link, '_blank');
    },
  });

  return { connectTelegram: mutate, isConnecting: isPending };
};
