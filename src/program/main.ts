import {ReadInfoTable} from './markdown/read-table';
import {config} from './utils/config';
import {find} from './utils/file';

// muticommit 1
// muticommit 2
// muticommit 3
// git status test

async function checkRead() {
  let readTable = new ReadInfoTable();

  let markdownFiles = await find(config.get('docDir', ''), /\.md$/);

  for (let file of markdownFiles) {
    readTable.process(file);
  }
}

checkRead().catch(console.error);
