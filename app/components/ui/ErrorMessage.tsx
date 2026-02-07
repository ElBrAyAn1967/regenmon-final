// ==============================================
// ERROR MESSAGE (NES.css)
// ==============================================
// Mensaje de error con estilo retro

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="nes-container is-dark is-rounded" style={{ backgroundColor: "#ce372b" }}>
      <p>⚠️ {message}</p>
    </div>
  );
}
