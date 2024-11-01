import { Bit } from "./types";

export const bin_add = (a: Bit | number, b: Bit | number) => (a+b) % 2;
export const bin_mult = (a: Bit, b: Bit) => (a*b) % 2;