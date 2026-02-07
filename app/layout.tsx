import type { Metadata } from "next";
import { PrivyProvider } from "./providers/PrivyProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regenmon Hub - Bootcamp de Programación",
  description: "Aprende programación con tu Tamagotchi virtual y gana tokens $FRUTA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* NES.css Framework */}
        <link
          href="https://unpkg.com/nes.css@latest/css/nes.min.css"
          rel="stylesheet"
        />
        {/* Press Start 2P Font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: '"Press Start 2P", cursive' }}>
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  );
}
