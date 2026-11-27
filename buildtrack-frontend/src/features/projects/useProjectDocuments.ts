import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetchAuthed } from '../../shared/api/client';
import type { ProjectDocument, ProjectDocumentCategory } from '../../shared/types/project';

interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  fileName: string;
  contentType: string;
  category: ProjectDocumentCategory;
}

interface UploadUrlRequest {
  fileName: string;
  contentType: string;
  category: ProjectDocumentCategory;
}

interface ConfirmUploadRequest {
  key: string;
  fileName: string;
  contentType: string;
  category: ProjectDocumentCategory;
}

export function useProjectDocuments(projectId: string) {
  return useQuery({
    enabled: !!projectId,
    queryKey: ['documents', projectId],
    queryFn: () => apiFetchAuthed<ProjectDocument[]>(`/projects/${projectId}/documents`),
  });
}

export function useRequestUploadUrl(projectId: string) {
  return useMutation({
    mutationFn: (body: UploadUrlRequest) =>
      apiFetchAuthed<UploadUrlResponse>(`/projects/${projectId}/documents/upload-url`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  });
}

export function useConfirmDocumentUpload(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ConfirmUploadRequest) =>
      apiFetchAuthed(`/projects/${projectId}/documents/confirm`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents', projectId] }),
  });
}

export function useDeleteDocument(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) =>
      apiFetchAuthed<void>(`/projects/${projectId}/documents/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents', projectId] }),
  });
}