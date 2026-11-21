import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { apiFetchAuthed } from '../../shared/api/client';
import { setIdentity } from '../../app/store';
import type { AuthContext } from '../../shared/types/auth';

export function useMe(enabled: boolean) {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiFetchAuthed<AuthContext>('/auth/me'),
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setIdentity({ email: query.data.email, role: query.data.role }));
    }
  }, [query.data, dispatch]);

  return query;
}
