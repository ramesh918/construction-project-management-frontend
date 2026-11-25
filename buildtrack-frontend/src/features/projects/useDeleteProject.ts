import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiFetchAuthed} from '../../shared/api/client';


export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetchAuthed<void>(`/projects/${id}`, {method: 'DELETE'}),
    onSuccess: () => qc.invalidateQueries({queryKey: ['projects']}),
  });
}