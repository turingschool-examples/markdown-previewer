import Dexie from 'dexie';

let db = new Dexie('hotMark');

db.version(2).stores({
  markdownFiles: 'id, title, content', 'status'
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

export const setPendingMarkdownsToSynced = () => {
  return db.markdownFiles.where('status').equals('pendingSync').modify({status: 'synced'});
};