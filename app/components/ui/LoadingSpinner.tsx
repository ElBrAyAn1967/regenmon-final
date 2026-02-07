// ==============================================
// LOADING SPINNER (NES.css)
// ==============================================
// Loading indicator con icono pixel art

export function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <i className="nes-icon is-large heart"></i>
      <p className="mt-2">Loading...</p>
    </div>
  );
}
