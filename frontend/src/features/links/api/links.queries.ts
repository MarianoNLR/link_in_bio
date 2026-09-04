import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLink, deleteLink, getLinks, updateLink } from './links.api';
import type { CreateLinkInput, Link, UpdateLinkInput } from '../link.types';

export function useLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLinkInput) => createLink(data),
    onSuccess: (createdLink) => {
      queryClient.setQueryData<Link[]>(['links'], (links = []) =>
        [...links, createdLink].sort((a, b) => a.position - b.position),
      );
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, data }: { linkId: string; data: UpdateLinkInput }) =>
      updateLink(linkId, data),
    onSuccess: (updatedLink) => {
      queryClient.setQueryData<Link[]>(['links'], (links = []) =>
        links.map((link) =>
          link.id === updatedLink.id ? updatedLink : link,
        ),
      );
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: (_, deletedLinkId) => {
      queryClient.setQueryData<Link[]>(['links'], (links = []) =>
        links.filter((link) => link.id !== deletedLinkId),
      );
    },
  });
}
