import { useState, type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectStatusFilter, type RootState } from '../../app/store';
import { useProjects } from './useProjects';
import { useCreateProject } from './useCreateProject';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Modal } from '../../shared/ui/Modal';
import { Badge } from '../../shared/ui/Badge';
import { Field } from '../../shared/ui/Field';
import { Table, TableBody, TableHead } from '../../shared/ui/Table';
import type { Project, ProjectStatus } from '../../shared/types/project';
import {EditProjectModal} from './EditProjectModal';
import {DeleteProjectModal} from './DeleteProjectModal';

const STATUS_OPTIONS: ProjectStatus[] = ['Planning', 'Active', 'On Hold', 'Completed'];

const STATUS_TONE: Record<ProjectStatus, 'neutral' | 'success' | 'warning' | 'info'> = {
  Planning: 'neutral',
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'info',
};

const EMPTY_FORM = { name: '', location: '', startDate: '', endDate: '', budget: '', description: '' };

function currency(value: number): string {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
}


function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.3 2.3a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4L6 12.4l-3 .6.6-3 7.7-7.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5v-1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M4.5 4.5l.5 8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}



export function ProjectsListPage() {
  const dispatch = useDispatch();
  const statusFilter = useSelector((s: RootState) => s.ui.projectStatusFilter);
  const { data, isLoading, isError, error } = useProjects(statusFilter);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const createProject = useCreateProject();

  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    createProject.mutate(
      {
        name: form.name,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        description: form.description.trim() ? form.description : undefined,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setForm(EMPTY_FORM);
        },
      },
    );
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  const projects: Project[] = data?.data ?? [];
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Create and track construction projects.</p>
        </div>
        <Button onClick={openCreateModal}>
          <PlusIcon />
          Create Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total projects" value={String(data?.count ?? 0)} />
        <StatCard label="Active" value={String(activeCount)} />
        <StatCard label="Total budget" value={currency(totalBudget)} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-4">
          <div className="w-full max-w-xs">
            <Select
              aria-label="Filter by status"
              value={statusFilter ?? ''}
              onChange={e =>
                dispatch(setProjectStatusFilter(e.target.value ? (e.target.value as ProjectStatus) : undefined))
              }
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isLoading && <TableSkeleton />}

        {isError && <div className="p-6 text-sm text-red-600">{(error as Error).message}</div>}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <p className="text-sm font-medium text-slate-700">No projects yet</p>
            <p className="text-sm text-slate-500">Get started by creating your first project.</p>
            <Button onClick={openCreateModal} className="mt-2">
              <PlusIcon />
              Create Project
            </Button>
          </div>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3 text-right">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {projects.map(p => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.location}</td>
                  <td className="px-4 py-3 text-slate-600">{p.startDate}</td>
                  <td className="px-4 py-3 text-slate-600">{p.endDate}</td>
                  <td className="px-4 py-3 text-right text-slate-900">{currency(p.budget)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="secondary"
                      onClick={() => setEditProject(p)}
                      className="mr-2"
                    >
                      <PencilIcon />
                    </Button>
                    <Button variant="secondary" onClick={() => setDeleteProject(p)}>
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}

      {deleteProject && (
        <DeleteProjectModal
          project={deleteProject}
          onClose={() => setDeleteProject(null)}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Project name" htmlFor="name">
            <Input
              id="name"
              placeholder="e.g. Riverside Apartments"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Location" htmlFor="location">
            <Input
              id="location"
              placeholder="e.g. Austin, TX"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date" htmlFor="startDate">
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </Field>
            <Field label="End date" htmlFor="endDate">
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Budget (USD)" htmlFor="budget">
            <Input
              id="budget"
              type="number"
              placeholder="0.00"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              required
              min={1}
              step="0.01"
            />
          </Field>
          <Field label="Description" htmlFor="description" hint="Optional">
            <textarea
              id="description"
              rows={3}
              placeholder="Add any additional notes…"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </Field>

          {createProject.isError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {(createProject.error as Error).message}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating…' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
