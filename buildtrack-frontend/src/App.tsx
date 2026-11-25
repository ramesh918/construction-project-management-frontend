import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './shared/ui/AppLayout'
import { ProtectedRoute } from './shared/ui/ProtectedRoute'
import { AdminRoute } from './shared/ui/AdminRoute'
import { LoginPage } from './features/auth/LoginPage'
import { WelcomePage } from './features/auth/WelcomePage'
import { AccessDeniedPage } from './features/auth/AccessDeniedPage'
import { ProjectsListPage } from './features/projects/ProjectsListPage'
import ProjectSummary  from './features/projects/ProjectSummary'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<WelcomePage />} />
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  Admin area placeholder — Step 5 onward builds real content here.
                </div>
              }
            />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:id" element={<ProjectSummary />} />
          </Route>
        </Route>
      </Routes>
    </AppLayout>
  )
}

export default App
