import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { useSync } from '@/contexts/SyncContext';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (service: Omit<Service, 'id'>) => api.createService(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      sendUpdate({ type: 'SERVICE_UPDATED' });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: ({ id, service }: { id: string; service: Partial<Service> }) =>
      api.updateService(id, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      sendUpdate({ type: 'SERVICE_UPDATED' });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (id: string) => api.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      sendUpdate({ type: 'SERVICE_UPDATED' });
    },
  });
}