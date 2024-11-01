import { G } from './constants';
import { MessageToEncode } from './types';
import { bin_add, bin_mult } from './utils';

export const encode = (msg: MessageToEncode) => {
    if (msg.length !== 12) {
        console.log(`This message can't be encoded.`);
        return;
    }

    const result: number[] = new Array(23).fill(0);
    
    for (let i = 0; i < 23; i++) {
        for (let j = 0; j < 12; j++) {
            result[i] = bin_add(result[i], bin_mult(msg[j], G[j][i]));
        }
    }
    return result;
}
