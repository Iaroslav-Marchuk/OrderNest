import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeLocationApi } from '../services/authApi';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

export const useChangeLocation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeLocationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Location updated!');
      onSuccess?.();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });
};
