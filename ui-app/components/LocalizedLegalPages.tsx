export type LegalContent = {
  contact: Record<string, string>;
  terms: Record<string, string>;
  privacy: Record<string, string>;
  about: Record<string, string>;
};

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main><section className="section" style={{ maxWidth: '72ch', margin: '0 auto' }}><h1>{title}</h1>{children}</section></main>;
}

export function LocalizedContactPage({ legal }: { legal: LegalContent }) {
  const c = legal.contact;
  return <Shell title={c.title}><p>{c.intro}</p><h2>{c.topicsTitle}</h2><p><strong>{c.requestsTitle}</strong> {c.requests}</p><p><strong>{c.correctionsTitle}</strong> {c.corrections}</p><p><strong>{c.licensingTitle}</strong> {c.licensing}</p><p><strong>{c.feedbackTitle}</strong> {c.feedback}</p><h2>{c.responseTitle}</h2><p>{c.response}</p><p>{c.about}</p></Shell>;
}

export function LocalizedTermsPage({ legal }: { legal: LegalContent }) {
  const c = legal.terms;
  return <Shell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.freeTitle}</h2><p>{c.free}</p><h2>{c.permissionTitle}</h2><p>{c.permission}</p>{c.purchaseTitle && <><h2 id="digital-purchases">{c.purchaseTitle}</h2><p>{c.purchasePolicy}</p><p>{c.purchaseHelp}</p></>}<h2>{c.ipTitle}</h2><p>{c.ip}</p><h2>{c.warrantyTitle}</h2><p>{c.warranty}</p><h2>{c.externalTitle}</h2><p>{c.external}</p><h2>{c.changesTitle}</h2><p>{c.changes}</p></Shell>;
}

export function LocalizedPrivacyPage({ legal }: { legal: LegalContent }) {
  const c = legal.privacy;
  return <Shell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.collectTitle}</h2><p>{c.analytics}</p><p>{c.email}</p><p>{c.forms}</p><p>{c.notCollect}</p><h2>{c.childrenTitle}</h2><p>{c.children}</p><h2>{c.adsTitle}</h2><p>{c.ads}</p><h2>{c.rightsTitle}</h2><p>{c.rights}</p><h2>{c.securityTitle}</h2><p>{c.security}</p><h2>{c.changesTitle}</h2><p>{c.changes}</p></Shell>;
}

export function LocalizedAboutPage({ legal }: { legal: LegalContent }) {
  const c = legal.about;
  return <Shell title={c.title}><p>{c.intro}</p><h2>{c.madeTitle}</h2><p>{c.made}</p><h2 id="mira">{c.guidesTitle}</h2><p>{c.guides}</p><h2>{c.freeTitle}</h2><p>{c.free}</p><h2>{c.contactTitle}</h2><p>{c.contact}</p></Shell>;
}
