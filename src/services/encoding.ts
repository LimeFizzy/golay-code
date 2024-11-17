import { G } from './constants';
import { binarySum, binaryProd } from './utils';

export const encode = (msg: number[]) => {
    if (msg.length !== 12) {
        console.log(`This message can't be encoded.`);
        return;
    }

    return Array.from({ length: 23 }, (_, i) =>
        (msg as number[]).reduce((sum, bit, j) => 
            binarySum(sum, binaryProd(bit, G[j][i])), 0)
    );
}
