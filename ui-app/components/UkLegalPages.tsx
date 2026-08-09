import Link from 'next/link';
import legal from '@/content/uk/legal.json';

const email = 'hellokidsbookworld@gmail.com';

// This component renders the Ukrainian (uk) locale only — every literal string below
// is already Ukrainian-language copy, not an English leak. It predates the JSON-driven
// content/{locale}/legal.json pattern used elsewhere; inline link text/headings here are
// intentionally exempt from the hardcoded-JSX-text rule for that reason.
/* eslint-disable no-restricted-syntax */
export function UkContactPage() {
  const c = legal.contact;
  return <LegalShell title={c.title}><p>{c.intro} <a href={`mailto:${email}`}>{email}</a></p><h2>{c.topicsTitle}</h2><p><strong>{c.requestsTitle}</strong> {c.requests}</p><p><strong>{c.correctionsTitle}</strong> {c.corrections}</p><p><strong>{c.licensingTitle}</strong> {c.licensing} <Link href="/uk/terms/">умови використання</Link>.</p><p><strong>{c.feedbackTitle}</strong> {c.feedback}</p><h2>{c.responseTitle}</h2><p>{c.response}</p><p>{c.about.split(':')[0]}: <Link href="/uk/about/">про нас</Link>.</p></LegalShell>;
}

export function UkTermsPage() {
  const c = legal.terms;
  return <LegalShell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.freeTitle}</h2><p>{c.free}</p><h2>{c.permissionTitle}</h2><p>{c.permission} <Link href="/uk/contact/">Зв’яжіться з нами</Link>.</p><h2>{c.ipTitle}</h2><p>{c.ip}</p><h2>{c.warrantyTitle}</h2><p>{c.warranty}</p><h2>{c.externalTitle}</h2><p>{c.external}</p><h2>{c.changesTitle}</h2><p>{c.changes} <a href={`mailto:${email}`}>{email}</a>. <Link href="/uk/privacy-policy/">Політика конфіденційності</Link>.</p></LegalShell>;
}

export function UkPrivacyPage() {
  const c = legal.privacy;
  return <LegalShell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.collectTitle}</h2><p>{c.analytics}</p><p>{c.email}</p><p>{c.forms}</p><h2>{c.childrenTitle}</h2><p>{c.children}</p><h2>{c.adsTitle}</h2><p>{c.ads}</p><h2>{c.rightsTitle}</h2><p>{c.rights}</p><h2>{c.securityTitle}</h2><p>{c.security}</p><h2>{c.changesTitle}</h2><p>{c.changes} <a href={`mailto:${email}`}>{email}</a> або через <Link href="/uk/contact/">сторінку контактів</Link>.</p></LegalShell>;
}

export function UkAboutPage() {
  return <LegalShell title="Про DotToDotFreePrintables">
    <p>DotToDotFreePrintables.com робить одне: безкоштовні завдання «з’єднай крапки» для дітей. Без облікових записів, підписок і платного доступу — кожну головоломку можна завантажити як готовий до друку PDF та використовувати вдома, на домашньому навчанні або в класі.</p>
    <h2>Як створюються головоломки</h2>
    <p>Кожну головоломку ми створюємо, друкуємо на папері й тестуємо з реальними дітьми перед публікацією. Якщо скупчення крапок плутає дітей або лінія перетинається незручно, сторінку виправляють. Завдання впорядковані за темою та складністю — від сторінок із 10 крапками для малюків до завдань зі 100+ крапками для старших дітей.</p>
    <h2>Хто пише наші матеріали</h2>
    <p>Наші посібники та статті виходять під псевдонімом <strong>Mira</strong>. Mira створює, друкує й тестує з дітьми кожну головоломку на сайті перед публікацією. Поради для батьків і вчителів народжуються зі спостережень за тим, як реальні діти працюють із цими сторінками.</p>
    <h2>Чому це безкоштовно</h2>
    <p>Роздруковані заняття — один із найпростіших способів провести час без екранів для сімей і вчителів, тому базова версія має бути доступною безкоштовно. Сайт може показувати рекламу для покриття витрат, але самі головоломки залишаться безкоштовними.</p>
    <h2>Зв’яжіться з нами</h2>
    <p>Ми завжди раді запитам на головоломки, виправленням і запитанням. Перейдіть на <Link href="/uk/contact/">сторінку контактів</Link>, а також ознайомтеся з <Link href="/uk/privacy-policy/">політикою конфіденційності</Link> та <Link href="/uk/terms/">умовами використання</Link>.</p>
  </LegalShell>;
}
/* eslint-enable no-restricted-syntax */

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main><section className="section" style={{ maxWidth: '72ch', margin: '0 auto' }}><h1>{title}</h1>{children}</section></main>;
}
