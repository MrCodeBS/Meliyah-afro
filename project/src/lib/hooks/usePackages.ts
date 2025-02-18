import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Package } from '@/types';
import { useSync } from '@/contexts/SyncContext';

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: () => api.getPackages(),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (pkg: Omit<Package, 'id'>) => api.createPackage(pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      sendUpdate({ type: 'PACKAGE_UPDATED' });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: ({ id, pkg }: { id: string; pkg: Partial<Package> }) =>
      api.updatePackage(id, pkg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      sendUpdate({ type: 'PACKAGE_UPDATED' });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (id: string) => api.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      sendUpdate({ type: 'PACKAGE_UPDATED' });
    },
  });
}