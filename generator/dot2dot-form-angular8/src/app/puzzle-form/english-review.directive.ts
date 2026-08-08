import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { EnglishReviewService } from './english-review.service';

/** Adds an expandable English-source review below every reactive-form field. */
@Directive({ selector: '[formControlName]', standalone: true })
export class EnglishReviewDirective implements OnInit, OnDestroy {
  private button: HTMLButtonElement;
  private panel: HTMLElement;
  private removeClick: () => void;
  private removeBlur: () => void;

  constructor(
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private controlName: FormControlName,
    private reviews: EnglishReviewService
  ) {}

  ngOnInit(): void {
    if (!this.controlName || !this.controlName.path) { return; }
    this.button = this.renderer.createElement('button');
    this.renderer.setAttribute(this.button, 'type', 'button');
    this.renderer.addClass(this.button, 'english-review-toggle');
    this.renderer.setAttribute(this.button, 'aria-expanded', 'false');
    this.renderer.setAttribute(this.button, 'title', 'Show the English source for this field');
    this.renderer.setProperty(this.button, 'textContent', '👁 English');

    this.panel = this.renderer.createElement('div');
    this.renderer.addClass(this.panel, 'english-review-panel');
    this.renderer.setAttribute(this.panel, 'hidden', '');
    const field = this.host.nativeElement.parentElement;
    if (!field) { return; }
    this.renderer.appendChild(field, this.button);
    this.renderer.appendChild(field, this.panel);
    this.removeClick = this.renderer.listen(this.button, 'click', () => this.toggle());
    this.removeBlur = this.renderer.listen(this.host.nativeElement, 'blur', () => this.updateWarningStyle());
  }

  ngOnDestroy(): void {
    if (this.removeClick) { this.removeClick(); }
    if (this.removeBlur) { this.removeBlur(); }
  }

  private toggle(): void {
    const opening = this.panel.hasAttribute('hidden');
    this.renderer.setAttribute(this.button, 'aria-expanded', String(opening));
    if (!opening) {
      this.renderer.setAttribute(this.panel, 'hidden', '');
      return;
    }
    this.renderReview();
    this.renderer.removeAttribute(this.panel, 'hidden');
  }

  private renderReview(): void {
    const englishValue = this.reviews.valueAt(this.controlName.path);
    const localValue = this.controlName.control ? this.controlName.control.value : '';
    const hasSource = englishValue !== undefined && englishValue !== null && englishValue !== '';
    const matches = hasSource && String(englishValue).trim() === String(localValue || '').trim();
    this.renderer.setProperty(this.panel, 'textContent', '');

    const heading = this.renderer.createElement('strong');
    this.renderer.setProperty(heading, 'textContent', hasSource ? 'English source' : 'English source unavailable');
    this.renderer.appendChild(this.panel, heading);
    if (hasSource) {
      const value = this.renderer.createElement('div');
      this.renderer.addClass(value, 'english-review-value');
      this.renderer.setProperty(value, 'textContent', String(englishValue));
      this.renderer.appendChild(this.panel, value);
    }
    const status = this.renderer.createElement('span');
    this.renderer.addClass(status, matches ? 'review-warning' : 'review-ready');
    this.renderer.setProperty(status, 'textContent', matches ? '⚠ Same as English — review translation' : '✓ Translation differs from English');
    if (hasSource) { this.renderer.appendChild(this.panel, status); }
  }

  private updateWarningStyle(): void {
    const englishValue = this.reviews.valueAt(this.controlName.path);
    const localValue = this.controlName.control ? this.controlName.control.value : '';
    const path = this.controlName.path.reduce((result, segment) =>
      /^\d+$/.test(segment) ? `${result}[${segment}]` : (result ? `${result}.${segment}` : segment), '');
    const warning = this.reviews.isTranslatablePath(path) && englishValue != null && String(localValue || '').trim() !== '' &&
      String(englishValue).trim() === String(localValue).trim();
    if (warning) {
      this.renderer.addClass(this.host.nativeElement, 'review-warning-field');
    } else {
      this.renderer.removeClass(this.host.nativeElement, 'review-warning-field');
    }
  }
}
