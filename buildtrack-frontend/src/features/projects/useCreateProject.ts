import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetchAuthed } from '../../shared/api/client';
import type { CreateProjectInput, Project } from '../../shared/types/project';

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProjectInput) =>
      apiFetchAuthed<Project>('/projects', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
