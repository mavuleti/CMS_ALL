import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

export interface MenuPuzzle {
  slug: string;
  name: string;
  available?: boolean;
}

interface Manifest {
  languages: Array<{ code: string; label: string }>;
  content: { [lang: string]: { [category: string]: MenuPuzzle[] } };
  collections?: { [lang: string]: { [category: string]: any } };
  pages?: { [lang: string]: { pages: MenuPage[]; blog: MenuPage[] } };
}

interface MenuPage { slug: string; name: string; file: string; }

export interface CategoryNode {
  key: string;
  label: string;
  puzzles: MenuPuzzle[];
  collectionEditable: boolean;
}

export interface PuzzleSelection {
  language: string;
  category: string;
  slug: string;
  entry: any;
  englishEntry: any;
  document: any;
  collectionOnly?: boolean;
  contentKind?: 'puzzle' | 'collection' | 'page' | 'blog';
}

export interface TranslationSummary {
  language: string;
  label: string;
  available: number;
  total: number;
}

@Component({
  selector: 'app-puzzle-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puzzle-menu.component.html',
  styleUrls: ['./puzzle-menu.component.scss']
})
export class PuzzleMenuComponent implements OnInit {
  @Output() puzzleSelected = new EventEmitter<PuzzleSelection>();
  @Output() translationSummaryReady = new EventEmitter<TranslationSummary[]>();
  @Output() knownSlugsReady = new EventEmitter<string[]>();
  @Output() languageChanged = new EventEmitter<string>();

  languages: Array<{ code: string; label: string }> = [];
  selectedLang = 'en';

  searchTerm = '';
  loadError: string = null;

  // Derived tree state is recomputed explicitly (on language/search/manifest
  // changes) rather than via template getters, so *ngFor gets stable array
  // references between change-detection cycles instead of tearing down and
  // rebuilding the DOM (and losing in-flight clicks) on every CD pass.
  visibleCategories: CategoryNode[] = [];
  isSearching = false;
  resultCount = 0;
  searchStatusText = '';
  loadingCategory: string = null;
  loadingSlug: string = null;
  pageEntries: MenuPage[] = [];
  blogEntries: MenuPage[] = [];

