import { useQuery } from '@tanstack/react-query';
import { apiFetchAuthed, apiFetchPaginatedAuthed } from '../../shared/api/client';
import type { Project, ProjectStatus } from '../../shared/types/project';

export function useProjects(status: ProjectStatus | undefined) {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: () =>
      apiFetchPaginatedAuthed<Project>(
        `/projects${status ? `?status=${encodeURIComponent(status)}` : ''}`,
      ),
  });
}

export function useProject(id: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ['project', id],
    queryFn: () => apiFetchAuthed<Project>(`/projects/${id}`),
  });
}
