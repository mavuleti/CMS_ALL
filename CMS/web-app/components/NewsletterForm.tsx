'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterForm() {
  const t = useTranslations('newsletterForm');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    if (data.get('website')) {
      setMessage(t('error'));
      return;
    }

    setMessage(t('notConnected'));
  }

  return (
    <form
      className="signup-form"
      aria-label={t('ariaLabel')}
      onSubmit={handleSubmit}
    >
      <label htmlFor="email">{t('emailLabel')}</label>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          // eslint-disable-next-line no-restricted-syntax -- example email format placeholder, not language-specific copy
          placeholder="you@example.com"
          autoComplete="email"
          required
          suppressHydrationWarning
        />
        <button type="submit">{t('submit')}</button>
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">{t('honeypot')}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '0.5rem' }}>
        {t('privacy')}
      </p>
      <p className="form-status" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
