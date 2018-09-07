import * as Process from 'child_process';

const REGEX_COMMITTER_MATCHER = /Author: (.*?) <(?:.*?)>/;

const REGEX_FILE_CHANGES_MATCHER = /^ ([\w\\/\.]+) \|/gm;

export interface ExecStdOut {
  stdout: string;
  stderr: string;
}

export interface TravisCommitRange {
  from: string;
  to: string;
}

export interface CommitInfo {
  committer: string;
  files: string[];
}

export function exec(command: string, cwd?: string): Promise<ExecStdOut> {
  return new Promise<ExecStdOut>((resolve, reject) => {
    Process.exec(command, {cwd}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve({stdout, stderr});
    });
  });
}

export function getTravisCommitRange(): TravisCommitRange | undefined {
  let {TRAVIS_COMMIT_RANGE} = process.env;

  let rangeString = TRAVIS_COMMIT_RANGE ? TRAVIS_COMMIT_RANGE : '';

  if (rangeString.includes('...')) {
    let ends = rangeString.split('...');

    if (ends.length === 2) {
      let [from, to] = ends;

      return {from, to};
    }
  }

  return undefined;
}

export async function getCommitsInRange(
  range: TravisCommitRange,
): Promise<string[]> {
  let {from, to} = range;

  let {stdout} = await exec(`git log --pretty=%H ${from}...${to}`);

  let hashes = stdout
    .split('\n')
    .map(value => {
      return value.trim();
    })
    .filter(value => {
      return value.length;
    });

  return hashes;
}

export async function getCommitInfo(commit: string): Promise<CommitInfo> {
  let {stdout} = await exec(`git show ${commit} --stat`);

  let committerMatch = stdout.match(REGEX_COMMITTER_MATCHER);

  if (!committerMatch) {
    throw new Error(`Not able to show author of git commit ${commit}.`);
  }

  let committer = committerMatch[1];

  let fileChanges = stdout.match(REGEX_FILE_CHANGES_MATCHER);

  if (!fileChanges) {
    throw new Error(`Not able to show file changes of git commit ${commit}.`);
  }

  let files: string[] = [];

  for (let file of fileChanges) {
    file = file.slice(1, -2).trim();

    if (file) {
      files.push(file);
    }
  }

  return {committer, files};
}

export async function getCommitInfosFromTravis(): Promise<
  CommitInfo[] | undefined
> {
  let range = getTravisCommitRange();

  if (range) {
    let commits = await getCommitsInRange(range);

    let commitInfos: CommitInfo[] = [];

    for (let commit of commits) {
      let commitInfo = await getCommitInfo(commit);

      commitInfos.push(commitInfo);
    }

    return commitInfos;
  }

  return undefined;
}
