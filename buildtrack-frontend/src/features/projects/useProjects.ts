import { useQuery } from '@tanstack/react-query';
import { apiFetchPaginatedAuthed } from '../../shared/api/client';
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
