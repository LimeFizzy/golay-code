import { decode } from "./decoding";
import { encode } from "./encoding";

export const textToBinary = (text: string): { binaryData: number[], originalLength: number } => {
    const binaryData = text.split('').flatMap(char => {
        const charCode = char.charCodeAt(0);
        return charCode.toString(2).padStart(8, '0').split('').map(Number);
    });
    return { binaryData, originalLength: binaryData.length };
};

export const splitIntoBlocks = (binaryData: number[], blockSize: number = 12): number[][] => {
    const blocks = [];
    for (let i = 0; i < binaryData.length; i += blockSize) {
        blocks.push(binaryData.slice(i, i + blockSize).concat(new Array(blockSize).fill(0)).slice(0, blockSize));
    }
    return blocks;
};

export const encodeText = (binaryBlocks: number[][]) => 
    binaryBlocks.map(block => encode(block));

export const decodeText = (receivedBlocks: number[][], originalLength: number): number[] => {
    const fullBinaryData = receivedBlocks.flatMap(block => decode(block).slice(0, 12));
    return fullBinaryData.slice(0, originalLength);
};

export const binaryToText = (binaryData: number[]): string => 
    binaryData.reduce((text, _, i, arr) => 
        (i % 8 === 0 ? text + String.fromCharCode(parseInt(arr.slice(i, i + 8).join(''), 2)) : text), 
        '');
