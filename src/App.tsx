import "./App.css";
import { encode } from "./services/encoding";
import { Navbar } from "./components/navbar/Navbar";
import { Dropdown } from "./components/dropdown/Dropdown";
import { InputField } from "./components/input-field/InputField";
import { TextField } from "./components/text-field/TextField";
import arrow from "./assets/arrow.svg";
import { StyledButton } from "./components/button/Button";
import { useState } from "react";
import { MessageToEncode } from "./services/types";

function App() {
  const [input, setInput] = useState("");
  const [errorPossibility, setErrorPossibility] = useState(0);
  const [encoded, setEncoded] = useState("");

  const handleEncodeClick = () => {
    const msg = input.split("").map((c) => Number(c));
    const encoded = encode(msg as MessageToEncode);
    setEncoded(encoded?.join("")!);
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="input-container">
          <Dropdown />
          <InputField
            placeholder="Provide input here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <InputField
            placeholder="Error possibility [0, 1]..."
            value={errorPossibility}
            onChange={(e) => setErrorPossibility(e.target.value)}
          />
        </div>
        <div className="results-container">
          <TextField label="Encoded message" text={encoded || "..."} />
          <img src={arrow}></img>
          <TextField
            label="Message after chanel"
            text="tessdkjfhnskdfjhsudjfksdfvot"
          />
          <img src={arrow}></img>
          <TextField
            label="Decoded message"
            text="tessdkjfhnskdfjhsudjfksdfvot"
          />
        </div>
        <div className="buttons-container">
          <StyledButton label="Encode" onClick={handleEncodeClick} />
          <StyledButton label="Send to chanel" />
          <StyledButton label="Decode" />
        </div>
      </div>
    </>
  );
}

export default App;
