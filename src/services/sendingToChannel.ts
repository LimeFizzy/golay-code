import { binarySum } from "./utils";

export const sendThroughChannel = (encodedMsg: number[], errorPossibility = 0): number[] => 
    encodedMsg.map(bit => 
        parseFloat(Math.random().toFixed(5)) < errorPossibility ? binarySum(bit, 1) : bit
    );