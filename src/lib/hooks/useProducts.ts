import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useSync } from '@/contexts/SyncContext';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => api.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      sendUpdate({ type: 'PRODUCT_UPDATED' });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      api.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      sendUpdate({ type: 'PRODUCT_UPDATED' });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { sendUpdate } = useSync();

  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      sendUpdate({ type: 'PRODUCT_UPDATED' });
    },
  });
}