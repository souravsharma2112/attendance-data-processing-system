
type ButtonProps = {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button = ({
  title,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition ${className}`}
    >
      {title}
    </button>
  );
};

export default Button;