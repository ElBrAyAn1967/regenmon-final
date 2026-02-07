// ==============================================
// USE STATS HOOK
// ==============================================
// Hook para obtener estadísticas globales del hub

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStats() {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher, {
    refreshInterval: 30000, // Refrescar cada 30 segundos
  });

  return {
    stats: data?.data,
    isLoading,
    error,
  };
}
