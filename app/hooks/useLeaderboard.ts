// ==============================================
// USE LEADERBOARD HOOK
// ==============================================
// Hook para obtener ranking de Regenmons con paginación

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useLeaderboard(page: number = 1, limit: number = 10) {
  const { data, error, isLoading } = useSWR(
    `/api/leaderboard?page=${page}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 60000, // Refrescar cada 60 segundos
    }
  );

  return {
    leaderboard: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
}
