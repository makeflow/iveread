import * as Path from 'path';

import {CONFIG_DIR_PATH, CONFIG_PATH} from '../utils/config';
import {readFile} from '../utils/file';

import {parse} from './parser';

const ROOT_PATH_SYMBOL = '@';

export type CommitterList = string[];

export interface MarkdownReadListScope {
  markdownPath: string;
  committers: CommitterList;
}

export class ReadInfoTable {
  private table = new Map<string, MarkdownReadListScope[]>();

  async process(path: string) {
    path = Path.resolve(path);

    let buffer = await readFile(path);

    let result = parse(buffer.toLocaleString());

    if (result) {
      let {path: watchedPath, committers} = result;

      let regex = new RegExp(`^${ROOT_PATH_SYMBOL}[\\/]`);

      let match = watchedPath.match(regex);

      let resolvedPath;

      if (match) {
        let matchedHead = match[0];

        let relativePathToRoot = watchedPath.slice(matchedHead.length);

        resolvedPath = Path.join(CONFIG_DIR_PATH, relativePathToRoot);
      } else {
        resolvedPath = Path.resolve(path, watchedPath);
      }

      let scopes = [{markdownPath: path, committers}];

      if (this.table.has(resolvedPath)) {
        let originalScopes = this.table.get(resolvedPath)!;

        scopes = originalScopes.concat(scopes);
      }

      this.table.set(resolvedPath, scopes);
    }
  }

  isReadByCommitter(path: string, committer: string): boolean {}
}
