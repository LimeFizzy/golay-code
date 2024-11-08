import { binarySum } from "./utils";

export const sendThroughtChannel = (encodedMsg: number[], errorPossibility: number = 0) => {
    const afterChannel = encodedMsg.map((bit) => {
        const err = parseFloat(Math.random().toFixed(5));
        return errorPossibility >= err ? binarySum(bit, 1) : bit;
    })

    return afterChannel;
}