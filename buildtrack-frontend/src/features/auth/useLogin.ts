import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { apiFetch } from '../../shared/api/client';
import { saveTokens } from '../../shared/api/sessionStorage';
import { setTokens } from '../../app/store';
import type { AuthTokens, LoginInput } from '../../shared/types/auth';

export function useLogin() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (body: LoginInput) =>
      apiFetch<AuthTokens>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: tokens => {
      saveTokens(tokens);
      dispatch(setTokens(tokens));
    },
  });
}
