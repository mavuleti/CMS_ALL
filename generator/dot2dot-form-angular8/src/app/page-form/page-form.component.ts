import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { blocklistValidator, imagePathValidator, languageScriptValidator, slugFormatValidator } from '../validators/custom-validators';
import { VersionSnapshot } from '../puzzle-form/puzzle-form.component';
import { AuditLogService } from '../audit-log.service';

interface PageIssue { path: string; message: string; severity: 'error' | 'warning'; }

@Component({
  selector: 'app-page-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent {
  @Input() contentLanguage = 'en';
  @Output() versionSaved = new EventEmitter<VersionSnapshot>();
  form: FormGroup = this.fb.group({});
  documentKind: 'page' | 'blog' = 'page';
  generatedJson: string = null;
  submitted = false;
  private baseline: any = {};
  collectionOnly = false;
  warningIssues: PageIssue[] = [];
  errorIssues: PageIssue[] = [];

  constructor(private fb: FormBuilder, private auditLog: AuditLogService) {}

  loadDocument(document: any, kind: 'page' | 'blog' = 'page'): void {
    this.documentKind = kind;
    this.form = this.controlFor(document, '') as FormGroup;
    this.generatedJson = null;
    this.submitted = false;
    this.baseline = this.value();
    this.refreshIssues();
  }

  loadImportedJson(document: any): void { this.loadDocument(document, this.documentKind); }
  markSaved(data: any): void { this.baseline = JSON.parse(JSON.stringify(data)); this.form.markAsPristine(); }
  hasUnsavedChanges(): boolean { return JSON.stringify(this.value()) !== JSON.stringify(this.baseline); }

  keys(group: AbstractControl): string[] { return group instanceof FormGroup ? Object.keys(group.controls) : []; }
  isGroup(control: AbstractControl): boolean { return control instanceof FormGroup; }
  isArray(control: AbstractControl): boolean { return control instanceof FormArray; }
  isTextArea(path: string, value: any): boolean { return /description|bio|intro|paragraph|text|policy|permission|collect|changes|warranty|analytics|content|note/i.test(path) || String(value || '').length > 100; }
  itemLabel(path: string, index: number): string { return `${this.label(path.split('.').pop())} ${index + 1}`; }
  label(key: string): string { return String(key || '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()); }
  path(parent: string, key: string): string { return parent ? `${parent}.${key}` : key; }
  controlAt(path: string): AbstractControl { return this.form.get(path); }

  isInvalid(control: AbstractControl): boolean { return Boolean(control && control.invalid && (control.touched || this.submitted)); }
  error(control: AbstractControl): string {
    const errors = control && control.errors || {};
    if (errors.required) { return 'This field is required.'; }
    if (errors.minlength) { return `Minimum ${errors.minlength.requiredLength} characters.`; }
    if (errors.maxlength) { return `Maximum ${errors.maxlength.requiredLength} characters.`; }
    if (errors.pattern || errors.slugFormat) { return 'Use the required URL-safe format.'; }
    if (errors.imagePath) { return 'Use a relative asset path beginning with /.'; }
    if (errors.languageScript) { return 'Text contains characters outside the selected locale script.'; }
    if (errors.blocklisted) { return 'Text contains a blocked or unsafe term.'; }
    return 'Invalid value.';
  }

  addArrayItem(array: FormArray, path: string): void {
    const sample = array.length ? array.at(array.length - 1).value : '';
    array.push(this.controlFor(this.blankLike(sample), `${path}.${array.length}`));
    array.markAsDirty();
  }

  removeArrayItem(array: FormArray, index: number): void {
    if (array.length > 1) { array.removeAt(index); array.markAsDirty(); }
  }

  validate(recordAudit = true): boolean {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.refreshIssues();
    if (recordAudit) { this.recordAudit('validate'); }
    if (this.form.invalid) { this.focusIssue(this.errorIssues[0] && this.errorIssues[0].path); return false; }
    return true;
  }

  save(): void {
    if (!this.validate(false)) { return; }
    const data = this.value();
    this.recordAudit('save');
    this.generatedJson = JSON.stringify(data, null, 2);
    this.versionSaved.emit({ status: 'submitted', data, entrySlug: data.slug || 'page' });
  }

  focusIssue(path: string): void {
    if (!path) { return; }
    setTimeout(() => {
      const element = document.querySelector(`[data-field-path="${CSS.escape(path)}"]`) as HTMLElement;
      if (element) { element.focus(); element.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }

  private value(): any { return JSON.parse(JSON.stringify(this.form.getRawValue())); }

  private recordAudit(action: 'validate' | 'save'): void {
    const data = this.value();
    void this.auditLog.append({
      timestamp: new Date().toISOString(), action, trigger: 'human',
      entry_id: data.slug || 'page', entry_type: this.documentKind,
      changes: this.auditLog.diff(this.baseline, data)
    });
  }

  private controlFor(value: any, path: string): AbstractControl {
    if (Array.isArray(value)) {
      const requiredArray = /(^|\.)(sections|paragraphs)$/.test(path);
      return this.fb.array(value.map((item, index) => this.controlFor(item, `${path}.${index}`)), requiredArray ? [Validators.required] : []);
    }
    if (value && typeof value === 'object') {
      const controls: {[key: string]: AbstractControl} = {};
      Object.keys(value).forEach(key => controls[key] = this.controlFor(value[key], this.path(path, key)));
      return this.fb.group(controls);
    }
    return new FormControl(value == null ? '' : value, this.validatorsFor(path, value));
  }

  private validatorsFor(path: string, value: any): any[] {
    if (typeof value !== 'string') { return []; }
    const structurallyRequired = /^(header\.(title|meta_description|og\.(title|description)|json_ld\.(type|name|description))|body\.(h1|description|category|read_time|author))$/.test(path)
      || /\.(paragraphs|tips)\.\d+$/.test(path)
      || /^body\.related_links\.\d+\.(title|href|description)$/.test(path);
    const validators: any[] = String(value || '').trim() || structurallyRequired ? [Validators.required] : [];
    if (path === 'slug') { return [Validators.required, slugFormatValidator()]; }
    if (path === 'header.title' || path === 'header.og.title') { validators.push(Validators.maxLength(60)); }
    if (path === 'header.meta_description') { validators.push(Validators.minLength(20), Validators.maxLength(158)); }
    if (path === 'header.og.description' || path === 'header.json_ld.description') { validators.push(Validators.minLength(20), Validators.maxLength(200)); }
    if (path === 'header.json_ld.name') { validators.push(Validators.maxLength(120)); }
    if (path === 'body.h1') { validators.push(Validators.maxLength(120)); }
    if (path === 'body.description') { validators.push(Validators.minLength(20), Validators.maxLength(500)); }
    if (/hero_image|\.image$|\.src$/.test(path)) { validators.push(imagePathValidator()); }
    if (/\.href$/.test(path)) { validators.push(Validators.pattern(/^(\/|https?:\/\/|mailto:)[^\s]+$/i)); }
    if (!/slug|href|image|\.src$/.test(path)) {
      validators.push(languageScriptValidator(() => this.contentLanguage), blocklistValidator(() => this.contentLanguage));
    }
    return validators;
  }

  private blankLike(value: any): any {
    if (Array.isArray(value)) { return []; }
    if (value && typeof value === 'object') { return Object.keys(value).reduce((result, key) => ({ ...result, [key]: this.blankLike(value[key]) }), {}); }
    return typeof value === 'number' ? 0 : typeof value === 'boolean' ? false : '';
  }

  private refreshIssues(): void {
    this.errorIssues = [];
    const walk = (control: AbstractControl, path: string) => {
      if (control instanceof FormGroup) { Object.keys(control.controls).forEach(key => walk(control.controls[key], this.path(path, key))); return; }
      if (control instanceof FormArray) { control.controls.forEach((item, index) => walk(item, `${path}.${index}`)); return; }
      if (control.invalid) { this.errorIssues.push({ path, message: this.error(control), severity: 'error' }); }
    };
    walk(this.form, '');
  }
}
