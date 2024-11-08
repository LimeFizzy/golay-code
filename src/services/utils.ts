import { Bit } from "./types";

export const binarySum = (a: Bit | number, b: Bit | number) => (a+b) % 2;
export const binaryProd = (a: Bit | number, b: Bit | number) => (a*b) % 2;