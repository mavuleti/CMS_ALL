import legal from '@/content/az/legal.json';

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main><section className="section" style={{ maxWidth: '72ch', margin: '0 auto' }}><h1>{title}</h1>{children}</section></main>;
}

export function AzTermsPage() { const c = legal.terms; return <LegalShell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.freeTitle}</h2><p>{c.free}</p><h2>{c.permissionTitle}</h2><p>{c.permission}</p><h2>{c.ipTitle}</h2><p>{c.ip}</p><h2>{c.warrantyTitle}</h2><p>{c.warranty}</p><h2>{c.externalTitle}</h2><p>{c.external}</p><h2>{c.changesTitle}</h2><p>{c.changes}</p></LegalShell>; }
export function AzPrivacyPage() { const c = legal.privacy; return <LegalShell title={c.title}><p><em>{c.effective}</em></p><p>{c.intro}</p><h2>{c.collectTitle}</h2><p>{c.analytics}</p><p>{c.email}</p><p>{c.forms}</p><p>{c.notCollect}</p><h2>{c.childrenTitle}</h2><p>{c.children}</p><h2>{c.adsTitle}</h2><p>{c.ads}</p><h2>{c.rightsTitle}</h2><p>{c.rights}</p><h2>{c.securityTitle}</h2><p>{c.security}</p><h2>{c.changesTitle}</h2><p>{c.changes}</p></LegalShell>; }
export function AzAboutPage() { const c = legal.about; return <LegalShell title={c.title}><p>{c.intro}</p><h2>{c.madeTitle}</h2><p>{c.made}</p><h2>{c.guidesTitle}</h2><p>{c.guides}</p><h2>{c.freeTitle}</h2><p>{c.free}</p><h2>{c.contactTitle}</h2><p>{c.contact}</p></LegalShell>; }
