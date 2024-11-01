import { bin_add } from "./utils";

export const sendThroughtChannel = (encodedMsg: number[], errorPossibility: number = 0) => {
    const afterChannel = encodedMsg.map((bit) => {
        const err = parseFloat(Math.random().toFixed(5));
        return errorPossibility >= err ? bin_add(bit, 1) : bit;
    })

    return afterChannel;
}