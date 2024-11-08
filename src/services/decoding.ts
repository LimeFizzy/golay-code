import { H, B } from "./constants";
import { EncodedMessage } from "./types";
import { binarySum, binaryProd } from "./utils";

const getWeight = (msg: number[]) => {
    return msg.reduce((a, b) => a + b, 0);
}

const formatInput = (encoded: EncodedMessage) => {
    const formatted: number[] = [];
    encoded.forEach((value, index) => formatted[index] = value);

    formatted[23] = getWeight(formatted) % 2 ? 0 : 1;

    return formatted;
}

export const getSyndrome = (encoded: any) => {
    const syndrome: number[] = new Array(24).fill(0);
    const formatted = formatInput(encoded);

    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 24; j++) {
            syndrome[i] = binarySum(syndrome[i], binaryProd(formatted[j], H[j][i]))
        } 
    }

    return syndrome.slice(0, 12);
}

export const decode = (encoded: number[]) => {
    const u: number[] = new Array(24).fill(0); // error vector
    let decodable = true;
    const sB: number[] = new Array(12).fill(0); // Second syndrome vector

    const formatted = formatInput(encoded as EncodedMessage);
    const syndrome = getSyndrome(formatted);

    // If weight of syndrome is <= 3, use it as error pattern u = [s, 0]
    if (getWeight(syndrome) <= 3) {
        syndrome.forEach((bit, index) => u[index] = bit);
    } else {
        let found = false;

        // Step 3: Check if weight(s + B[i]) <= 2 for any row B[i]
        for (let i = 0; i < 12; i++) {
            const tempSyndrome = syndrome.map((bit, j) => binarySum(bit, B[i][j]));
            if (getWeight(tempSyndrome) <= 2) {
                for (let k = 0; k < 12; k++) {
                    u[k] = tempSyndrome[k];
                }
                for (let k = 12; k < 24; k++) {
                    u[k] = (k - 12 === i) ? 1 : 0;
                }
                found = true;
                break;
            }
        }

        if (!found) {
            // Step 4: Compute the second syndrome sB = syndrome * B
            for (let i = 0; i < 12; i++) {
                sB[i] = 0;
                for (let j = 0; j < 12; j++) {
                    sB[i] = binarySum(sB[i], binaryProd(syndrome[j], B[j][i]));
                }
            }

            // Step 5: If weight(sB) <= 3, use [0, sB] as error pattern
            if (getWeight(sB) <= 3) {
                for (let i = 0; i < 12; i++) {
                    u[i] = 0;
                    u[i + 12] = sB[i];
                }
            } else {
                // Step 6: Check if weight(sB + B[i]) <= 2 for some row B[i]
                let corrected = false;
                for (let i = 0; i < 12; i++) {
                    const tempSB = sB.map((bit, j) => binarySum(bit, B[i][j]));
                    if (getWeight(tempSB) <= 2) {
                        for (let k = 0; k < 12; k++) {
                            u[k] = (k === i) ? 1 : 0;
                            u[k + 12] = tempSB[k];
                        }
                        corrected = true;
                        break;
                    }
                }
                
                if (!corrected) {
                    decodable = false;
                }
            }
        }
    }

    console.log("Error vector:", u);

    // Decode if possible
    if (decodable) {
        const decoded: number[] = [];
        for (let i = 0; i < 23; i++) {
            decoded[i] = binarySum(formatted[i], u[i]);
        }
        console.log("Decoded message:", decoded);
        return decoded;
    } else {
        console.error("ERROR: Message undecodable...");
        return [];
    }
}