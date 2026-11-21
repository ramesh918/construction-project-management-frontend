import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./client";

export function useBackendHealth() {
  return useQuery({
    queryKey: ['backend-health'],
    queryFn: () => apiFetch<{ status: string }>('/auth/health'),
  });
}