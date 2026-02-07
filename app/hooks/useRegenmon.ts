// ==============================================
// USE REGENMON HOOK
// ==============================================
// Hook para obtener datos de un Regenmon específico

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRegenmon(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/regenmon/${id}` : null,
    fetcher
  );

  return {
    regenmon: data?.data,
    isLoading,
    error,
  };
}
