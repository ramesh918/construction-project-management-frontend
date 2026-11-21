import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../app/store';
import { useMe } from './useMe';

const QUICK_LINKS = [
  { to: '/projects', title: 'Projects', description: 'Create and track construction projects.', adminOnly: true },
  { to: '/admin', title: 'Admin Area', description: 'Reserved for administrators.', adminOnly: true },
];

export function WelcomePage() {
  const email = useSelector((s: RootState) => s.auth.email);
  const role = useSelector((s: RootState) => s.auth.role);

  // Only fetch /auth/me if we don't already have the identity (e.g. a fresh
  // login already dispatched it; a page refresh needs this to repopulate it).
  useMe(!role);

  const links = QUICK_LINKS.filter(link => !link.adminOnly || role === 'admin');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{email ? `, ${email}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {role ? `Signed in as ${role === 'admin' ? 'Administrator' : 'Site Supervisor'}.` : 'Loading your account…'}
        </p>
      </div>

      {links.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600">{link.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{link.description}</p>
            </Link>
          ))}
        </div>
      )}

      {links.length === 0 && role && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          There&apos;s nothing to show here yet for your role — check back once the field modules (Step 8 onward) are live.
        </p>
      )}
    </div>
  );
}
