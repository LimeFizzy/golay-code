import "./TextField.css";

interface TextFieldProps {
  label: string;
  text: string;
}

export const TextField = ({ label, text }: TextFieldProps) => {
  return (
    <div className="text-field-container">
      <label className="text-field-label">{label}</label>
      <div className="text-field">{text}</div>
    </div>
  );
};
