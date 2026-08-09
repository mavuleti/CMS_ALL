import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuzzleFormComponent, VersionSnapshot, EntryStatus } from './puzzle-form/puzzle-form.component';
import { PuzzleMenuComponent, PuzzleSelection, TranslationSummary } from './puzzle-menu/puzzle-menu.component';
import { DraftStorageService, SavedVersion } from './draft-storage.service';
import { AuditLogService } from './audit-log.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PuzzleMenuComponent, PuzzleFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(PuzzleFormComponent, { static: true }) puzzleForm: PuzzleFormComponent;
  allVersions: SavedVersion[] = [];
  versions: SavedVersion[] = [];
  draftMessage = '';
  activeEntryKey = 'manual:untitled';
  diffLines: string[] = [];
  translationSummary: TranslationSummary[] = [];
  contentLanguage = 'en';
  englishReference: any = null;
  knownSlugs: string[] = [];
  get allKnownSlugs(): string[] {
    return Array.from(new Set(this.knownSlugs.concat(
      (this.allVersions || []).map(version => version.data && version.data.slug).filter(Boolean)
    )));
  }
  private saveQueue: Promise<void> = Promise.resolve();

  constructor(private storage: DraftStorageService, private auditLog: AuditLogService) {}

  async downloadAuditLog(): Promise<void> {
    await this.auditLog.download();
    this.draftMessage = 'Audit log downloaded as log.ndjson.';
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      this.allVersions = await this.storage.getAll();
      if (this.allVersions.length) {
        const latest = this.allVersions[0];
        this.activeEntryKey = latest.entryKey;
        this.contentLanguage = this.languageFromEntryKey(latest.entryKey);
        this.refreshVisibleVersions();
        this.puzzleForm.loadImportedJson(latest.data, this.slugFromEntryKey(latest.entryKey), this.isCollectionEntryKey(latest.entryKey));
        this.draftMessage = 'Latest saved version restored.';
      }
    } catch (_error) {
      this.draftMessage = 'Draft storage is unavailable in this browser.';
    }
  }

  onPuzzleSelected(selection: PuzzleSelection): void {
    if (!this.confirmDiscard()) { return; }
    this.activeEntryKey = `${selection.language}:${selection.category}:${selection.collectionOnly ? 'collection' : selection.slug}`;
    this.contentLanguage = selection.language;
    this.englishReference = selection.englishEntry;
    this.refreshVisibleVersions();
    this.puzzleForm.loadImportedJson(selection.document, selection.slug, Boolean(selection.collectionOnly));
    this.diffLines = [];
  }

  onTranslationSummary(summary: TranslationSummary[]): void {
    this.translationSummary = summary;
  }

  onVersionSaved(snapshot: VersionSnapshot): void {
    this.saveQueue = this.saveQueue.then(() => this.persistVersion(snapshot));
  }

  private async persistVersion(snapshot: VersionSnapshot): Promise<void> {
    const latestTime = this.allVersions.length ? Date.parse(this.allVersions[0].savedAt) : 0;
    const now = new Date(Math.max(Date.now(), latestTime + 1));
    const slug = snapshot.entrySlug || (snapshot.data && snapshot.data.slug) || 'untitled';
    if (this.activeEntryKey === 'manual:untitled' || (!this.puzzleForm.collectionOnly && !this.activeEntryKey.endsWith(`:${slug}`))) {
      this.activeEntryKey = `manual:${slug}`;
    }
    const version: SavedVersion = {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      entryKey: this.activeEntryKey,
      name: slug,
      savedAt: now.toISOString(),
      status: snapshot.status,
      pinned: false,
      data: JSON.parse(JSON.stringify(snapshot.data))
    };
    try {
      await this.storage.save(version);
      this.allVersions = await this.storage.getAll();
      this.refreshVisibleVersions();
      this.puzzleForm.markSaved(snapshot.data);
      this.draftMessage = `${this.statusLabel(snapshot.status)} version saved.`;
    } catch (_error) {
      this.draftMessage = 'Could not save the version to browser storage.';
    }
  }

  loadVersion(version: SavedVersion): void {
    if (!this.confirmDiscard()) { return; }
    this.activeEntryKey = version.entryKey;
    this.contentLanguage = this.languageFromEntryKey(version.entryKey);
    this.refreshVisibleVersions();
    this.puzzleForm.loadImportedJson(version.data, this.slugFromEntryKey(version.entryKey), this.isCollectionEntryKey(version.entryKey));
    this.draftMessage = `${this.statusLabel(version.status)} version loaded.`;
  }

  async renameVersion(version: SavedVersion): Promise<void> {
    const name = window.prompt('Version name', version.name);
    if (!name || name.trim() === version.name) { return; }
    await this.updateVersion({ ...version, name: name.trim() });
  }

  async togglePin(version: SavedVersion): Promise<void> {
    await this.updateVersion({ ...version, pinned: !version.pinned });
  }

  async deleteVersion(version: SavedVersion): Promise<void> {
    if (!window.confirm(`Delete version “${version.name}”?`)) { return; }
    await this.storage.remove(version.id);
    await this.reloadVersions('Version deleted.');
  }

  async clearHistory(): Promise<void> {
    if (!this.versions.length || !window.confirm('Delete all versions for this puzzle?')) { return; }
    await this.storage.clearEntry(this.activeEntryKey);
    await this.reloadVersions('Puzzle history cleared.');
  }

  compareVersion(version: SavedVersion): void {
    const index = this.versions.findIndex(candidate => candidate.id === version.id);
    const older = index >= 0 ? this.versions[index + 1] : null;
    this.diffLines = this.buildDiff(version.data, older ? older.data : {});
    if (!this.diffLines.length) { this.diffLines = ['No field changes from the previous version.']; }
  }

  exportHistory(): void {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), versions: this.allVersions }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dot-to-dot-cms-history.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async importHistory(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) { return; }
    try {
      const parsed = JSON.parse(await input.files[0].text());
      if (!parsed || !Array.isArray(parsed.versions)) { throw new Error('Invalid history'); }
      const valid = parsed.versions.filter(version => version && version.id && version.entryKey && version.data);
      await this.storage.replaceAll(valid);
      this.allVersions = await this.storage.getAll();
      this.refreshVisibleVersions();
      this.draftMessage = `${valid.length} versions imported.`;
    } catch (_error) {
      this.draftMessage = 'Could not import that history file.';
    } finally {
      input.value = '';
    }
  }

  trackByVersion(_index: number, version: SavedVersion): string { return version.id; }
  statusLabel(status: EntryStatus): string { return status.charAt(0).toUpperCase() + status.slice(1); }

  private confirmDiscard(): boolean {
    return !this.puzzleForm.hasUnsavedChanges() || window.confirm('Discard unsaved changes?');
  }

  private async updateVersion(version: SavedVersion): Promise<void> {
    await this.storage.save(version);
    await this.reloadVersions('Version updated.');
  }

  private async reloadVersions(message: string): Promise<void> {
    this.allVersions = await this.storage.getAll();
    this.refreshVisibleVersions();
    this.draftMessage = message;
  }

  private refreshVisibleVersions(): void {
    this.versions = this.allVersions
      .filter(version => version.entryKey === this.activeEntryKey)
      .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
  }

  private languageFromEntryKey(entryKey: string): string {
    const language = String(entryKey || '').split(':')[0];
    return language && language !== 'manual' ? language : 'en';
  }

  private slugFromEntryKey(entryKey: string): string {
    const parts = String(entryKey || '').split(':');
    return parts[parts.length - 1] || '';
  }

  private isCollectionEntryKey(entryKey: string): boolean {
    return String(entryKey || '').endsWith(':collection');
  }

  private buildDiff(newer: any, older: any, prefix = ''): string[] {
    const keys = Array.from(new Set([...Object.keys(newer || {}), ...Object.keys(older || {})])).sort();
    return keys.reduce((lines: string[], key) => {
      if (key === '_cms') { return lines; }
      const path = prefix ? `${prefix}.${key}` : key;
      const next = newer ? newer[key] : undefined;
      const previous = older ? older[key] : undefined;
      if (next && previous && typeof next === 'object' && typeof previous === 'object') {
        return lines.concat(this.buildDiff(next, previous, path));
      }
      if (JSON.stringify(next) !== JSON.stringify(previous)) {
        lines.push(`${path}: ${this.shortValue(previous)} → ${this.shortValue(next)}`);
      }
      return lines;
    }, []);
  }

  private shortValue(value: any): string {
    if (value === undefined) { return '(missing)'; }
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    return text.length > 90 ? `${text.slice(0, 87)}…` : text;
  }
}
