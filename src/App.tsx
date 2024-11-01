import "./App.css";
import { encode } from "./services/encoding";
import { Navbar } from "./components/navbar/Navbar";
import { Dropdown } from "./components/dropdown/Dropdown";
import { InputField } from "./components/input-field/InputField";
import { TextField } from "./components/text-field/TextField";
import arrow from "./assets/arrow.svg";
import { StyledButton } from "./components/button/Button";
import { useCallback, useState } from "react";
import { MessageToEncode } from "./services/types";
import { sendThroughtChannel } from "./services/sendingToChannel";

function App() {
  const [input, setInput] = useState("");
  const [errorPossibility, setErrorPossibility] = useState("");
  const [encoded, setEncoded] = useState("");
  const [channelMsg, setChannelMsg] = useState("");

  const handleEncodeClick = useCallback(() => {
    const msg = input.split("").map((c) => Number(c));
    const encoded = encode(msg as MessageToEncode);
    setEncoded(encoded?.join("")!);
  }, [input, setEncoded]);

  const handleSendClick = useCallback(() => {
    const msg = encoded.split("").map((c) => Number(c));
    const afterChannel = sendThroughtChannel(msg, Number(errorPossibility));
    setChannelMsg(afterChannel?.join("")!);
  }, [encoded, errorPossibility]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const validBinaryPattern = /^[01]*$/;

      if (value.length <= 12 && validBinaryPattern.test(value)) {
        setInput(value);
      }
    },
    [setInput]
  );

  const handleErrorPossibilityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const validNumberPattern = /^\d*\.?\d{0,5}$/;
      const numericValue = parseFloat(value);
      if (
        validNumberPattern.test(value) &&
        (value === "" || (numericValue >= 0 && numericValue <= 1))
      ) {
        setErrorPossibility(value);
      }
    },
    [setErrorPossibility]
  );

  const handleChanelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const validBinaryPattern = /^[01]*$/;

      if (value.length <= 23 && validBinaryPattern.test(value)) {
        setChannelMsg(value);
      }
    },
    [setChannelMsg]
  );

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="data-container">
          <Dropdown />
          <InputField
            placeholder="Provide input here..."
            value={input}
            onChange={handleInputChange}
          />
          <InputField
            placeholder="Error possibility [0, 1]..."
            value={errorPossibility}
            onChange={handleErrorPossibilityChange}
          />
        </div>
        <div className="results-container">
          <TextField label="Encoded message" text={encoded || "..."} />
          <img src={arrow}></img>
          <InputField
            label="Message after chanel"
            value={channelMsg || "..."}
            onChange={handleChanelChange}
          />
          <img src={arrow}></img>
          <TextField label="Decoded message" text="to be done..." />
        </div>
        <div className="buttons-container">
          <StyledButton label="Encode" onClick={handleEncodeClick} />
          <StyledButton label="Send to chanel" onClick={handleSendClick} />
          <StyledButton label="Decode" />
        </div>
      </div>
    </>
  );
}

export default App;
