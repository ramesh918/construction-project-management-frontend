import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiFetchAuthed} from '../../shared/api/client';
import type {Project} from '../../shared/types/project';

interface UpdateProjectInput {
  id: string;
  patch: Partial<Omit<Project, 'id'>>;
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({id, patch}: UpdateProjectInput) =>
      apiFetchAuthed<Project>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    onSuccess: () => qc.invalidateQueries({queryKey: ['projects']}),
  });
}