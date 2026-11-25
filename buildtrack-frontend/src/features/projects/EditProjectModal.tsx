import { useState, type FormEvent } from 'react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { useUpdateProject } from './useUpdateProject';
import type { Project } from '../../shared/types/project';

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const updateProject = useUpdateProject();
  const [form, setForm] = useState({
    name: project.name,
    location: project.location,
    startDate: project.startDate,
    endDate: project.endDate,
    budget: String(project.budget),
    description: project.description ?? '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateProject.mutate(
      {
        id: project.id,
        patch: {
          name: form.name,
          location: form.location,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: Number(form.budget),
          description: form.description.trim() ? form.description : undefined,
        },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal open onClose={onClose} title={`Edit ${project.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Project name" htmlFor="edit-name">
          <Input id="edit-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Location" htmlFor="edit-location">
          <Input id="edit-location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date" htmlFor="edit-startDate">
            <Input
              id="edit-startDate"
              type="date"
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              required
            />
          </Field>
          <Field label="End date" htmlFor="edit-endDate">
            <Input
              id="edit-endDate"
              type="date"
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </Field>
        </div>
        <Field label="Budget (USD)" htmlFor="edit-budget">
          <Input
            id="edit-budget"
            type="number"
            min={1}
            step="0.01"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            required
          />
        </Field>
        <Field label="Description" htmlFor="edit-description" hint="Optional">
          <textarea
            id="edit-description"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </Field>

        {updateProject.isError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {(updateProject.error as Error).message}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProject.isPending}>
            {updateProject.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}