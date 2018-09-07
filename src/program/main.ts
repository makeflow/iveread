import {ReadRecords} from './markdown/read-records';
import {DOC_DIR_PATH} from './utils/config';
import {find} from './utils/file';

// muticommit 1
// muticommit 2
// muticommit 3
// git status test

async function checkRead() {
  let readTable = new ReadRecords();

  let markdownFiles = await find(DOC_DIR_PATH, /\.md$/);

  for (let file of markdownFiles) {
    await readTable.process(file);
  }

  readTable.checkReadAboutByCommitter(
    'D:\\Projects\\Bus\\Makeflow\\iveread\\hello',
    'dizy',
  );
}

checkRead().catch(console.error);
