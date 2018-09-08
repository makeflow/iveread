import * as FS from 'fs';
import {promisify} from 'util';

import _glob from 'glob';

import {CONFIG_DIR_PATH} from './config';

export const exists = promisify(FS.exists);
export const stat = promisify(FS.stat);
export const readDir = promisify(FS.readdir);
export const readFile = promisify(FS.readFile);
export const glob = promisify(_glob);

export async function find(path: string, pattern: string): Promise<string[]> {
  return glob(pattern, {
    cwd: path,
    root: CONFIG_DIR_PATH,
    absolute: true,
  });
}
