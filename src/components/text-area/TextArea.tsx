import React from "react";
import "./TextArea.css";

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  maxLength,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="text-area-container">
      <label className="text-area-label">{label}</label>
      <textarea
        className="text-area"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};
