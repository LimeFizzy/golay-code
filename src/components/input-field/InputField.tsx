import "./InputField.css";

interface InputProps {
  placeholder?: string;
  value: string | number;
  onChange: (e: any) => void;
  label?: string;
}

export const InputField = ({
  placeholder,
  value,
  onChange,
  label,
}: InputProps) => {
  return (
    <div className="input-container">
      <label className="input-field-label">{label}</label>
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
