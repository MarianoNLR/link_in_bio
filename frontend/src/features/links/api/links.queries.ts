import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLink,
  deleteLink,
  getLinks,
  updateLink,
  registerClick,
  reorderLinks,
} from "./links.api";
import type { CreateLinkInput, Link, UpdateLinkInput } from "../link.types";

export function useLinks() {
  return useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLinkInput) => createLink(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, data }: { linkId: string; data: UpdateLinkInput }) =>
      updateLink(linkId, data),
    onSuccess: (updatedLink) => {
      queryClient.setQueryData<Link[]>(["links"], (links = []) =>
        links.map((link) => (link.id === updatedLink.id ? updatedLink : link)),
      );
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });
}

export function useRegisterClick() {
  return useMutation({
    mutationFn: registerClick,
  });
}

export function useReorderLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkIds: string[]) => reorderLinks(linkIds),
    onSuccess: (updatedLinks) => {
      queryClient.setQueryData(["links"], updatedLinks);
    },
  });
}
