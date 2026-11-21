import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useLogout } from '../../features/auth/useLogout';

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#4f46e5" />
      <path d="M7 16V9.5L12 7l5 2.5V16" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 16v-4h5v4" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_LINKS: { to: string; label: string; adminOnly: boolean }[] = [
  { to: '/', label: 'Dashboard', adminOnly: false },
  { to: '/projects', label: 'Projects', adminOnly: true },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const email = useSelector((s: RootState) => s.auth.email);
  const role = useSelector((s: RootState) => s.auth.role);
  const location = useLocation();
  const logout = useLogout();

  const isAuthed = Boolean(accessToken);
  const visibleLinks = NAV_LINKS.filter(link => !link.adminOnly || role === 'admin');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Logo />
              BuildTrack
            </Link>
            {isAuthed && (
              <nav className="hidden items-center gap-1 sm:flex">
                {visibleLinks.map(link => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {isAuthed && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-slate-900">{email ?? '…'}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{role ?? ''}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {(email ?? '?').slice(0, 1).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
