import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MenuPuzzle {
  slug: string;
  name: string;
  available?: boolean;
}

interface Manifest {
  languages: Array<{ code: string; label: string }>;
  content: { [lang: string]: { [category: string]: MenuPuzzle[] } };
}

export interface CategoryNode {
  key: string;
  label: string;
  puzzles: MenuPuzzle[];
}

export interface PuzzleSelection {
  language: string;
  category: string;
  slug: string;
  entry: any;
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

  private content: { [lang: string]: { [category: string]: MenuPuzzle[] } } = {};
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
        if (!this.languages.some(language => language.code === this.selectedLang) && this.languages.length) {
          this.selectedLang = this.languages[0].code;
        }
        this.emitTranslationSummary();
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

  selectPuzzle(categoryKey: string, slug: string): void {
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

    this.http.get<any[]>(url).subscribe(
      entries => {
        if (sequence !== this.loadSequence) { return; }
        this.loadingCategory = null;
        this.loadingSlug = null;
        const entry = (entries || []).find(e => e.slug === slug);
        if (!entry) {
          this.loadError = `"${slug}" not found in ${this.selectedLang}.`;
          return;
        }
        this.activeCategory = categoryKey;
        this.activeSlug = slug;
        this.expandedCategories.add(categoryKey);
        this.puzzleSelected.emit({
          language: this.selectedLang,
          category: categoryKey,
          slug,
          entry
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
