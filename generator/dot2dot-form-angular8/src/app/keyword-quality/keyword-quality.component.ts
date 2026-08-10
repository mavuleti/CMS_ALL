import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface ResearchPhrase { phrase: string; meaning?: string; note?: string; priority: number; }
interface ResearchGroups { native: ResearchPhrase[]; romanized: ResearchPhrase[]; english: ResearchPhrase[]; intent: ResearchPhrase[]; specialized: ResearchPhrase[]; }
interface UsageRow extends ResearchPhrase { count: number; }
interface OpportunityItem { key: string; label: string; phrase: string; }

declare global {
  interface Window {
    getKeywordQualitySnapshot: (display?: 'research' | 'dashboard') => any;
    __keywordQualitySnapshots: {[display: string]: any};
  }
}

@Component({
  selector: 'app-keyword-quality',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyword-quality.component.html',
  styleUrls: ['./keyword-quality.component.scss']
})
export class KeywordQualityComponent implements OnInit, OnChanges, OnDestroy {
  @Input() language = 'en';
  @Input() form: AbstractControl;
  @Input() display: 'research' | 'dashboard' = 'research';
  groups: ResearchGroups = this.emptyGroups();
  usage: UsageRow[] = [];
  score = 0;
  grade = 'Poor';
  internalLinks = 0;
  externalLinks = 0;
  available = false;
  loadError = false;
  loading = false;
  opportunities: OpportunityItem[] = [];
  private loadedLanguage: string;
  private localeRequest = 0;
  private changes: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.__keywordQualitySnapshots = window.__keywordQualitySnapshots || {};
    window.getKeywordQualitySnapshot = display => JSON.parse(JSON.stringify(
      display ? window.__keywordQualitySnapshots[display] : window.__keywordQualitySnapshots
    ));
    this.selectLocale();
    if (this.form) {
      this.changes = this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => this.analyze());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.language && !changes.language.firstChange) { this.selectLocale(); }
  }

  ngOnDestroy(): void {
    if (this.changes) { this.changes.unsubscribe(); }
    if (window.__keywordQualitySnapshots) { delete window.__keywordQualitySnapshots[this.display]; }
  }

  trackPhrase(_index: number, item: ResearchPhrase): string { return item.phrase; }

  private selectLocale(): void {
    const language = this.language || 'en';
    if (this.loadedLanguage === language) { return; }
    this.loadedLanguage = language;
    const request = ++this.localeRequest;
    this.loadError = false;
    this.loading = true;
    this.publishSnapshot();
    this.http.get<any>(`assets/locale-split/${encodeURIComponent(language)}.json`).subscribe({
      next: locale => {
        if (request !== this.localeRequest) { return; }
        this.loading = false;
        this.available = true;
        this.groups = this.parseSplit(locale);
        this.opportunities = this.parseOpportunities(locale.opportunity_summary || {});
        this.analyze();
      },
      error: () => {
        if (request !== this.localeRequest) { return; }
        this.loading = false;
        this.available = false;
        this.groups = this.emptyGroups();
        this.opportunities = [];
        this.loadError = true;
        this.analyze();
      }
    });
  }

  private parseSplit(locale: any): ResearchGroups {
    const data = locale && locale.data || {};
    const convert = (items: any[], priority: number): ResearchPhrase[] => (items || [])
      .filter(item => item && item.phrase)
      .map(item => ({ phrase: item.phrase, meaning: item.meaning || '', note: item.note || '', priority }));
    return {
      native: convert(data.native_phrases, 3),
      romanized: convert(data.romanized_phrases, 2),
      english: locale.locale === 'en'
        ? convert(data.english_phrases_used_by_locals, 1).concat(convert(data.pooled_from_other_locales, 1)) : [],
      intent: convert(data.intent_modifiers, 1),
      specialized: []
    };
  }

  private parseOpportunities(summary: any): OpportunityItem[] {
    const fields = [
      ['Primary term', 'primary_term'], ['Recommended local phrase', 'recommended_local_phrase'],
      ['Print modifier', 'print_modifier'], ['Free modifier', 'free_modifier'],
      ['Children modifier', 'children_modifier'], ['Adult modifier', 'adult_modifier']
    ];
    return fields.filter(item => summary[item[1]]).map(item => ({ key: item[1], label: item[0], phrase: summary[item[1]] }));
  }

  private parse(locale: any, englishLocale: boolean): ResearchGroups {
    const result = this.emptyGroups();
    const seen: {[group: string]: Set<string>} = {};
    Object.keys(result).forEach(key => seen[key] = new Set<string>());
    const visit = (value: any, path: string[]) => {
      if (Array.isArray(value)) { value.forEach(item => visit(item, path)); return; }
      if (!value || typeof value !== 'object') { return; }
      const phrase = typeof value.phrase === 'string' ? value.phrase
        : (typeof value.term === 'string' && /intent|insight|filter|primary|print/.test(path.join('_')) ? value.term : null);
      if (phrase) { add(phrase, value, path); }
      Object.keys(value).forEach(key => {
        const item = value[key];
        const next = path.concat(key.toLowerCase());
        if (typeof item === 'string' && Array.isArray(value) === false && this.isPhrasePath(next)) {
          add(item, {}, next);
        } else if (Array.isArray(item) && item.every(entry => typeof entry === 'string') && this.isPhrasePath(next)) {
          item.forEach(entry => add(entry, {}, next));
        } else if (typeof item === 'object') { visit(item, next); }
      });
    };
    const add = (phrase: string, item: any, path: string[]) => {
      const joined = path.join('_');
      let group: keyof ResearchGroups = 'native';
      if (/english_phrase|english_search|pooled_english/.test(joined)) { group = 'english'; }
      else if (/roman|in_english_letters|finglisi/.test(joined) || item.finglisi) { group = 'romanized'; }
      else if (/specialized|audience|target_|for_kids|for_adults|topic_specific|range|format/.test(joined)) { group = 'specialized'; }
      else if (/intent|insight|filter_terms|primary_term|print_intent/.test(joined)) { group = 'intent'; }
      if (!englishLocale && group === 'english') { return; }
      const clean = phrase.trim();
      const identity = clean.toLocaleLowerCase();
      if (!clean || seen[group].has(identity)) { return; }
      seen[group].add(identity);
      result[group].push({ phrase: clean, meaning: item.meaning || item.intent, note: item.note, priority: group === 'native' ? 3 : group === 'romanized' ? 2 : 1 });
      if (item.finglisi) { add(item.finglisi, { meaning: item.meaning, note: 'Finglisi transliteration' }, path.concat('finglisi')); }
    };
    visit(locale, []);
    return result;
  }

  private isPhrasePath(path: string[]): boolean {
    return /phrases|searches|specialized|audience|intent|filter_terms|primary_terms|print_intent|pooled_english/.test(path.join('_'));
  }

  private analyze(): void {
    const raw = this.form ? this.form.getRawValue() : {};
    const active = raw.collection && raw.collection.body && this.form && this.form.get('collection').enabled ? raw.collection : raw;
    const text = [active.header && active.header.title, active.header && active.header.meta_description, active.body && active.body.description]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    const eligible = this.language === 'en'
      ? this.groups.native.concat(this.groups.specialized, this.groups.intent, this.groups.english)
      : this.groups.native.concat(this.groups.romanized, this.groups.specialized, this.groups.intent);
    this.usage = eligible.map(item => ({ ...item, count: this.count(text, item.phrase.toLocaleLowerCase()) }))
      .sort((a, b) => b.count - a.count || b.priority - a.priority || a.phrase.localeCompare(b.phrase));
    const possible = this.usage.reduce((sum, item) => sum + item.priority, 0);
    const covered = this.usage.reduce((sum, item) => sum + (item.count ? item.priority : 0), 0);
    const coverage = possible ? covered / possible : 0;
    const totalUses = this.usage.reduce((sum, item) => sum + item.count, 0);
    const densityBalance = Math.min(1, totalUses / Math.max(3, this.usage.length * .15));
    this.score = Math.round((coverage * .8 + densityBalance * .2) * 100);
    this.grade = this.score >= 80 ? 'Excellent' : this.score >= 60 ? 'Good' : this.score >= 35 ? 'Fair' : 'Poor';
    this.analyzeLinks([active.body && active.body.description, active.body && active.body.dot_guide && active.body.dot_guide.outro].filter(Boolean).join(' '));
    this.publishSnapshot();
  }

  private count(text: string, phrase: string): number {
    if (!phrase) { return 0; }
    let count = 0, position = 0;
    while ((position = text.indexOf(phrase, position)) !== -1) { count++; position += phrase.length; }
    return count;
  }

  private analyzeLinks(content: string): void {
    const links: string[] = [];
    const html = /<a\s[^>]*href=["']([^"']+)["']/gi;
    const markdown = /\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
    let match: RegExpExecArray;
    while ((match = html.exec(content)) !== null) { links.push(match[1]); }
    while ((match = markdown.exec(content)) !== null) { links.push(match[1]); }
    this.internalLinks = links.filter(link => /^\//.test(link) || /^(https?:\/\/)?(www\.)?dottodotfreeprintables\.com(?:\/|$)/i.test(link)).length;
    this.externalLinks = links.length - this.internalLinks;
  }

  private emptyGroups(): ResearchGroups { return { native: [], romanized: [], english: [], intent: [], specialized: [] }; }

  private publishSnapshot(): void {
    window.__keywordQualitySnapshots = window.__keywordQualitySnapshots || {};
    window.__keywordQualitySnapshots[this.display] = {
      locale: this.loadedLanguage || this.language,
      loading: this.loading,
      available: this.available,
      error: this.loadError,
      opportunities: this.opportunities,
      groups: this.groups,
      quality: { score: this.score, grade: this.grade, internalLinks: this.internalLinks, externalLinks: this.externalLinks },
      usage: this.usage
    };
  }
}
