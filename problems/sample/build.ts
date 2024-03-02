import makeData from '@/util/make-data';
import makeLines from '@/util/make-lines';
import { rangeRandom, scaleRandom, indexArray } from '@/util/random';

makeData('sample', 10, async () => {
    const lines = makeLines();
    const n = scaleRandom(40);
    lines.push(n);
    lines.push(
        indexArray(n)
            .map(() => rangeRandom(1, 20))
            .join(' '),
    );
    return lines.collect();
});
