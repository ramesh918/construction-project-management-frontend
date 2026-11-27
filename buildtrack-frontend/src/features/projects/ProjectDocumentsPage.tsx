import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProjectDocuments, useRequestUploadUrl, useConfirmDocumentUpload, useDeleteDocument } from './useProjectDocuments';
import { uploadFileDirectToS3 } from '../../shared/api/uploadToS3';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Select } from '../../shared/ui/Select';
import type { ProjectDocumentCategory } from '../../shared/types/project';
import { downloadFileFromUrl } from '../../shared/api/downloadFile';

const CATEGORY_OPTIONS: ProjectDocumentCategory[] = ['blueprint', 'permit', 'contract', 'other'];

export function ProjectDocumentsPage() {
  const { id: projectId } = useParams<{ id: string }>();

  const documents = useProjectDocuments(projectId!);
  const requestUploadUrl = useRequestUploadUrl(projectId!);
  const confirmUpload = useConfirmDocumentUpload(projectId!);
  const deleteDocument = useDeleteDocument(projectId!);

  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ProjectDocumentCategory>('blueprint');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const { uploadUrl, key, fileName, contentType } = await requestUploadUrl.mutateAsync({
        fileName: file.name,
        contentType: file.type,
        category,
      });

      await uploadFileDirectToS3(file, uploadUrl);

      await confirmUpload.mutateAsync({ key, fileName, contentType, category });

      setFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link to={`/projects/${projectId}`} className="text-sm text-indigo-600 hover:underline">
        ← Back to project
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Upload a document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <Field label="File" htmlFor="doc-file">
            <input
              id="doc-file"
              type="file"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              required
              className="block w-full text-sm text-slate-600"
            />
          </Field>
          <Field label="Category" htmlFor="doc-category">
            <Select
              id="doc-category"
              value={category}
              onChange={e => setCategory(e.target.value as ProjectDocumentCategory)}
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          {uploadError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          <Button type="submit" disabled={!file || uploading}>
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Documents</h2>

        {documents.isLoading && <p className="text-sm text-slate-500">Loading…</p>}
        {documents.isError && <p className="text-sm text-red-600">{(documents.error as Error).message}</p>}
        {documents.data?.length === 0 && <p className="text-sm text-slate-500">No documents yet.</p>}

        <ul className="divide-y divide-slate-100">
          {documents.data?.map(doc => (
            <li key={doc.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{doc.fileName}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{doc.category}</p>
              </div>
              <Button
                variant="danger"
                disabled={deleteDocument.isPending}
                onClick={() => {
                  if (window.confirm(`Delete ${doc.fileName}?`)) {
                    deleteDocument.mutate(doc.key);
                  }
                }}
              >
                Delete
              </Button>
             <Button
                variant="primary"
               onClick={() => window.open(doc.viewUrl, '_blank', 'noopener,noreferrer')}
              >
                View
              </Button>
              <Button
                variant="secondary"
                onClick={() => downloadFileFromUrl(doc.viewUrl as string, doc.fileName)}
                >
                Download
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}