import { Injectable } from '@angular/core';
import { EntryStatus } from './puzzle-form/puzzle-form.component';

export interface SavedVersion {
  id: string;
  entryKey: string;
  name: string;
  savedAt: string;
  status: EntryStatus;
  pinned: boolean;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class DraftStorageService {
  private readonly databaseName = 'dot-to-dot-cms';
  private readonly storeName = 'versions';
  private readonly legacyKey = 'dot-to-dot-cms-versions-v1';
  private databasePromise: Promise<IDBDatabase>;

  constructor() {
    this.databasePromise = this.openDatabase();
  }

  async getAll(): Promise<SavedVersion[]> {
    const database = await this.databasePromise;
    const versions = await this.request<SavedVersion[]>(database.transaction(this.storeName, 'readonly').objectStore(this.storeName).getAll());
    return versions.sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
  }

  async save(version: SavedVersion): Promise<void> {
    const database = await this.databasePromise;
    await this.complete(database.transaction(this.storeName, 'readwrite'), store => store.put(version));
    await this.enforceLimit(version.entryKey);
  }

  async remove(id: string): Promise<void> {
    const database = await this.databasePromise;
    await this.complete(database.transaction(this.storeName, 'readwrite'), store => store.delete(id));
  }

  async clearEntry(entryKey: string): Promise<void> {
    const versions = (await this.getAll()).filter(version => version.entryKey === entryKey);
    await Promise.all(versions.map(version => this.remove(version.id)));
  }

  async replaceAll(versions: SavedVersion[]): Promise<void> {
    const database = await this.databasePromise;
    await this.complete(database.transaction(this.storeName, 'readwrite'), store => store.clear());
    for (const version of versions) {
      await this.save(version);
    }
  }

  private async enforceLimit(entryKey: string): Promise<void> {
    const versions = (await this.getAll()).filter(version => version.entryKey === entryKey);
    while (versions.length > 5) {
      const removableIndex = this.oldestUnpinnedIndex(versions);
      const [removed] = versions.splice(removableIndex, 1);
      await this.remove(removed.id);
    }
  }

  private oldestUnpinnedIndex(versions: SavedVersion[]): number {
    for (let index = versions.length - 1; index >= 0; index--) {
      if (!versions[index].pinned) { return index; }
    }
    return versions.length - 1;
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          const store = database.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('entryKey', 'entryKey');
          store.createIndex('savedAt', 'savedAt');
        }
      };
      request.onsuccess = async () => {
        await this.migrateLegacyStorage(request.result);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async migrateLegacyStorage(database: IDBDatabase): Promise<void> {
    const raw = localStorage.getItem(this.legacyKey);
    if (!raw) { return; }
    try {
      const legacy = JSON.parse(raw);
      if (Array.isArray(legacy)) {
        for (const item of legacy) {
          const slug = item.data && item.data.slug ? item.data.slug : 'untitled';
          const migrated: SavedVersion = {
            ...item,
            entryKey: item.entryKey || `manual:${slug}`,
            name: item.name || slug,
            pinned: Boolean(item.pinned)
          };
          await this.complete(database.transaction(this.storeName, 'readwrite'), store => store.put(migrated));
        }
      }
      localStorage.removeItem(this.legacyKey);
    } catch (_error) {
      // Leave malformed legacy data untouched so it can be recovered manually.
    }
  }

  private request<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private complete(transaction: IDBTransaction, action: (store: IDBObjectStore) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      action(transaction.objectStore(this.storeName));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
}
