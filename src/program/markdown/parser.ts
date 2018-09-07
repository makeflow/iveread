import {CommitterList} from './read-info-table';

const REGEX_IVEREAD_SECTION = /```iveread: (.*?)\s+((.|\s)*?)\s*```/;

export interface ParseResult {
  path: string;
  committers: CommitterList;
}

export function parse(markdown: string): ParseResult | undefined {
  let matches = markdown.match(REGEX_IVEREAD_SECTION);

  if (matches) {
    let path = matches[1];
    let committers: CommitterList = [];

    if (matches[2]) {
      let lines = matches[2].split('\n');

      for (let line of lines) {
        let committer = line.trim();

        if (committer) {
          committers.push(committer);
        }
      }
    }

    return {
      path,
      committers,
    };
  }

  return undefined;
}
