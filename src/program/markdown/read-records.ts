import * as Path from 'path';

import {GIT_DIR_PATH, shortenPath} from '../utils/config';
import {readFile} from '../utils/file';

import {parse} from './parser';

const ROOT_PATH_SYMBOL = '@';

export type CommitterList = string[];

export interface MarkdownReadListScope {
  markdownPath: string;
  committers: CommitterList;
}

export class ReadRecords {
  private table = new Map<string, MarkdownReadListScope[]>();

  async process(path: string) {
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

        resolvedPath = Path.join(GIT_DIR_PATH, relativePathToRoot);
      } else {
        resolvedPath = Path.resolve(path, watchedPath);
      }

      let scopes = [{markdownPath: path, committers}];

      let originalScopes = this.table.get(resolvedPath);

      if (originalScopes) {
        scopes = originalScopes.concat(scopes);
      }

      this.table.set(resolvedPath, scopes);
    }

    console.log(this.table);
  }

  checkReadAboutByCommitter(path: string, committer: string): void {
    let lastPath;

    while (path !== lastPath) {
      lastPath = path;

      let scopes = this.table.get(path);

      if (scopes) {
        for (let scope of scopes) {
          let {markdownPath, committers} = scope;

          if (committers.indexOf(committer) === -1) {
            throw new Error(
              `Document about path \`${shortenPath(
                path,
              )}\` is not read by committer \`${committer}\`. (${shortenPath(
                markdownPath,
              )})`,
            );
          }
        }
      }

      path = Path.join(path, '..');
    }
  }
}
