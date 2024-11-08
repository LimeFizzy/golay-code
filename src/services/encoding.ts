import { G } from './constants';
import { MessageToEncode } from './types';
import { binarySum, binaryProd } from './utils';

export const encode = (msg: MessageToEncode) => {
    if (msg.length !== 12) {
        console.log(`This message can't be encoded.`);
        return;
    }

    const result: number[] = new Array(23).fill(0);
    
    for (let i = 0; i < 23; i++) {
        for (let j = 0; j < 12; j++) {
            result[i] = binarySum(result[i], binaryProd(msg[j], G[j][i]));
        }
    }
    return result;
}
