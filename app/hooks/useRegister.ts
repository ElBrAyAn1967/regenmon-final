// ==============================================
// USE REGISTER HOOK
// ==============================================
// Hook para registrar un nuevo Regenmon en el hub

import { useState } from "react";

interface RegisterData {
  name: string;
  ownerName: string;
  ownerEmail?: string;
  privyUserId?: string;
  appUrl: string;
  sprite: string;
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const register = async (formData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }

      setData(result.data);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, data };
}
