import "./InputField.css";

interface InputProps {
  placeholder: string;
  value: string | number;
  onChange: (e: any) => void;
}

export const InputField = ({ placeholder, value, onChange }: InputProps) => {
  return (
    <div className="input-container">
      <input
        type="text"
        className="styled-input"
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
};
