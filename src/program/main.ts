import {ReadRecordChecker} from './checker';
import {getCommitInfosFromTravis} from './git/api';
import {DOC_DIR_PATH} from './utils/config';

async function checkRead() {
  let checker = new ReadRecordChecker(DOC_DIR_PATH);

  await checker.collectReadRecords();

  let commitInfos = await getCommitInfosFromTravis();

  console.log('processedCommitInfos', commitInfos);

  if (commitInfos) {
    for (let commitInfo of commitInfos) {
      await checker.check(commitInfo);
    }
  }
}

checkRead().catch(error => {
  console.error(error);

  process.exit(-1);
});
