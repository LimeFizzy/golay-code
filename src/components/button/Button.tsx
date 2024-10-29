import "./Button.css";

interface ButtonProps {
  onClick?: () => void;
  label: string;
}

export const StyledButton = ({ onClick, label }: ButtonProps) => {
  return (
    <div className="input-container">
      <button className="styled-button" onClick={onClick}>
        {label}
      </button>
    </div>
  );
};
