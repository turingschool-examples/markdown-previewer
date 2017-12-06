import Dexie from 'dexie';

let db = new Dexie('hotMark');

db.version(1).stores({
  markdownFiles: 'id, title, content'
});

export const saveOfflineMarkdown = (md) => {
 // add markdown to IDB
}

export const getSingleMarkdown = (id) => {
  // retrieve single markdown from IDB by id
}

export const loadOfflineMarkdowns = () => {
  // retrieve all markdowns from IDB
}; 