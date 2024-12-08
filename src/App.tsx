import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import { encode } from "./services/encoding";
import { Navbar } from "./components/navbar/Navbar";
import { Dropdown } from "./components/dropdown/Dropdown";
import { InputField } from "./components/input-field/InputField";
import { TextField } from "./components/text-field/TextField";
import { TextArea } from "./components/text-area/TextArea";
import arrow from "./assets/arrow.svg";
import { StyledButton } from "./components/button/Button";
import { sendThroughChannel } from "./services/sendingToChannel";
import { decode } from "./services/decoding";
import {
  binaryToText,
  decodeText,
  encodeText,
  sendTextThroughChannel,
  splitIntoBlocks,
  textToBinary,
} from "./services/textFlow";
import { processImage } from "./services/imageFlow";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [errorPossibility, setErrorPossibility] = useState<string>("");
  const [inputType, setInputType] = useState<string>("binary");

  const [encoded, setEncoded] = useState<string>("");
  const [channelMsg, setChannelMsg] = useState<string>("");
  const [decoded, setDecoded] = useState<string>("");
  const [errors, setErrors] = useState("");

  const [inputLenght, setInputLenght] = useState<number>(0);
  const [encodedText, setEncodedText] = useState<string>("");
  const [encodedTextBlocks, setEncodedTextBlocks] =
    useState<(number[] | undefined)[]>();
  const [textAfterChannel, setTextAfterChannel] = useState<string>();
  const [textBlocks, setTextBlocks] = useState<number[][]>();
  const [textDecoded, setTextDecoded] = useState<string>();

  const [binaryText, setBinaryText] = useState<string>();
  const [binaryTextBlocks, setBinaryTextBlocks] = useState<number[][]>();
  const [sentBinaryText, setSentBinaryText] = useState<number[][]>();
  const [decodedBinText, setDecodedBinText] = useState<string>();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDropdownChange = useCallback((value: string) => {
    setInputType(value);
    setInput("");
    setEncoded("");
    setChannelMsg("");
    setDecoded("");
    setErrors("");
  }, []);

  const handleEncodeClick = useCallback(() => {
    if (inputType === "binary") {
      const msg = input.split("").map((c) => Number(c));
      const encodedBinary = encode(msg);
      setEncoded(encodedBinary?.join("")!);
    } else if (inputType === "text") {
      const { binaryData, originalLength } = textToBinary(input);
      setBinaryText(binaryData.join(""));
      setInputLenght(originalLength);
      const binaryBlocks = splitIntoBlocks(binaryData);
      setBinaryTextBlocks(binaryBlocks);
      const encodedBlocks = encodeText(binaryBlocks);
      setEncodedTextBlocks(encodedBlocks);
      const encodedT = encodedBlocks.join("\n").replaceAll(",", "");
      setEncodedText(encodedT);
    }
  }, [input, inputType, errorPossibility]);

  const handleSendClick = useCallback(() => {
    if (inputType === "binary") {
      const msg = encoded.split("").map((c) => Number(c));
      const afterChannel = sendThroughChannel(msg, Number(errorPossibility));
      setChannelMsg(afterChannel?.join("")!);
      setErrors(calculateErrors(afterChannel?.join("")!));
    } else if (inputType === "text") {
      const transmittedBlocks = encodedTextBlocks!.map((block) =>
        sendTextThroughChannel(block!, Number(errorPossibility))
      );
      const sentBlocks = binaryTextBlocks!.map((block) =>
        sendTextThroughChannel(block!, Number(errorPossibility))
      );
      setSentBinaryText(sentBlocks);
      setTextBlocks(transmittedBlocks);
      setTextAfterChannel(transmittedBlocks.join("\n").replaceAll(",", ""));
    }
  }, [
    encoded,
    errorPossibility,
    inputType,
    encodedTextBlocks,
    channelMsg,
    binaryTextBlocks,
  ]);

  const handleDecodeClick = useCallback(() => {
    if (inputType === "binary") {
      const decodedBinary = decode(channelMsg.split("").map((c) => Number(c)));
      setDecoded(decodedBinary?.join("")!.slice(0, 12));
    } else if (inputType === "text") {
      const decodedBinary = decodeText(textBlocks!, inputLenght);
      const decodedText = binaryToText(decodedBinary);

      const decodedBin = binaryToText(sentBinaryText?.flat()!);

      setDecodedBinText(decodedBin);
      setTextDecoded(decodedText);
    }
  }, [channelMsg, inputType, textBlocks, inputLenght, sentBinaryText]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = e.target;

      if (inputType === "binary") {
        const validBinaryPattern = /^[01]*$/;
        if (value.length <= 12 && validBinaryPattern.test(value)) {
          setInput(value);
        }
      } else if (inputType === "text") {
        setInput(value);
      }
    },
    [inputType]
  );

  const handleChannelChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = e.target;

      const validBinaryPattern = /^[01]*$/;
      if (value.length <= 23 && validBinaryPattern.test(value)) {
        setChannelMsg(value);
        setErrors(calculateErrors(value));
      }
    },
    [inputType]
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
    []
  );

  const calculateErrors = useCallback(
    (afterChan: string) => {
      const encodedVector = encoded.toString();
      const afterChannel = afterChan.toString();

      let errorCount = 0;
      const errorPositions: number[] = [];

      for (let i = 0; i < encodedVector.length; i++) {
        if (encodedVector[i] !== afterChannel[i]) {
          errorCount++;
          errorPositions.push(i + 1);
        }
      }

      return errorCount
        ? `${errorCount} errors appeared at positions ${errorPositions.join(
            ", "
          )}`
        : "";
    },
    [encoded, channelMsg]
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && canvasRef.current) {
      setImageFile(file);
      await processImage(file, Number(errorPossibility), canvasRef.current);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="data-container">
          <Dropdown onChange={handleDropdownChange} />
          {inputType === "binary" ? (
            <InputField
              placeholder="Input 12 bits (0 and 1)..."
              value={input}
              onChange={handleInputChange}
            />
          ) : (
            <TextArea
              label="Input text"
              value={input}
              onChange={(value) => setInput(value)}
              maxLength={50}
            />
          )}
          <InputField
            placeholder="Error possibility [0, 1]..."
            value={errorPossibility}
            onChange={handleErrorPossibilityChange}
          />
        </div>
        {inputType === "text" ? (
          <div className="no-encoding">
            <TextArea
              label="Binary message"
              value={binaryText || "..."}
              onChange={() => {}}
            />
            <img src={arrow} alt="Arrow" />
            <TextArea
              label="Message after channel"
              value={sentBinaryText?.join("\n").replaceAll(",", "") || "..."}
              onChange={() => {}}
            />
            <img src={arrow} alt="Arrow" />
            <TextArea
              label="Decoded message"
              value={decodedBinText || "..."}
              onChange={() => {}}
            />
          </div>
        ) : null}
        <div className="results-container">
          {inputType === "binary" ? (
            <TextField label="Encoded message" text={encoded || "..."} />
          ) : (
            <TextArea
              label="Encoded message"
              value={encodedText || "..."}
              onChange={() => {}}
            />
          )}
          <img src={arrow} alt="Arrow" />
          {inputType === "binary" ? (
            <InputField
              label="Message after channel"
              value={channelMsg || "..."}
              onChange={handleChannelChange}
              description={errors}
            />
          ) : (
            <TextArea
              label="Message after channel"
              value={textAfterChannel || "..."}
              onChange={() => {}}
            />
          )}
          <img src={arrow} alt="Arrow" />
          {inputType === "binary" ? (
            <TextField label="Decoded message" text={decoded || "..."} />
          ) : (
            <TextArea
              label="Decoded message"
              value={textDecoded || "..."}
              onChange={() => {}}
            />
          )}
        </div>
        <div className="buttons-container">
          <StyledButton label="Encode" onClick={handleEncodeClick} />
          <StyledButton label="Send to channel" onClick={handleSendClick} />
          <StyledButton label="Decode" onClick={handleDecodeClick} />
        </div>
      </div>
      {/* <div>
        <input type="file" onChange={handleImageUpload} />
        <canvas ref={canvasRef} width="500" height="500" />
      </div> */}
    </>
  );
};

export default App;
