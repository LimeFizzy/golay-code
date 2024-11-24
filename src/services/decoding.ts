import { H, B } from "./constants";
import { binarySum, binaryProd } from "./utils";

const getWeight = (msg: number[]) => {
    return msg.reduce((a, b) => a + b, 0);
}

const formatInput = (encoded: number[]) => {
    const formatted = [...encoded];
    formatted[23] = getWeight(formatted) % 2 ? 0 : 1;
    return formatted;
}

const getSyndrome = (encoded: number[]): number[] => {
    const formatted: number[] = formatInput(encoded);
    return Array.from({ length: 12 }, (_, i) => 
        formatted.reduce((syndrome, bit, j) => 
            binarySum(syndrome, binaryProd(bit, H[j][i])), 0)
    );
}

export const decode = (encoded: number[]) => {
    const u: number[] = new Array(24).fill(0); // error vector
    let decodable = true;

    // Prepare encoded message for the C24 decoding algorithm
    const formatted = formatInput(encoded);
    // Step 1: Compute the syndrome s = wH
    const syndrome = getSyndrome(formatted);

    // Step 2: If weight of syndrome is <= 3, use it as error pattern u = [s, 0]
    if (getWeight(syndrome) <= 3) {
        syndrome.forEach((bit, index) => u[index] = bit);
    } else {
        let found = false;

        // Step 3: Check if weight(s + B[i]) <= 2 for any row B[i]
        // if so, u = [s + b_i, e_i]
        for (let i = 0; i < 12; i++) {
            const tempSyndrome = syndrome.map((bit, j) => binarySum(bit, B[i][j]));
            if (getWeight(tempSyndrome) <= 2) {
                tempSyndrome.forEach((bit, k) => u[k] = bit);
                u[12 + i] = 1;
                found = true;
            }
        }

        if (!found) {
            // Step 4: Compute the second syndrome sB = syndrome * B
            const sB = Array.from({ length: 12 }, (_, i) =>
                syndrome.reduce((sum, bit, j) => binarySum(sum, binaryProd(bit, B[j][i])), 0)
            );

            // Step 5: If weight(sB) <= 3, use [0, sB] as error pattern
            if (getWeight(sB) <= 3) {
                sB.forEach((bit, i) => { u[i + 12] = bit; });
            } else {
                // Step 6: Check if weight(sB + B[i]) <= 2 for some row B[i]
                // if so, u = [e_i, sB + b_i]
                let corrected = false;
                for (let i = 0; i < 12 && !corrected; i++) {
                    const tempSB = sB.map((bit, j) => binarySum(bit, B[i][j]));
                    if (getWeight(tempSB) <= 2) {
                        u[i] = 1;
                        tempSB.forEach((bit, k) => u[k + 12] = bit);
                        corrected = true;
                    }
                }
                
                if (!corrected) {
                    decodable = false;
                }
            }
        }
    }

    // Decode if possible
    if (decodable) {
        return formatted.slice(0, 23).map((bit, i) => binarySum(bit, u[i]));
    } else {
        console.error("ERROR: Message undecodable...");
        return [];
    }
}