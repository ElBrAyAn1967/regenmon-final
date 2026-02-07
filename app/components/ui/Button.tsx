// ==============================================
// BUTTON COMPONENT (NES.css)
// ==============================================
// Botón pixel art con variantes de color

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "warning" | "error";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  isLoading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "is-primary",
    success: "is-success",
    warning: "is-warning",
    error: "is-error",
  };

  return (
    <button
      type="button"
      className={`nes-btn ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
