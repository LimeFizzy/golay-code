import { G } from './constants';
import { MessageToEncode } from './types';

export const encode = (msg: MessageToEncode) => {
    if (msg. length !== 12) {
        console.log(`This message can't be encoded.`);
        return;
    }

    const result = [];
    for (let j = 0; j < G[0].length; j++) {
        let sum = 0;
        for (let i = 0; i < G.length; i++) {
            sum += G[i][j] * msg[i];
        }
        result[j] = sum % 2;
    }
    return result;
}
