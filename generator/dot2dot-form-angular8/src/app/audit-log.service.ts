import { Injectable } from '@angular/core';

export type AuditAction = 'validate' | 'save';
export type AuditTrigger = 'human' | 'automated';

export interface AuditChange {
  field: string;
  old: any;
  new: any;
}

export interface AuditEntry {
  timestamp: string;
  action: AuditAction;
  trigger: AuditTrigger;
  entry_id: string;
  entry_type: 'puzzle' | 'collection';
  changes: AuditChange[];
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly databaseName = 'dot-to-dot-cms';
  private readonly storeName = 'audit-log';
  private databasePromise: Promise<IDBDatabase>;

  constructor() { this.databasePromise = this.openDatabase(); }

  diff(before: any, after: any): AuditChange[] {
    return this.diffObject(before || {}, after || {}, '');
  }

  async append(entry: AuditEntry): Promise<void> {
    const database = await this.databasePromise;
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(this.storeName, 'readwrite');
      transaction.objectStore(this.storeName).add(JSON.parse(JSON.stringify(entry)));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async getAll(): Promise<AuditEntry[]> {
    const database = await this.databasePromise;
    return new Promise((resolve, reject) => {
      const request = database.transaction(this.storeName, 'readonly').objectStore(this.storeName).getAll();
      request.onsuccess = () => resolve(request.result as AuditEntry[]);
      request.onerror = () => reject(request.error);
    });
  }

  async download(): Promise<void> {
    const entries = await this.getAll();
    const ndjson = entries.map(entry => JSON.stringify(entry)).join('\n') + (entries.length ? '\n' : '');
    const url = URL.createObjectURL(new Blob([ndjson], { type: 'application/x-ndjson' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'log.ndjson';
    link.click();
    URL.revokeObjectURL(url);
  }

  private diffObject(before: any, after: any, prefix: string): AuditChange[] {
    const keys = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})])).sort();
    return keys.reduce((changes: AuditChange[], key) => {
      const field = prefix ? `${prefix}.${key}` : key;
      const oldValue = before ? before[key] : undefined;
      const newValue = after ? after[key] : undefined;
      if (this.isPlainObject(oldValue) && this.isPlainObject(newValue)) {
        return changes.concat(this.diffObject(oldValue, newValue, field));
      }
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field, old: this.copyValue(oldValue), new: this.copyValue(newValue) });
      }
      return changes;
    }, []);
  }

  private isPlainObject(value: any): boolean {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  private copyValue(value: any): any {
    return value === undefined ? null : JSON.parse(JSON.stringify(value));
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, 2);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, { autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('versions')) {
          const versions = database.createObjectStore('versions', { keyPath: 'id' });
          versions.createIndex('entryKey', 'entryKey');
          versions.createIndex('savedAt', 'savedAt');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
