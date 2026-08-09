import { Component, EventEmitter, HostListener, Input, OnInit, Output, SecurityContext } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FIELD_RULES } from '../models/field-rules';
import { FIELD_TIPS } from '../models/field-tips';
import { blocklistValidator, checkRangeConsistency, dotRangeValidator, hexColorValidator, imagePathValidator, languageScriptValidator, slugFormatValidator, slugUniqueValidator } from '../validators/custom-validators';
import { CollectionData, CollectionDocument, PuzzleEntry } from '../models/puzzle-entry.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { EnglishReviewDirective } from './english-review.directive';
import { EnglishReviewService } from './english-review.service';
import { AuditAction, AuditEntry, AuditLogService, AuditTrigger } from '../audit-log.service';

declare global {
  interface Window {
    submitAsAutomation: (options?: { action?: AuditAction; dryRun?: boolean }) => Promise<AuditEntry & { valid?: boolean }>;
  }
}

export type EntryStatus = 'draft' | 'validated' | 'submitted';

export interface VersionSnapshot {
  status: EntryStatus;
  data: any;
  entrySlug: string;
}

interface ValidationIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

interface CrayolaColor {
  color: string;
  hex: string;
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
  private collectionDocument: CollectionDocument = null;
  private loadedAuditSnapshot: any = {};
  get editingCollection(): boolean { return Boolean(this.collectionDocument && this.collectionOnly); }
  collectionOnly = false;
  get errorIssues(): ValidationIssue[] { return this.validationIssues.filter(issue => issue.severity === 'error'); }
  get warningIssues(): ValidationIssue[] { return this.validationIssues.filter(issue => issue.severity === 'warning'); }
  importError: string = null;
  activeTab: 'form' | 'preview' = 'form';
  crayolaColors: CrayolaColor[] = [];
  colorLookupError = false;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private reviews: EnglishReviewService, private http: HttpClient, private auditLog: AuditLogService) {}

  ngOnInit(): void {
    this.form = this.buildForm();
    this.loadedAuditSnapshot = this.currentEditableValue();
    window.submitAsAutomation = options => this.submitAsAutomation(options);
    this.http.get<{ colors: CrayolaColor[] }>('assets/crayola-color-lookup.json').subscribe({
      next: data => {
        this.crayolaColors = (data.colors || []).slice().sort((a, b) => a.color.localeCompare(b.color));
        this.syncAllColorMappings();
      },
      error: () => { this.colorLookupError = true; }
    });
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
      collection: this.buildCollectionForm(),
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
          image: ['', [Validators.required, imagePathValidator()]],
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
        faqs: this.fb.array([], Validators.required),
        dot_guide: this.fb.group({
          intro: ['', text(Validators.required, Validators.minLength(r.body.dot_guide.intro.minLength))],
          outro: ['', text(Validators.required, Validators.minLength(r.body.dot_guide.outro.minLength))],
          sections: this.fb.array([this.buildSection()]),
          color_schemes: this.fb.array([this.buildColorScheme()])
        })
      })
    });
  }

  private buildCollectionForm(): FormGroup {
    const r = this.rules.collection;
    const text = (...validators: any[]) => [
      ...validators,
      languageScriptValidator(() => this.contentLanguage),
      blocklistValidator(() => this.contentLanguage)
    ];
    const group = this.fb.group({
      header: this.fb.group({
        title: ['', text(Validators.required, Validators.minLength(r.header.title.minLength), Validators.maxLength(r.header.title.maxLength))],
        meta_description: ['', text(Validators.required, Validators.minLength(r.header.meta_description.minLength), Validators.maxLength(r.header.meta_description.maxLength))],
        og: this.fb.group({
          title: ['', text(Validators.required, Validators.minLength(r.header.og.title.minLength), Validators.maxLength(r.header.og.title.maxLength))],
          description: ['', text(Validators.required, Validators.minLength(r.header.og.description.minLength), Validators.maxLength(r.header.og.description.maxLength))],
          image: ['', [Validators.required, imagePathValidator()]]
        }),
        json_ld: this.fb.group({
          type: ['CollectionPage', [Validators.required, Validators.pattern(/^CollectionPage$/)]],
          name: ['', text(Validators.required, Validators.maxLength(r.header.json_ld.name.maxLength))],
          description: ['', text(Validators.required, Validators.maxLength(r.header.json_ld.description.maxLength))],
          image: ['', [Validators.required, imagePathValidator()]],
          main_entity: this.fb.group({
            type: ['ItemList', [Validators.required, Validators.pattern(/^ItemList$/)]],
            item_source: ['puzzles', [Validators.required, Validators.pattern(/^puzzles$/)]]
          })
        }),
        breadcrumb_json_ld: this.fb.group({
          type: ['BreadcrumbList', [Validators.required, Validators.pattern(/^BreadcrumbList$/)]],
          items: this.fb.array([
            this.fb.group({ position: [1, Validators.required], name: ['Home', Validators.required], path: ['/', [Validators.required, Validators.pattern(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/)]] }),
            this.fb.group({ position: [2, Validators.required], name: ['', text(Validators.required)], path: ['', [Validators.required, Validators.pattern(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/)]] })
          ])
        })
      }),
      body: this.fb.group({
        h1: ['', text(Validators.required, Validators.minLength(r.body.h1.minLength), Validators.maxLength(r.body.h1.maxLength))],
        name: ['', text(Validators.required, Validators.maxLength(r.body.name.maxLength))],
        tagline: ['', text(Validators.required, Validators.maxLength(r.body.tagline.maxLength))],
        description: ['', text(Validators.required, Validators.minLength(r.body.description.minLength), Validators.maxLength(r.body.description.maxLength))],
        hero_image: ['', [Validators.required, imagePathValidator()]],
        slug: ['', [Validators.required, slugFormatValidator()]],
        faqs: this.fb.array([], Validators.required)
      })
    });
    group.disable({ emitEvent: false });
    return group;
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

  private buildFaq(): FormGroup {
    const language = languageScriptValidator(() => this.contentLanguage);
    const safety = blocklistValidator(() => this.contentLanguage);
    return this.fb.group({
      q: ['', [Validators.required, Validators.minLength(this.rules.faq.question.minLength), Validators.maxLength(this.rules.faq.question.maxLength), language, safety]],
      a: ['', [Validators.required, Validators.minLength(this.rules.faq.answer.minLength), Validators.maxLength(this.rules.faq.answer.maxLength), language, safety]]
    });
  }

  private buildMapping(): FormGroup {
    const language = languageScriptValidator(() => this.contentLanguage);
    const group = this.fb.group({
      range: ['', [Validators.required, dotRangeValidator()]],
      part: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      color: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]],
      hex: [{ value: '', disabled: true }, [Validators.required, hexColorValidator()]],
      why: ['', [Validators.required, language, blocklistValidator(() => this.contentLanguage)]]
    });
    group.get('color').valueChanges.subscribe(color => this.applySelectedColor(group, color));
    return group;
  }

  isCustomColor(mapping: AbstractControl): boolean {
    const hex = mapping.get('hex').value;
    return Boolean(hex && !this.crayolaColors.some(item =>
      item.hex.toUpperCase() === String(hex).toUpperCase()));
  }

  private applySelectedColor(mapping: AbstractControl, color: string): void {
    const match = this.crayolaColors.find(item => item.color === color);
    if (match) { mapping.get('hex').setValue(match.hex, { emitEvent: false }); }
  }

  private syncAllColorMappings(): void {
    this.colorSchemes.controls.forEach(scheme => {
      const mappings = scheme.get('mapping') as FormArray;
      mappings.controls.forEach(mapping => {
        const hex = String(mapping.get('hex').value || '').toUpperCase();
        const match = this.crayolaColors.find(item => item.hex.toUpperCase() === hex);
        if (match) {
          mapping.get('color').setValue(match.color, { emitEvent: false });
          this.applySelectedColor(mapping, match.color);
        }
      });
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

  get collectionBreadcrumbItems(): FormArray {
    return this.form.get('collection.header.breadcrumb_json_ld.items') as FormArray;
  }

  get puzzleFaqs(): FormArray { return this.form.get('body.faqs') as FormArray; }
  get collectionFaqs(): FormArray { return this.form.get('collection.body.faqs') as FormArray; }

  addPuzzleFaq(): void { this.puzzleFaqs.push(this.buildFaq()); }
  removePuzzleFaq(index: number): void { this.puzzleFaqs.removeAt(index); }
  addCollectionFaq(): void { this.collectionFaqs.push(this.buildFaq()); }
  removeCollectionFaq(index: number): void { this.collectionFaqs.removeAt(index); }

  private rebuildFaqs(target: FormArray, faqs: Array<{ q: string; a: string }> = []): void {
    while (target.length) { target.removeAt(0); }
    (faqs || []).forEach(faq => {
      const group = this.buildFaq();
      group.patchValue(faq);
      target.push(group);
    });
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

  fieldError(controlPath: string): string {
    const control = this.form.get(controlPath);
    if (!control || !control.errors) { return ''; }
    const rule = Object.keys(control.errors)[0];
    return this.validationMessage(rule, control.errors[rule]);
  }

  // -------------------------------------------------------------------
  // Generate + download
  // -------------------------------------------------------------------

  onGenerate(): void {
    if (!this.validateForm(false, false)) {
      this.generatedJson = null;
      return;
    }

    const entry = this.snapshotWithStatus('submitted');
    this.recordAudit('save', 'human');
    this.generatedJson = JSON.stringify(entry, null, 2);
    this.versionSaved.emit({ status: 'submitted', data: entry, entrySlug: this.currentEntrySlug() });
  }

  validateForm(saveVersion = true, writeAudit = true, trigger: AuditTrigger = 'human'): boolean {
    if (writeAudit) { this.recordAudit('validate', trigger); }
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
      this.versionSaved.emit({ status: 'validated', data: this.snapshotWithStatus('validated'), entrySlug: this.currentEntrySlug() });
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
    this.recordAudit('save', 'human');
    this.versionSaved.emit({ status: 'draft', data: this.snapshotWithStatus('draft'), entrySlug: this.currentEntrySlug() });
  }

  async submitAsAutomation(options: { action?: AuditAction; dryRun?: boolean } = {}): Promise<AuditEntry & { valid?: boolean }> {
    const action = options.action || 'validate';
    const dryRun = Boolean(options.dryRun);
    const entry = this.createAuditEntry(action, 'automated');
    let valid: boolean = undefined;
    if (action === 'validate') {
      valid = this.validateForm(!dryRun, false, 'automated');
    } else if (!dryRun) {
      this.versionSaved.emit({ status: 'draft', data: this.snapshotWithStatus('draft'), entrySlug: this.currentEntrySlug() });
    }
    if (!dryRun) { await this.auditLog.append(entry); }
    return valid === undefined ? entry : { ...entry, valid };
  }

  private recordAudit(action: AuditAction, trigger: AuditTrigger): void {
    void this.auditLog.append(this.createAuditEntry(action, trigger));
  }

  private createAuditEntry(action: AuditAction, trigger: AuditTrigger): AuditEntry {
    return {
      timestamp: new Date().toISOString(),
      action,
      trigger,
      entry_id: this.currentEntrySlug() || 'untitled',
      entry_type: this.collectionOnly ? 'collection' : 'puzzle',
      changes: this.auditLog.diff(this.loadedAuditSnapshot, this.currentEditableValue())
    };
  }

  private currentEditableValue(): any {
    if (!this.form) { return {}; }
    const raw = this.form.getRawValue();
    return JSON.parse(JSON.stringify(this.collectionOnly ? raw.collection : this.puzzleValue(raw)));
  }

  private currentEntrySlug(): string {
    return this.collectionOnly
      ? this.form.get('collection.body.slug').value
      : (this.loadedSlug || this.form.get('slug').value);
  }

  private snapshotWithStatus(status: EntryStatus): any {
    const raw = this.form.getRawValue();
    const puzzle = this.puzzleValue(raw);
    const entrySlug = this.collectionOnly ? raw.collection.body.slug : puzzle.slug;
    const cms = { status, savedAt: new Date().toISOString(), entrySlug };
    if (!this.collectionDocument) { return { ...puzzle, _cms: cms }; }
    const puzzles = this.collectionOnly
      ? this.collectionDocument.puzzles
      : this.collectionDocument.puzzles.map(entry => entry.slug === this.loadedSlug ? puzzle : entry);
    return { collection: raw.collection, puzzles, _cms: cms };
  }

  private puzzleValue(raw: any): PuzzleEntry {
    return { slug: raw.slug, header: raw.header, body: raw.body };
  }

  hasUnsavedChanges(): boolean {
    return Boolean(this.form && this.form.dirty);
  }

  markSaved(snapshot?: any): void {
    const raw = this.form.getRawValue();
    const editable = this.collectionOnly
      ? { collection: raw.collection }
      : (this.collectionDocument ? { collection: raw.collection, ...this.puzzleValue(raw) } : this.puzzleValue(raw));
    if (!snapshot || JSON.stringify(editable) === JSON.stringify(this.withoutCms(snapshot))) {
      this.form.markAsPristine();
    }
  }

  private withoutCms(snapshot: any): any {
    const clean = JSON.parse(JSON.stringify(snapshot || {}));
    delete clean._cms;
    delete clean.status;
    if (clean.collection && Array.isArray(clean.puzzles)) {
      if (this.collectionOnly) { return { collection: clean.collection }; }
      const entry = clean.puzzles.find(item => item.slug === this.loadedSlug) || clean.puzzles[0];
      return { collection: clean.collection, ...entry };
    }
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
      case 'imagePath': return 'Use a root-relative image path such as /images/flowers/example.webp.';
      case 'pattern': return 'Use the required fixed value or root-relative path format.';
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
    a.download = this.collectionDocument ? `puzzles-${this.form.get('collection.body.slug').value}.json` : `${slug}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  resetForm(): void {
    this.loadedSlug = null;
    this.collectionDocument = null;
    this.collectionOnly = false;
    this.form = this.buildForm();
    this.generatedJson = null;
    this.submitted = false;
    this.validationResult = null;
    this.invalidFieldCount = 0;
    this.validationIssues = [];
    this.importError = null;
    this.form.markAsPristine();
    this.loadedAuditSnapshot = this.currentEditableValue();
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
  loadImportedJson(parsed: any, selectedSlug?: string, collectionOnly = false): void {
    this.importError = null;
    const isCollection = parsed && !Array.isArray(parsed) && parsed.collection && Array.isArray(parsed.puzzles);
    const raw = isCollection
      ? (parsed.puzzles.find(entry => entry.slug === selectedSlug) || parsed.puzzles[0])
      : (Array.isArray(parsed) ? parsed[0] : parsed);
    if (!raw) {
      this.importError = 'No entry found to import.';
      return;
    }
    this.collectionDocument = isCollection ? this.withoutDocumentCms(parsed) : null;
    this.collectionOnly = isCollection && collectionOnly;
    const collectionControl = this.form.get('collection');
    if (isCollection) {
      collectionControl.patchValue(parsed.collection);
      this.rebuildFaqs(this.collectionFaqs, parsed.collection.body?.faqs || []);
      if (this.collectionOnly) { collectionControl.enable({ emitEvent: false }); }
      else { collectionControl.disable({ emitEvent: false }); }
    } else {
      collectionControl.reset();
      collectionControl.disable({ emitEvent: false });
    }
    ['slug', 'header', 'body'].forEach(path => {
      const control = this.form.get(path);
      if (this.collectionOnly) { control.disable({ emitEvent: false }); }
      else { control.enable({ emitEvent: false }); }
    });
    const entry = this.normalizeEntry(raw);
    this.loadedSlug = entry.slug || null;
    this.patchFormWithEntry(entry);
    this.generatedJson = null;
    this.submitted = false;
    this.validationResult = null;
    this.invalidFieldCount = 0;
    this.validationIssues = [];
    this.form.markAsPristine();
    this.loadedAuditSnapshot = this.currentEditableValue();
  }

  private withoutDocumentCms(document: any): CollectionDocument {
    const clean = JSON.parse(JSON.stringify(document));
    delete clean._cms;
    delete clean.status;
    return clean;
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
        faqs: raw.faqs || [],
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
    this.rebuildFaqs(this.puzzleFaqs, entry.body.faqs || []);

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
    this.syncAllColorMappings();
  }
}
