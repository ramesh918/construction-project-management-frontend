export function AccessDeniedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.49 14.7A1 1 0 0 0 2.68 20h18.64a1 1 0 0 0 .87-1.44l-8.49-14.7a1 1 0 0 0-1.73 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-4 text-xl font-semibold text-slate-900">Access Denied</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        You don&apos;t have permission to view this page. If you believe this is a mistake, contact your
        administrator.
      </p>
    </div>
  );
}
