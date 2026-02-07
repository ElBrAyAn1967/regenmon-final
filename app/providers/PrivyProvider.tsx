// ==============================================
// PRIVY AUTH PROVIDER
// ==============================================
// Configuración de Privy para autenticación de estudiantes
// IMPORTANTE: NO crypto wallets, solo métodos tradicionales

"use client";

import { PrivyProvider as Privy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Privy
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "google", "sms", "twitter", "discord", "github", "apple"],
        appearance: {
          theme: "light",
          accentColor: "#209cee",
          // Sin logo personalizado para evitar errores de carga
        },
        embeddedWallets: {
          createOnLogin: "off", // NO crear wallets
        },
        defaultChain: undefined, // NO usar blockchain
      }}
      onSuccess={() => {
        router.push("/"); // Redirigir después de login
      }}
    >
      {children}
    </Privy>
  );
}
