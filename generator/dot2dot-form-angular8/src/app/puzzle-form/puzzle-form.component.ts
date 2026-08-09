import { Component, EventEmitter, HostListener, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FIELD_RULES } from '../models/field-rules';
import { FIELD_TIPS } from '../models/field-tips';
import { blocklistValidator, checkRangeConsistency, dotRangeValidator, hexColorValidator, imageUrlValidator, languageScriptValidator, slugFormatValidator, slugUniqueValidator } from '../validators/custom-validators';
import { PuzzleEntry } from '../models/puzzle-entry.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EnglishReviewDirective } from './english-review.directive';
import { EnglishReviewService } from './english-review.service';

export type EntryStatus = 'draft' | 'validated' | 'submitted';

export interface VersionSnapshot {
  status: EntryStatus;
  data: any;
}

interface ValidationIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

@Component({
  selector: 'app-puzzle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnglishReviewDirective],
  templateUrl: './puzzle-form.component.html',
  styleUrls: ['./puzzle-form.component.scss']
})
export class PuzzleFormComponent implements OnInit {
  @Output() versionSaved = new EventEmitter<VersionSnapshot>();
  @Input() contentLanguage = 'en';
  @Input() knownSlugs: string[] = [];
  @Input() set englishReference(value: any) {
    this.reviews.setReference(value ? this.normalizeEntry(value) : null);
  }

