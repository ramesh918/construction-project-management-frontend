import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { useDeleteProject } from './useDeleteProject';
import type { Project } from '../../shared/types/project';

interface DeleteProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function DeleteProjectModal({ project, onClose }: DeleteProjectModalProps) {
  const deleteProject = useDeleteProject();

  function handleConfirm() {
    deleteProject.mutate(project.id, { onSuccess: onClose });
  }

  return (
    <Modal open onClose={onClose} title="Delete project">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">{project.name}</span>? This cannot be undone.
        </p>

        {deleteProject.isError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {(deleteProject.error as Error).message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm} disabled={deleteProject.isPending}>
            {deleteProject.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}