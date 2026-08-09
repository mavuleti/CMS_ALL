import { getTranslations } from 'next-intl/server';

const GOOGLE_FORM_ACTION = process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FORM_ACTION ?? '';
const FIELD_TYPE = process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FIELD_TYPE ?? '';
const FIELD_MESSAGE = process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FIELD_MESSAGE ?? '';
const FIELD_EMAIL = process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FIELD_EMAIL ?? '';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_FEEDBACK_RECAPTCHA_SITE_KEY ?? '';
const FEEDBACK_TYPES = [
  'general',
  'requestTheme',
  'brokenLink',
  'improvement',
  'other',
];

const isConfigured = Boolean(GOOGLE_FORM_ACTION && FIELD_TYPE && FIELD_MESSAGE);

export default async function FeedbackForm() {
  const t = await getTranslations('feedbackForm');

  if (!isConfigured) {
    return (
      <p className="form-status error" role="alert">
        {t('notConnected')}
      </p>
    );
  }

  return (
    <>
      <form
        id="feedback-form"
        className="feedback-form"
        aria-label={t('ariaLabel')}
        action={GOOGLE_FORM_ACTION}
        method="POST"
        target="feedback-submit-frame"
      >
        <div className="feedback-field">
          <label htmlFor="feedbackType">{t('typeLabel')}</label>
          <select id="feedbackType" name={FIELD_TYPE} required defaultValue="">
            <option value="" disabled>{t('selectTopic')}</option>
            {FEEDBACK_TYPES.map((type) => (
              <option key={type} value={t(`types.${type}`)}>{t(`types.${type}`)}</option>
            ))}
          </select>
        </div>

        <div className="feedback-field">
          <label htmlFor="message">{t('messageLabel')}</label>
          <textarea
            id="message"
            name={FIELD_MESSAGE}
            rows={4}
            placeholder={t('messagePlaceholder')}
            required
            minLength={10}
            maxLength={2000}
          />
        </div>

        {FIELD_EMAIL && (
          <div className="feedback-field">
            <label htmlFor="feedbackEmail">
              {t('emailLabel')} <span style={{ fontWeight: 400, opacity: 0.65 }}>{t('emailOptional')}</span>
            </label>
            <input
              id="feedbackEmail"
              name={FIELD_EMAIL}
              type="email"
              // eslint-disable-next-line no-restricted-syntax -- example email format placeholder, not language-specific copy
              placeholder="you@example.com"
              autoComplete="email"
              suppressHydrationWarning
            />
          </div>
        )}

        {RECAPTCHA_SITE_KEY && (
          <div
            className="g-recaptcha"
            data-sitekey={RECAPTCHA_SITE_KEY}
            data-callback="feedbackCaptchaComplete"
            data-expired-callback="feedbackCaptchaExpired"
            style={{ marginBottom: 16 }}
          />
        )}
        <button type="submit" className="feedback-submit" disabled={Boolean(RECAPTCHA_SITE_KEY)}>
          {t('submit')}
        </button>
        <p id="feedback-success" className="form-status success" role="status" aria-live="polite" hidden>
          {t('success')}
        </p>
        <p className="feedback-disclaimer">
          {t('disclaimer')}
        </p>
      </form>
      <iframe
        title={t('iframeTitle')}
        name="feedback-submit-frame"
        className="form-submit-frame"
        aria-hidden="true"
        tabIndex={-1}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var form = document.getElementById('feedback-form');
              var success = document.getElementById('feedback-success');
              if (!form || !success) return;
              var submit = form.querySelector('button[type="submit"]');
              window.feedbackCaptchaComplete = function () { if (submit) submit.disabled = false; };
              window.feedbackCaptchaExpired = function () { if (submit) submit.disabled = true; };
              form.addEventListener('submit', function () {
                success.hidden = false;
                window.setTimeout(function () {
                  form.reset();
                }, 600);
              });
            })();
          `,
        }}
      />
      {RECAPTCHA_SITE_KEY && <script src="https://www.google.com/recaptcha/api.js" async defer />}
    </>
  );
}
