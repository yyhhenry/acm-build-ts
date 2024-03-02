export function rangeRandom(l: number, r: number) {
    if (l <= r) {
        return l + Math.floor(Math.random() * (r - l + 1));
    } else {
        throw new RangeError('l should be less than or equal to r');
    }
}
export function scaleRandom(limit: number) {
    return rangeRandom(Math.ceil(0.9 * limit), limit);
}
export function randomInterval(l: number, r: number): [number, number] {
    const a = rangeRandom(l, r);
    const b = rangeRandom(l, r);
    return a <= b ? [a, b] : [b, a];
}
export function randomDifferentTwo(l: number, r: number): [number, number] {
    const a = rangeRandom(l, r);
    const b = rangeRandom(l, r - 1);
    return a <= b ? [a, b + 1] : [a, b];
}
export function indexArray(n: number) {
    return [...Array(n).keys()];
}
export function shuffle<T>(arr: T[]) {
    const ans = [...arr];
    for (const i of ans.keys()) {
        const j = rangeRandom(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return ans;
}
export function randomPermutation(n: number) {
    return shuffle(indexArray(n));
}
export function randomChoice<T>(arr: T[]) {
    return arr[rangeRandom(0, arr.length - 1)];
}
export function weightBasedRandomChoice<T>(arr: [T, number][]) {
    const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
    let r = Math.random() * sum;
    for (const [v, w] of arr) {
        if (r <= w) {
            return v;
        }
        r -= w;
    }
    throw new Error('weightBasedRandomChoice: unreachable');
}
/**
 * 0-indexed
 */
export function randomTree(n: number, dis: number) {
    const vertices = randomPermutation(n);
    const edges: [number, number][] = [];
    for (const [i, v] of vertices.entries()) {
        const l = Math.max(0, i - dis);
        edges.push([v, vertices[rangeRandom(l, i - 1)]]);
    }
    return shuffle(edges);
}
