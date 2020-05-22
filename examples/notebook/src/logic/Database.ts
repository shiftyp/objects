import { Note } from '../types';

export interface Database extends AsyncIterable<Database> {}
export class Database {
  private static version = 1;
  private static storeName = 'notes';
  private static dbName = '📔.to';

  db: IDBDatabase;

  async open() {
    this.db = await this.openDB();
  }

  async close() {
    await new Promise((resolve, reject) => {
      this.db.onclose = () => resolve();
      this.db.onerror = reject;
      this.db.close();
    });
    this.db = null;
  }

  openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      var DBOpenRequest = window.indexedDB.open(
        Database.dbName,
        Database.version
      );

      DBOpenRequest.onerror = () => {
        reject(event);
      };

      DBOpenRequest.onupgradeneeded = () => {
        const db = DBOpenRequest.result;
        if (!db.objectStoreNames.contains(Database.storeName)) {
          const notes = db.createObjectStore(Database.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
          notes.createIndex('name', 'name', { unique: false });
        }
      };

      DBOpenRequest.onsuccess = () => {
        const db = DBOpenRequest.result;
        resolve(db);
      };
    });
  }

  async awaitDB() {
    if (this.db) {
      return;
    }
    for await (const { db } of this) {
      if (db) break;
    }
  }

  async withStore<T>(
    cb: (store: IDBObjectStore) => IDBRequest<T>,
    mode: 'readwrite' | 'readonly' = 'readonly'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(Database.storeName, mode);
      const store = tx.objectStore(Database.storeName);

      const request = cb(store);

      request.onerror = () => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async withCursor<T>(
    cb: (value: Note) => T,
    mode: 'readwrite' | 'readonly' = 'readonly'
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];
      const tx = this.db.transaction(Database.storeName, mode);
      const store = tx.objectStore(Database.storeName);

      const request = store.openCursor();

      request.onerror = () => {
        reject(event);
      };

      request.onsuccess = (e) => {
        const cursor = request.result;

        if (cursor) {
          results.push(cb(cursor.value as Note));
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }

  getAllKeys(): Promise<IDBValidKey[]> {
    return this.withStore((store) => store.getAllKeys());
  }

  getNoteList(): Promise<Omit<Note, 'raw'>[]> {
    return this.withCursor(({ id, name, updated, created }) => ({
      id,
      name,
      updated,
      created,
    }));
  }

  put(
    note: Omit<Note, 'id' | 'updated'> & { id?: number; updated?: number }
  ): Promise<IDBValidKey> {
    return this.withStore(
      (store) =>
        store.put({
          ...note,
          updated: Date.now(),
        }),
      'readwrite'
    );
  }

  get(id: IDBValidKey): Promise<Note> {
    return this.withStore((store) => store.get(id));
  }

  async createNote(name: string) {
    const note = {
      name: name || 'New Note',
      created: Date.now(),
    };
    const id = await this.put(note);
    return await this.get(id);
  }

  async getCurrentNotes() {
    return await this.getNoteList();
  }
}
