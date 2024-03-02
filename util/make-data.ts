import { execFile } from 'child_process';
import { access } from 'fs/promises';
import { emptyDir } from 'fs-extra';
import fs from 'fs/promises';
import path, { relative } from 'path';
import { promisify } from 'util';
import { rustErrorAsync } from 'luoluo-rust-error';
const exec = promisify(execFile);
async function cwdExec(
    file: string,
    args: string[],
    cwd: string,
    { input, log = true }: { input?: string; log?: boolean } = {},
) {
    if (log) {
        const commandLineLog = `$ ${file} ${JSON.stringify(args)}`;
        const cwdLog = relative(process.cwd(), cwd);
        console.log(cwdLog + commandLineLog);
    }
    const child = exec(file, args, { cwd });
    if (input !== undefined) {
        const stdin = child.child.stdin;
        if (stdin === null) {
            throw new Error('Cannot access `stdin` of child process');
        }
        stdin.write(input);
        stdin.emit('close');
    }
    return (await child).stdout;
}
export const compileOptions = [
    '-Wall',
    '-O2',
    '-std=c++17',
    '-Wl,--stack=268435456',
];
/**
 * @param index 1-indexed
 */
export type MakeInput = (index: number) => string | Promise<string>;
/**
 * @param makeInput is 1-indexed.
 * @description Put files like `in-1.txt` to force specific input.
 */
export default async function makeData(
    name: string,
    total: number,
    makeInput: MakeInput,
) {
    const rootPath = path.join('problems', name);
    const dataPath = path.join(rootPath, 'data');
    await emptyDir(dataPath);
    await cwdExec(
        'g++',
        ['std.cpp', '-o', 'main', ...compileOptions],
        rootPath,
    );
    for (let index = 1; index <= total; index++) {
        const samplePath = path.join(rootPath, `in-${index}.txt`);
        const inputPath = path.join(dataPath, `${index}.in`);
        const accessResult = await rustErrorAsync(access)(
            samplePath,
            fs.constants.R_OK,
        );
        if (accessResult.ok) {
            console.log(`in-${index}.txt detected.`);
            await fs.copyFile(samplePath, inputPath);
        } else {
            await fs.writeFile(inputPath, await makeInput(index));
        }
        const output = await cwdExec('main', [], rootPath, {
            input: await fs.readFile(inputPath, 'utf-8'),
            log: false,
        });
        await fs.writeFile(path.resolve(dataPath, `${index}.out`), output);
        console.log(`${index}.out written.`);
        ``;
    }
    await cwdExec('7z', ['a', 'data.zip', '*.in', '*.out'], dataPath);
}
