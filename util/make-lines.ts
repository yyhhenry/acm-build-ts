export default function makeLines() {
    const lines = new Array<string>();
    const clear = () => {
        while (lines.length) {
            lines.pop();
        }
    };
    const push = (...elements: (string | number)[]) => {
        lines.push(elements.join(' '));
    };
    const collect = () => {
        if (lines.length === 0 || lines[lines.length - 1] !== '') {
            lines.push('');
        }
        const result = lines.join('\n');
        clear();
        return result;
    };
    return {
        push,
        collect,
        clear,
    };
}
