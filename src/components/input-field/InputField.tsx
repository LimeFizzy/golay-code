import "./InputField.css";

interface InputProps {
  placeholder?: string;
  value: string | number;
  onChange: (e: any) => void;
  label?: string;
  description?: string;
}

export const InputField = ({
  placeholder,
  value,
  onChange,
  label,
  description,
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
      {description && <p className="input-field-description">{description}</p>}
    </div>
  );
};
