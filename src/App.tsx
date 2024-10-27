import "./App.css";
import { encode } from "./services/encoding";
import { Navbar } from "./components/navbar/Navbar";
import { Dropdown } from "./components/dropdown/Dropdown";
import { InputField } from "./components/input-field/InputField";

function App() {
  console.log(encode([1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0]));

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="input-container">
          <Dropdown />
          <InputField />
        </div>
      </div>
    </>
  );
}

export default App;
