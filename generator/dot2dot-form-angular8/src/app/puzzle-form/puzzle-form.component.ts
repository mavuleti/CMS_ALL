import { Component, EventEmitter, HostListener, OnInit, Output, SecurityContext } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FIELD_RULES } from '../models/field-rules';
import { FIELD_TIPS } from '../models/field-tips';
import { dotRangeValidator, hexColorValidator, slugFormatValidator } from '../validators/custom-validators';
import { PuzzleEntry } from '../models/puzzle-entry.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

export type EntryStatus = 'draft' | 'validated' | 'submitted';

export interface VersionSnapshot {
  status: EntryStatus;
  data: any;
}

interface ValidationIssue {
  path: string;
  message: string;
}

@Component({
  selector: 'app-puzzle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './puzzle-form.component.html',
  styleUrls: ['./puzzle-form.component.scss']
})
export class PuzzleFormComponent implements OnInit {
  @Output() versionSaved = new EventEmitter<VersionSnapshot>();

  rules = FIELD_RULES;
  tips = FIELD_TIPS;
  form: FormGroup;
  generatedJson: string = null;
  submitted = false;
  validationResult: 'valid' | 'invalid' = null;
  invalidFieldCount = 0;
  validationIssues: ValidationIssue[] = [];
  importError: string = null;
  activeTab: 'form' | 'preview' = 'form';

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {}

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

    return this.fb.group({
      slug: ['', [Validators.required, slugFormatValidator()]],

      header: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(r.header.title.minLength), Validators.maxLength(r.header.title.maxLength)]],
        meta_description: ['', [Validators.required, Validators.minLength(r.header.meta_description.minLength), Validators.maxLength(r.header.meta_description.maxLength)]],
        og: this.fb.group({
          title: ['', [Validators.required, Validators.maxLength(r.header.og.title.maxLength)]],
          description: ['', [Validators.required, Validators.maxLength(r.header.og.description.maxLength)]],
          image_alt: ['', [Validators.required, Validators.maxLength(r.header.og.image_alt.maxLength)]]
        }),
        json_ld: this.fb.group({
          type: ['CreativeWork', Validators.required],
          name: ['', Validators.required],
          description: ['', [Validators.required, Validators.maxLength(r.header.json_ld.description.maxLength)]],
          image: ['', Validators.required],
          educational_use: ['', Validators.required],
          age_range: ['', Validators.required]
        })
      }),

      body: this.fb.group({
        h1: ['', [Validators.required, Validators.minLength(r.body.h1.minLength), Validators.maxLength(r.body.h1.maxLength)]],
        name: ['', [Validators.required, Validators.maxLength(r.body.name.maxLength)]],
        tagline: ['', [Validators.required, Validators.maxLength(r.body.tagline.maxLength)]],
        description: ['', [Validators.required, Validators.minLength(r.body.description.minLength), Validators.maxLength(r.body.description.maxLength)]],
        fun_fact: ['', [Validators.required, Validators.minLength(r.body.fun_fact.minLength), Validators.maxLength(r.body.fun_fact.maxLength)]],
        dot_guide: this.fb.group({
          intro: ['', [Validators.required, Validators.minLength(r.body.dot_guide.intro.minLength)]],
          outro: ['', [Validators.required, Validators.minLength(r.body.dot_guide.outro.minLength)]],
          sections: this.fb.array([this.buildSection()]),
          color_schemes: this.fb.array([this.buildColorScheme()])
        })
      })
    });
  }

  private buildSection(): FormGroup {
    return this.fb.group({
      range: ['', [Validators.required, dotRangeValidator()]],
      title: ['', [Validators.required, Validators.maxLength(this.rules.body.dot_guide.section.title.maxLength)]],
      learn: ['', [Validators.required, Validators.minLength(this.rules.body.dot_guide.section.learn.minLength)]],
      fact: ['', [Validators.required, Validators.minLength(this.rules.body.dot_guide.section.fact.minLength)]]
    });
  }

  private buildMapping(): FormGroup {
    return this.fb.group({
      range: ['', [Validators.required, dotRangeValidator()]],
      part: ['', Validators.required],
      color: ['', Validators.required],
      hex: ['', [Validators.required, hexColorValidator()]],
      why: ['', Validators.required]
    });
  }

  private buildColorScheme(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      note: ['', Validators.required],
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
    this.form.updateValueAndValidity();
    this.validationIssues = this.collectControlIssues(this.form).concat(this.collectCrossFieldIssues());
    this.invalidFieldCount = this.validationIssues.length;
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
    const controlName = path.split('.').pop().replace(/\[\d+\]/g, '');
    const element = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private collectControlIssues(control: AbstractControl, path = ''): ValidationIssue[] {
    if (control instanceof FormGroup) {
      return Object.keys(control.controls).reduce((issues, key) =>
        issues.concat(this.collectControlIssues(control.controls[key], path ? `${path}.${key}` : key)), [] as ValidationIssue[]);
    }
    if (control instanceof FormArray) {
      return control.controls.reduce((issues, child, index) =>
        issues.concat(this.collectControlIssues(child, `${path}[${index}]`)), [] as ValidationIssue[]);
    }
    if (!control.invalid) { return []; }
    const rules = Object.keys(control.errors || {}).join(', ');
    return [{ path, message: rules ? `Fails: ${rules}` : 'Invalid value' }];
  }

  private collectCrossFieldIssues(): ValidationIssue[] {
    const value = this.form.getRawValue();
    const issues: ValidationIssue[] = [];
    if (value.header.json_ld.name !== value.body.name) {
      issues.push({ path: 'header.json_ld.name', message: 'Must match body.name.' });
    }

    const sectionRanges = (value.body.dot_guide.sections || []).map(section => this.parseRange(section.range));
    sectionRanges.forEach((range, index) => {
      if (index && range && sectionRanges[index - 1] && range[0] !== sectionRanges[index - 1][1] + 1) {
        issues.push({ path: `body.dot_guide.sections[${index}].range`, message: 'Ranges must be continuous and non-overlapping.' });
      }
    });
    const validRanges = new Set((value.body.dot_guide.sections || []).map(section => section.range));
    (value.body.dot_guide.color_schemes || []).forEach((scheme, schemeIndex) => {
      (scheme.mapping || []).forEach((mapping, mappingIndex) => {
        if (mapping.range && !validRanges.has(mapping.range)) {
          issues.push({ path: `body.dot_guide.color_schemes[${schemeIndex}].mapping[${mappingIndex}].range`, message: 'Must match a dot-guide section range.' });
        }
      });
    });

    const titleCounts = [value.header.title, value.body.h1, value.body.description]
      .map(text => this.firstNumber(text)).filter(count => count !== null);
    if (titleCounts.length > 1 && titleCounts.some(count => count !== titleCounts[0])) {
      issues.push({ path: 'header.title', message: 'Dot counts disagree across title, H1, or description.' });
    }
    return issues;
  }

  private parseRange(value: string): [number, number] | null {
    const match = String(value || '').match(/^(\d+)\s*[–-]\s*(\d+)$/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  private firstNumber(value: string): number | null {
    const match = String(value || '').match(/\b(\d{2,3})\b/);
    return match ? Number(match[1]) : null;
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
