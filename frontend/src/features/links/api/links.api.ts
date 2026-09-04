import { apiClient } from '@/api/client';
import type { CreateLinkInput, Link, UpdateLinkInput } from '../link.types';

export function getLinks() {
  return apiClient.get<Link[]>('/links');
}

export function createLink(data: CreateLinkInput) {
  return apiClient.post<Link>('/links', data);
}

export function updateLink(linkId: string, data: UpdateLinkInput) {
  return apiClient.patch<Link>(`/links/${linkId}`, data);
}

export function deleteLink(linkId: string) {
  return apiClient.delete<void>(`/links/${linkId}`);
}
