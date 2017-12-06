import Dexie from 'dexie';

let db = new Dexie('hotMark');

db.version(1).stores({
  markdownFiles: 'id, title, content'
});

export const saveOfflineMarkdown = (md) => {
  return db.markdownFiles.add(md);
}

export const getSingleMarkdown = (id) => {
  return db.markdownFiles.get(parseInt(id))
}

export const loadOfflineMarkdowns = () => {
  return db.markdownFiles.toArray()
}; 