  rules = FIELD_RULES;
  tips = FIELD_TIPS;
  form: FormGroup;
  generatedJson: string = null;
  submitted = false;
  validationResult: 'valid' | 'invalid' = null;
  invalidFieldCount = 0;
  validationIssues: ValidationIssue[] = [];
  private loadedSlug: string = null;
  get errorIssues(): ValidationIssue[] { return this.validationIssues.filter(issue => issue.severity === 'error'); }
  get warningIssues(): ValidationIssue[] { return this.validationIssues.filter(issue => issue.severity === 'warning'); }
  importError: string = null;
  activeTab: 'form' | 'preview' = 'form';

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private reviews: EnglishReviewService) {}

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  setTab(tab: 'form' | 'preview'): void {
    this.activeTab = tab;
  }

  // -------------------------------------------------------------------
  // Form construction
  // -------------------------------------------------------------------

  private buildForm(): FormGroup {
    const r = this.rules;
    const text = (...validators: any[]) => [
      ...validators,
      languageScriptValidator(() => this.contentLanguage),
      blocklistValidator(() => this.contentLanguage)
    ];

    return this.fb.group({
      slug: ['', [Validators.required, slugFormatValidator(), slugUniqueValidator(() =>
        new Set((this.knownSlugs || []).filter(slug => slug !== this.loadedSlug))) ]],

      header: this.fb.group({
        title: ['', text(Validators.required, Validators.minLength(r.header.title.minLength), Validators.maxLength(r.header.title.maxLength))],
        meta_description: ['', text(Validators.required, Validators.minLength(r.header.meta_description.minLength), Validators.maxLength(r.header.meta_description.maxLength))],
        og: this.fb.group({
          title: ['', text(Validators.required, Validators.maxLength(r.header.og.title.maxLength))],
          description: ['', text(Validators.required, Validators.maxLength(r.header.og.description.maxLength))],
          image_alt: ['', text(Validators.required, Validators.maxLength(r.header.og.image_alt.maxLength))]
        }),
        json_ld: this.fb.group({
          type: ['CreativeWork', Validators.required],
          name: ['', text(Validators.required)],
          description: ['', text(Validators.required, Validators.maxLength(r.header.json_ld.description.maxLength))],
          image: ['', [Validators.required, imageUrlValidator()]],
          educational_use: ['', text(Validators.required)],
          age_range: ['', text(Validators.required)]
        })
      }),

      body: this.fb.group({
        h1: ['', text(Validators.required, Validators.minLength(r.body.h1.minLength), Validators.maxLength(r.body.h1.maxLength))],
        name: ['', text(Validators.required, Validators.maxLength(r.body.name.maxLength))],
        tagline: ['', text(Validators.required, Validators.maxLength(r.body.tagline.maxLength))],
        description: ['', text(Validators.required, Validators.minLength(r.body.description.minLength), Validators.maxLength(r.body.description.maxLength))],
        fun_fact: ['', text(Validators.required, Validators.minLength(r.body.fun_fact.minLength), Validators.maxLength(r.body.fun_fact.maxLength))],
        dot_guide: this.fb.group({
          intro: ['', text(Validators.required, Validators.minLength(r.body.dot_guide.intro.minLength))],
          outro: ['', text(Validators.required, Validators.minLength(r.body.dot_guide.outro.minLength))],
          sections: this.fb.array([this.buildSection()]),
          color_schemes: this.fb.array([this.buildColorScheme()])
        })
      })
    });
  }

  private buildSection(): FormGroup {
    const language = languageScriptValidator(() => this.contentLanguage);
    return this.fb.group({
      range: ['', [Validators.required, dotRangeValidator()]],
      title: ['', [Validators.required, Validators.maxLength(this.rules.body.dot_guide.section.title.maxLength), language, blocklistValidator(() => this.contentLanguage)]],
      learn: ['', [Validators.required, Validators.minLength(this.rules.body.dot_guide.section.learn.minLength), language, blocklistValidator(() => this.contentLanguage)]],
      fact: ['', [Validators.required, Validators.minLength(this.rules.body.dot_guide.section.fact.minLength), language, blocklistValidator(() => this.contentLanguage)]]
    });
  }

  private buildMapping(): FormGroup {
    const language = languageScriptValidator(() => this.contentLanguage);
    return this.fb.group({
      range: ['', [Validators.required, dotRangeValidator()]],
      part: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      color: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      hex: ['', [Validators.required, hexColorValidator()]],
      why: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]]
    });
  }

  private buildColorScheme(): FormGroup {
    const language = languageScriptValidator(() => this.contentLanguage);
    return this.fb.group({
      name: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      note: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      mapping: this.fb.array([this.buildMapping()])
    });
  }

  // -------------------------------------------------------------------
  // FormArray accessors (used heavily in the template)
  // -------------------------------------------------------------------

  get sections(): FormArray {
    return this.form.get('body.dot_guide.sections') as FormArray;
  }

  get colorSchemes(): FormArray {
    return this.form.get('body.dot_guide.color_schemes') as FormArray;
  }

  mappingsOf(schemeIndex: number): FormArray {
    return this.colorSchemes.at(schemeIndex).get('mapping') as FormArray;
  }

  addSection(): void {
    this.sections.push(this.buildSection());
  }

  removeSection(i: number): void {
    this.sections.removeAt(i);
  }

  addColorScheme(): void {
    this.colorSchemes.push(this.buildColorScheme());
  }

  removeColorScheme(i: number): void {
    this.colorSchemes.removeAt(i);
  }

  addMapping(schemeIndex: number): void {
    this.mappingsOf(schemeIndex).push(this.buildMapping());
  }

  removeMapping(schemeIndex: number, mappingIndex: number): void {
    this.mappingsOf(schemeIndex).removeAt(mappingIndex);
  }

  // -------------------------------------------------------------------
  // Validation helper for the template: field(path).invalid && touched/submitted
  // -------------------------------------------------------------------

  isInvalid(controlPath: string): boolean {
    const c = this.form.get(controlPath);
    if (!c) { return false; }
    return c.invalid && (c.touched || this.submitted);
  }

  // -------------------------------------------------------------------
  // Generate + download
  // -------------------------------------------------------------------

  onGenerate(): void {
    if (!this.validateForm(false)) {
      this.generatedJson = null;
      return;
    }

    const entry = this.snapshotWithStatus('submitted');
    this.generatedJson = JSON.stringify(entry, null, 2);
    this.versionSaved.emit({ status: 'submitted', data: entry });
  }

  validateForm(saveVersion = true): boolean {
    this.submitted = true;
    this.refreshValidity(this.form);
    this.validationIssues = this.collectControlIssues(this.form)
      .concat(this.collectCrossFieldIssues(), this.collectReviewWarnings());
    this.invalidFieldCount = this.errorIssues.length;
    this.validationResult = this.invalidFieldCount ? 'invalid' : 'valid';

    if (this.invalidFieldCount) {
      this.form.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid[formControlName]');
      if (firstInvalid) {
        (firstInvalid as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    if (saveVersion) {
      this.versionSaved.emit({ status: 'validated', data: this.snapshotWithStatus('validated') });
    }
    return true;
  }

  validateOnBlur(): void {
    setTimeout(() => {
      this.refreshValidity(this.form);
      const controlIssues = this.collectControlIssues(this.form, '', !this.submitted);
      const crossFieldIssues = this.submitted ? this.collectCrossFieldIssues() : [];
      this.validationIssues = controlIssues.concat(crossFieldIssues, this.collectReviewWarnings());
      this.invalidFieldCount = this.errorIssues.length;
      this.validationResult = this.invalidFieldCount ? 'invalid' : (this.submitted ? 'valid' : null);
    });
  }

  saveDraft(): void {
    this.versionSaved.emit({ status: 'draft', data: this.snapshotWithStatus('draft') });
  }

  private snapshotWithStatus(status: EntryStatus): any {
    return {
      ...this.form.getRawValue(),
      _cms: { status, savedAt: new Date().toISOString() }
    };
  }

  hasUnsavedChanges(): boolean {
    return Boolean(this.form && this.form.dirty);
  }

  markSaved(snapshot?: any): void {
    if (!snapshot || JSON.stringify(this.form.getRawValue()) === JSON.stringify(this.withoutCms(snapshot))) {
      this.form.markAsPristine();
    }
  }

  private withoutCms(snapshot: any): any {
    const clean = JSON.parse(JSON.stringify(snapshot || {}));
    delete clean._cms;
    delete clean.status;
    return clean;
  }

  safePreviewHtml(html: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html || '') || '';
  }

  @HostListener('window:beforeunload', ['$event'])
  warnBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private countInvalidFields(control: AbstractControl): number {
    if (control instanceof FormGroup || control instanceof FormArray) {
      return Object.keys(control.controls)
        .reduce((count, key) => count + this.countInvalidFields(control.controls[key]), 0);
    }
    return control.invalid ? 1 : 0;
  }

  focusIssue(path: string): void {
    this.activeTab = 'form';
    const controlName = path.split('.').pop().replace(/\[\d+\]/g, '');
    const section = path.match(/sections\[(\d+)\]/);
    const mapping = path.match(/color_schemes\[(\d+)\]\.mapping\[(\d+)\]/);
    const scheme = path.match(/color_schemes\[(\d+)\]/);
    let selector = `[formControlName="${controlName}"]`;
    if (mapping) {
      selector = `[data-testid="mapping-${mapping[1]}-${mapping[2]}"] ${selector}`;
    } else if (section) {
      selector = `[data-testid="section-${section[1]}"] ${selector}`;
    } else if (scheme) {
      selector = `[data-testid="scheme-${scheme[1]}"] ${selector}`;
    } else {
      const groups = path.split('.').slice(0, -1);
      selector = groups.map(group => `[formGroupName="${group}"]`).join(' ') + ' ' + selector;
    }
    setTimeout(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (!element) { return; }
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  private collectControlIssues(control: AbstractControl, path = '', touchedOnly = false): ValidationIssue[] {
    if (control instanceof FormGroup) {
      return Object.keys(control.controls).reduce((issues, key) =>
        issues.concat(this.collectControlIssues(control.controls[key], path ? `${path}.${key}` : key, touchedOnly)), [] as ValidationIssue[]);
    }
    if (control instanceof FormArray) {
      return control.controls.reduce((issues, child, index) =>
        issues.concat(this.collectControlIssues(child, `${path}[${index}]`, touchedOnly)), [] as ValidationIssue[]);
    }
    if (!control.invalid || (touchedOnly && !control.touched)) { return []; }
    return Object.keys(control.errors || {}).map(rule => ({
      path, message: this.validationMessage(rule, control.errors[rule]), severity: 'error' as const
    }));
  }

  private validationMessage(rule: string, payload: any): string {
    switch (rule) {
      case 'required': return 'This field is required.';
      case 'minlength': return `Enter at least ${payload.requiredLength} characters (currently ${payload.actualLength}).`;
      case 'maxlength': return `Enter no more than ${payload.requiredLength} characters (currently ${payload.actualLength}).`;
      case 'languageScript': return String(payload);
      case 'blocklist': return `Child-safety review: remove ${payload.join(', ')}.`;
      case 'slugFormat': return 'Use lowercase letters, numbers, and single hyphens only.';
      case 'slugTaken': return 'This slug already exists. Choose a unique slug.';
      case 'imageUrl': return 'Enter a full HTTP(S) image URL with a supported image extension.';
      case 'hexColor': return 'Use a six-digit hex color such as #FAA76C.';
      case 'dotRange': return 'Use a numeric range such as 1–15.';
      default: return `Invalid value (${rule}).`;
    }
  }

  private collectReviewWarnings(): ValidationIssue[] {
    if (this.contentLanguage === 'en') { return []; }
    return this.reviews.untranslatedPaths(this.form.getRawValue()).map(path => ({
      path,
      message: 'Still matches the English source — review the translation.',
      severity: 'warning' as const
    }));
  }

  private refreshValidity(control: AbstractControl): void {
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.keys(control.controls).forEach(key => this.refreshValidity(control.controls[key]));
    }
    control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private collectCrossFieldIssues(): ValidationIssue[] {
    const value = this.form.getRawValue();
    const issues: ValidationIssue[] = [];
    if (value.header.json_ld.name !== value.body.name) {
      issues.push({ path: 'header.json_ld.name', message: 'Must match body.name.', severity: 'error' });
    }

    const sectionRangeValues = (value.body.dot_guide.sections || []).map(section => section.range);
    const consistency = checkRangeConsistency(sectionRangeValues);
    consistency.overlaps.concat(consistency.gaps).forEach(issue =>
      issues.push({
        path: `body.dot_guide.sections[${issue.index}].range`,
        message: issue.message,
        severity: 'error'
      }));
    const validRanges = new Set(sectionRangeValues.map(range => this.rangeKey(range)).filter(Boolean));
    (value.body.dot_guide.color_schemes || []).forEach((scheme, schemeIndex) => {
      (scheme.mapping || []).forEach((mapping, mappingIndex) => {
        if (mapping.range && !validRanges.has(this.rangeKey(mapping.range))) {
          issues.push({ path: `body.dot_guide.color_schemes[${schemeIndex}].mapping[${mappingIndex}].range`, message: 'Must match a dot-guide section range.', severity: 'error' });
        }
      });
    });

    const titleCounts = [value.header.title, value.body.h1, value.body.description]
      .map(text => this.firstNumber(text)).filter(count => count !== null);
    if (titleCounts.length > 1 && titleCounts.some(count => count !== titleCounts[0])) {
      issues.push({ path: 'header.title', message: 'Dot counts disagree across title, H1, or description.', severity: 'error' });
    }
    return issues;
  }

  private parseRange(value: string): [number, number] | null {
    const match = String(value || '').match(/^(\d+)\s*[–-]\s*(\d+)$/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  private rangeKey(value: string): string | null {
    const match = String(value || '').trim().replace(/\u2013/g, '-').match(/^(\d+)\s*-\s*(\d+)$/);
    return match ? `${Number(match[1])}-${Number(match[2])}` : null;
  }

  private firstNumber(value: string): number | null {
    const normalized = String(value || '').replace(/[\u0660-\u0669\u06F0-\u06F9]/g, digit => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06F0 ? code - 0x06F0 : code - 0x0660);
    });
    const match = normalized.match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  downloadJson(): void {
    if (!this.generatedJson) { return; }
    const slug = this.form.get('slug').value || 'puzzle-entry';
    const productionEntry = JSON.parse(this.generatedJson);
    delete productionEntry._cms;
    delete productionEntry.status;
    const blob = new Blob([JSON.stringify(productionEntry, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  resetForm(): void {
    this.loadedSlug = null;
    this.form = this.buildForm();
    this.generatedJson = null;
    this.submitted = false;
    this.validationResult = null;
    this.invalidFieldCount = 0;
    this.validationIssues = [];
    this.importError = null;
    this.form.markAsPristine();
  }

  // -------------------------------------------------------------------
  // Import: load an existing JSON entry back into the form for editing.
  // Accepts either the new header/body schema, or a single entry from
  // an array, or the legacy flat schema (auto-converted).
  // -------------------------------------------------------------------

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) { return; }
    const reader = new FileReader();
    reader.onload = () => this.importFromText(reader.result as string);
    reader.onerror = () => { this.importError = 'Could not read the selected file.'; };
    reader.readAsText(input.files[0]);
  }

  importFromPastedText(text: string): void {
    this.importFromText(text);
  }

  private importFromText(text: string): void {
    this.importError = null;
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      this.importError = 'Could not parse JSON — check the file/paste is valid.';
      return;
    }
    this.loadImportedJson(parsed);
  }

  /** Shared population pipeline used by file, paste, and sidebar imports. */
  loadImportedJson(parsed: any): void {
    this.importError = null;
    const raw = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!raw) {
      this.importError = 'No entry found to import.';
      return;
    }
    const entry = this.normalizeEntry(raw);
    this.loadedSlug = entry.slug || null;
    this.patchFormWithEntry(entry);
    this.generatedJson = null;
    this.submitted = false;
    this.validationResult = null;
    this.invalidFieldCount = 0;
    this.validationIssues = [];
    this.form.markAsPristine();
  }

  /** Converts the legacy flat schema to header/body shape if needed. */
  private normalizeEntry(raw: any): PuzzleEntry {
    if (raw.header && raw.body) {
      return raw as PuzzleEntry;
    }
    const dg = raw.dotGuide || {};
    return {
      slug: raw.slug || '',
      header: {
        title: raw.seoTitle || '',
        meta_description: raw.seoDescription || '',
        og: {
          title: raw.seoTitle || '',
          description: raw.seoDescription || '',
          image_alt: raw.seoImageAlt || ''
        },
        json_ld: {
          type: 'CreativeWork',
          name: raw.name || '',
          description: raw.seoDescription || '',
          image: '',
          educational_use: 'Fine motor skills, number sequencing',
          age_range: ''
        }
      },
      body: {
        h1: raw.seoH1 || '',
        name: raw.name || '',
        tagline: raw.tagline || '',
        description: raw.description || '',
        fun_fact: raw.funFact || '',
        dot_guide: {
          intro: dg.intro || '',
          sections: dg.sections || [],
          outro: dg.outro || '',
          color_schemes: dg.colorSchemes || []
        }
      }
    };
  }

  private patchFormWithEntry(entry: PuzzleEntry): void {
    this.form.patchValue({
      slug: entry.slug || '',
      header: {
        title: entry.header.title || '',
        meta_description: entry.header.meta_description || '',
        og: entry.header.og || {},
        json_ld: entry.header.json_ld || {}
      },
      body: {
        h1: entry.body.h1 || '',
        name: entry.body.name || '',
        tagline: entry.body.tagline || '',
        description: entry.body.description || '',
        fun_fact: entry.body.fun_fact || '',
        dot_guide: {
          intro: entry.body.dot_guide.intro || '',
          outro: entry.body.dot_guide.outro || ''
        }
      }
    });

    // Rebuild sections FormArray to match imported data
    const sectionsArray = this.sections;
    while (sectionsArray.length) { sectionsArray.removeAt(0); }
    const sections = entry.body.dot_guide.sections && entry.body.dot_guide.sections.length
      ? entry.body.dot_guide.sections : [null];
    sections.forEach(s => {
      const group = this.buildSection();
      if (s) { group.patchValue(s); }
      sectionsArray.push(group);
    });

    // Rebuild color_schemes FormArray (with nested mapping FormArrays)
    const schemesArray = this.colorSchemes;
    while (schemesArray.length) { schemesArray.removeAt(0); }
    const schemes = entry.body.dot_guide.color_schemes && entry.body.dot_guide.color_schemes.length
      ? entry.body.dot_guide.color_schemes : [null];
    schemes.forEach(cs => {
      const schemeGroup = this.buildColorScheme();
      if (cs) {
        schemeGroup.patchValue({ name: cs.name, note: cs.note });
        const mappingArray = schemeGroup.get('mapping') as FormArray;
        while (mappingArray.length) { mappingArray.removeAt(0); }
        const mappings = cs.mapping && cs.mapping.length ? cs.mapping : [null];
        mappings.forEach(m => {
          const mapGroup = this.buildMapping();
          if (m) { mapGroup.patchValue(m); }
          mappingArray.push(mapGroup);
        });
      }
      schemesArray.push(schemeGroup);
    });
  }
}
