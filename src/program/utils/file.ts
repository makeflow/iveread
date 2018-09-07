import * as FS from 'fs';
import * as Path from 'path';
import {promisify} from 'util';

export const exists = promisify(FS.exists);
export const stat = promisify(FS.stat);
export const readDir = promisify(FS.readdir);
export const readFile = promisify(FS.readFile);

export async function find(
  path: string,
  filter: RegExp | string,
): Promise<string[]> {
  if (!(await exists(path))) {
    return [];
  }

  let result: string[] = [];

  let filenames = await readDir(path);

  for (let filename of filenames) {
    let filePath = Path.join(path, filename);

    let fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      result = result.concat(await find(filePath, filter));
    } else {
      if (typeof filter === 'string') {
        if (filename.indexOf(filter) !== -1) {
          result.push(filePath);
        }
      } else {
        if (filter.test(filename)) {
          result.push(filePath);
        }
      }
    }
  }

  return result;
}
