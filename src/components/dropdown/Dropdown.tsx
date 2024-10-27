import "./Dropdown.css";

export const Dropdown = () => {
  return (
    <div className="dropdown-container">
      <select className="styled-dropdown">
        <option value="" disabled selected>
          Choose input type
        </option>
        <option value="text">Text</option>
        <option value="binary">Binary</option>
      </select>
    </div>
  );
};
