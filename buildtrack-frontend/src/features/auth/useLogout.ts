import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../shared/api/client';
import { clearTokens } from '../../shared/api/sessionStorage';
import { clearAuth } from '../../app/store';

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
    // Best-effort: invalidate the Cognito session server-side too. We don't
    // await this or block on failure — the user is logging out regardless.
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    clearTokens();
    dispatch(clearAuth());
    navigate('/login');
  };
}