  private content: { [lang: string]: { [category: string]: MenuPuzzle[] } } = {};
  private collections: { [lang: string]: { [category: string]: any } } = {};
  private pages: { [lang: string]: { pages: MenuPage[]; blog: MenuPage[] } } = {};
  private readonly categoryOrder = [
    'cute', 'dinosaurs', 'ocean', 'garden', 'flowers', 'circus',
    'playgrounds', 'canada', 'uae', 'planes', 'space', 'usa-250'
  ];
  private expandedCategories = new Set<string>();
  private loadSequence = 0;
  activeCategory: string = null;
  activeSlug: string = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Manifest>('assets/content/manifest.json').subscribe(
      manifest => {
        this.languages = manifest && manifest.languages ? manifest.languages : [];
        this.content = manifest && manifest.content ? manifest.content : {};
        this.collections = manifest && manifest.collections ? manifest.collections : {};
        this.pages = manifest && manifest.pages ? manifest.pages : {};
        if (!this.languages.some(language => language.code === this.selectedLang) && this.languages.length) {
          this.selectedLang = this.languages[0].code;
        }
        this.emitTranslationSummary();
        this.knownSlugsReady.emit(Array.from(new Set(
          Object.keys(this.content).reduce((allSlugs: string[], language) =>
            allSlugs.concat(Object.keys(this.content[language] || {}).reduce((languageSlugs: string[], key) =>
              languageSlugs.concat((this.content[language][key] || []).map(puzzle => puzzle.slug)), [])), [])
        )));
        this.recompute();
      },
      () => { this.loadError = 'Could not load puzzle menu.'; }
    );
  }

  trackByCategory(_index: number, cat: CategoryNode): string {
    return cat.key;
  }

  trackByPuzzle(_index: number, puzzle: MenuPuzzle): string {
    return puzzle.slug;
  }

  // ---------------------------------------------------------------------
  // Tree data
  // ---------------------------------------------------------------------

  onLanguageChange(): void {
    this.recompute();
    this.languageChanged.emit(this.selectedLang);
    this.updatePages();
  }

  onSearchChange(): void {
    this.recompute();
  }

  private recompute(): void {
    // English defines the stable menu; language only affects leaf loading.
    const byCategory = this.content.en || {};
    const selectedContent = this.content[this.selectedLang] || {};
    const categories: CategoryNode[] = Object.keys(byCategory)
      .sort((a, b) => {
        const ai = this.categoryOrder.indexOf(a);
        const bi = this.categoryOrder.indexOf(b);
        return (ai < 0 ? Number.MAX_SAFE_INTEGER : ai) -
          (bi < 0 ? Number.MAX_SAFE_INTEGER : bi) || a.localeCompare(b);
      })
      .map(key => {
        const translatedSlugs = new Set((selectedContent[key] || []).map(puzzle => puzzle.slug));
        return {
          key,
          label: this.categoryLabel(key),
          collectionEditable: Boolean((this.collections[this.selectedLang] || {})[key]),
          puzzles: byCategory[key].map(puzzle => ({
            ...puzzle,
            available: translatedSlugs.has(puzzle.slug)
          }))
        };
      });

    const term = this.searchTerm.trim().toLowerCase();
    this.isSearching = term.length > 0;

    if (!this.isSearching) {
      this.visibleCategories = categories;
    } else {
      this.visibleCategories = categories
        .map(cat => {
          const categoryMatches = cat.label.toLowerCase().includes(term);
          const puzzles = categoryMatches
            ? cat.puzzles
            : cat.puzzles.filter(p => p.name.toLowerCase().includes(term));
          return { ...cat, puzzles };
        })
        .filter(cat => cat.puzzles.length > 0);
    }

    this.resultCount = this.visibleCategories.reduce((sum, cat) => sum + cat.puzzles.length, 0);
    this.searchStatusText = this.isSearching
      ? (this.resultCount === 1 ? '1 match' : `${this.resultCount} matches`)
      : '';
    this.updatePages();
  }

  private categoryLabel(key: string): string {
    return key
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  // ---------------------------------------------------------------------
  // Expand / collapse
  // ---------------------------------------------------------------------

  isExpanded(categoryKey: string): boolean {
    return this.isSearching ? true : this.expandedCategories.has(categoryKey);
  }

  toggleCategory(categoryKey: string): void {
    if (this.isSearching) {
      return;
    }
    if (this.expandedCategories.has(categoryKey) && categoryKey !== this.activeCategory) {
      this.expandedCategories.delete(categoryKey);
    } else {
      this.expandedCategories.add(categoryKey);
    }
  }

  // ---------------------------------------------------------------------
  // Selection / load
  // ---------------------------------------------------------------------

  isActive(categoryKey: string, slug: string): boolean {
    return this.activeCategory === categoryKey && this.activeSlug === slug;
  }

  isLoading(categoryKey: string, slug: string): boolean {
    return this.loadingCategory === categoryKey && this.loadingSlug === slug;
  }

  selectPuzzle(categoryKey: string, slug: string, collectionOnly = false): void {
    this.loadError = null;
    const localized = (this.content[this.selectedLang] || {})[categoryKey] || [];
    if (!localized.some(entry => entry.slug === slug)) {
      this.loadError = `This puzzle is not available in ${this.languageLabel(this.selectedLang)}.`;
      return;
    }
    const sequence = ++this.loadSequence;
    this.loadingCategory = categoryKey;
    this.loadingSlug = slug;
    const url = `assets/content/${this.selectedLang}/puzzles-${categoryKey}.json`;

    forkJoin({
      document: this.http.get<any>(url),
      englishDocument: this.http.get<any>(`assets/content/en/puzzles-${categoryKey}.json`)
    }).subscribe(
      result => {
        if (sequence !== this.loadSequence) { return; }
        this.loadingCategory = null;
        this.loadingSlug = null;
        const entries = this.puzzlesFromDocument(result.document);
        const englishEntries = this.puzzlesFromDocument(result.englishDocument);
        const entry = entries.find(e => e.slug === slug);
        const englishEntry = englishEntries.find(e => e.slug === slug);
        if (!entry) {
          this.loadError = `"${slug}" not found in ${this.selectedLang}.`;
          return;
        }
        this.activeCategory = categoryKey;
        this.activeSlug = collectionOnly ? null : slug;
        this.expandedCategories.add(categoryKey);
        this.puzzleSelected.emit({
          language: this.selectedLang,
          category: categoryKey,
          slug,
          entry,
          englishEntry: englishEntry || entry,
          document: result.document,
          collectionOnly
          , contentKind: collectionOnly ? 'collection' : 'puzzle'
        });
      },
      () => {
        if (sequence !== this.loadSequence) { return; }
        this.loadingCategory = null;
        this.loadingSlug = null;
        this.loadError = `Could not load ${categoryKey} puzzles for ${this.languageLabel(this.selectedLang)}.`;
      }
    );
  }

  editCollection(categoryKey: string): void {
    const firstPuzzle = ((this.content[this.selectedLang] || {})[categoryKey] || [])[0];
    if (!firstPuzzle || !this.collections[this.selectedLang]?.[categoryKey]) {
      this.loadError = 'Collection metadata is not available for this language.';
      return;
    }
    this.expandedCategories.add(categoryKey);
    this.selectPuzzle(categoryKey, firstPuzzle.slug, true);
  }

  selectPage(entry: MenuPage, kind: 'page' | 'blog'): void {
    this.loadError = null;
    const sequence = ++this.loadSequence;
    const load = (language: string) => this.http.get<any>(`assets/content/${language}/${entry.file}`);
    forkJoin({ document: load(this.selectedLang), englishDocument: load('en') }).subscribe({
      next: result => {
        if (sequence !== this.loadSequence) { return; }
        const pick = (document: any) => kind === 'blog' && Array.isArray(document)
          ? document.find(item => item.slug === entry.slug) : document;
        const document = pick(result.document);
        const english = pick(result.englishDocument) || document;
        if (!document) { this.loadError = `"${entry.slug}" was not found.`; return; }
        this.activeCategory = kind;
        this.activeSlug = entry.slug;
        this.puzzleSelected.emit({
          language: this.selectedLang, category: kind, slug: entry.slug,
          entry: document, englishEntry: english, document, contentKind: kind
        });
      },
      error: () => { if (sequence === this.loadSequence) { this.loadError = `Could not load ${entry.name}.`; } }
    });
  }

  private updatePages(): void {
    const selected = this.pages[this.selectedLang] || { pages: [], blog: [] };
    const term = this.searchTerm.trim().toLowerCase();
    const filter = (entries: MenuPage[]) => !term ? entries : entries.filter(entry => entry.name.toLowerCase().includes(term) || entry.slug.includes(term));
    this.pageEntries = filter(selected.pages || []);
    this.blogEntries = filter(selected.blog || []);
  }

  private puzzlesFromDocument(document: any): any[] {
    if (Array.isArray(document)) { return document; }
    if (document && Array.isArray(document.puzzles)) { return document.puzzles; }
    return document ? [document] : [];
  }

  private languageLabel(code: string): string {
    const language = this.languages.find(item => item.code === code);
    return language ? language.label : code;
  }

  private emitTranslationSummary(): void {
    const english = this.content.en || {};
    const total = Object.keys(english).reduce((sum, key) => sum + english[key].length, 0);
    const summaries = this.languages.map(language => ({
      language: language.code,
      label: language.label,
      available: Object.keys(this.content[language.code] || {})
        .reduce((sum, key) => sum + (this.content[language.code][key] || []).length, 0),
      total
    }));
    this.translationSummaryReady.emit(summaries);
  }

  onPuzzleKeydown(event: KeyboardEvent, categoryKey: string, slug: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectPuzzle(categoryKey, slug);
    }
  }
}
