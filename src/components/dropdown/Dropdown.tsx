import React from "react";
import "./Dropdown.css";

interface DropdownProps {
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ onChange }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="dropdown-container">
      <select
        className="styled-dropdown"
        onChange={handleSelectChange}
        defaultValue={"binary"}
      >
        <option value="" disabled selected>
          Choose input type
        </option>
        <option value="binary">Binary</option>
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>
    </div>
  );
};
