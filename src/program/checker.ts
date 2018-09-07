import * as Path from 'path';

import {CommitInfo} from './git/api';
import {ReadRecords} from './markdown/read-records';
import {GIT_DIR_PATH} from './utils/config';
import {find} from './utils/file';

export class ReadRecordChecker {
  readRecords = new ReadRecords();

  constructor(private docDir: string) {}

  async collectReadRecords(): Promise<void> {
    let docs = await find(this.docDir, /\.md$/);

    for (let doc of docs) {
      await this.readRecords.process(doc);
    }
  }

  async check(commitInfo: CommitInfo): Promise<void> {
    let {committer, files} = commitInfo;

    for (let file of files) {
      file = Path.join(GIT_DIR_PATH, file);

      this.readRecords.checkReadAboutByCommitter(file, committer);
    }
  }
}
