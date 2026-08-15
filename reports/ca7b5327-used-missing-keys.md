# Used non-heading keys missing from current JSON

Comparison commit: `ca7b5327`

- Verified missing locale-key records: **1,248**
- Distinct missing keys used by current code: **39**
- Affected languages: **32**
- Languages: `ar, az, cs, da, de, el, es, fa, fi, fr, hr, hu, id, it, ja, ko, lt, lv, nl, no, pl, pt, pt-BR, ro, ru, sk, sl, sv, th, tr, uk, vi`
- Historical values are taken directly from the committed locale JSON.
- Current status was verified as a missing key, not an empty string.
- All keys ending in `heading` were excluded.
- The current message loader merges English bundled content first, so these gaps can silently display English fallback text.

## Key summary

| Missing key | Affected languages | Page(s) | Current code usage |
|---|---:|---|---|
| `body.purchase.cancelled.eyebrow` | 32 | `/{locale}/purchase/cancelled/` | `generator/Ui-app-DB-json/app/[locale]/purchase/cancelled/page.tsx:28` |
| `body.purchase.cancelled.lede` | 32 | `/{locale}/purchase/cancelled/` | `generator/Ui-app-DB-json/app/[locale]/purchase/cancelled/page.tsx:30` |
| `body.purchase.cancelled.metaTitle` | 32 | `/{locale}/purchase/cancelled/` | `generator/Ui-app-DB-json/app/[locale]/purchase/cancelled/page.tsx:17` |
| `body.purchase.checkout.consent` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/components/BuyButton.tsx:50` |
| `body.purchase.checkout.error` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/components/BuyButton.tsx:57` |
| `body.purchase.checkout.opening` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/components/BuyButton.tsx:54` |
| `body.purchase.checkout.refundPolicy` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/components/BuyButton.tsx:50` |
| `body.purchase.checkout.secureNote` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/components/BuyButton.tsx:56` |
| `body.purchase.download.button` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:66,76` |
| `body.purchase.download.demoText` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:65` |
| `body.purchase.download.demoTitle` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:64` |
| `body.purchase.download.expires` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:79` |
| `body.purchase.download.failed` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:92` |
| `body.purchase.download.preparing` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:102` |
| `body.purchase.premium.benefits.classroomUse` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:71` |
| `body.purchase.premium.benefits.instantAccess` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:71` |
| `body.purchase.premium.benefits.kidFriendly` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:71` |
| `body.purchase.premium.benefits.onePdf` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:71` |
| `body.purchase.premium.benefits.paperSizes` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:71` |
| `body.purchase.premium.buyButton` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:60` |
| `body.purchase.premium.coverAlt` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:45;<br> generator/Ui-app-DB-json/components/BestOf2026BookAd.tsx:12` |
| `body.purchase.premium.detailsEyebrow` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:66` |
| `body.purchase.premium.detailsText` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:68` |
| `body.purchase.premium.digitalPdf` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:36` |
| `body.purchase.premium.eyebrow` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:32` |
| `body.purchase.premium.guaranteeText` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:76` |
| `body.purchase.premium.instantAccess` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:38` |
| `body.purchase.premium.lede` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:34` |
| `body.purchase.premium.localNote` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:61` |
| `body.purchase.premium.metaDescription` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:18` |
| `body.purchase.premium.metaTitle` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:18` |
| `body.purchase.premium.oneTime` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:56` |
| `body.purchase.premium.printAtHome` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:37` |
| `body.purchase.premium.purchaseAria` | 32 | `/{locale}/premium/` | `generator/Ui-app-DB-json/app/[locale]/premium/page.tsx:41` |
| `body.purchase.shared.contactUs` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:82,95` |
| `body.purchase.shared.returnToPack` | 32 | `/{locale}/purchase/success/; /{locale}/purchase/cancelled/` | `generator/Ui-app-DB-json/components/PurchaseDownloadLink.tsx:67;<br> generator/Ui-app-DB-json/app/[locale]/purchase/cancelled/page.tsx:31` |
| `body.purchase.success.eyebrow` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/app/[locale]/purchase/success/page.tsx:30` |
| `body.purchase.success.lede` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/app/[locale]/purchase/success/page.tsx:32` |
| `body.purchase.success.metaTitle` | 32 | `/{locale}/purchase/success/` | `generator/Ui-app-DB-json/app/[locale]/purchase/success/page.tsx:19` |

## Verification notes

Each CSV row contains the affected language, rendered page, JSON key, historical required localized value, missing status, and current source-code reference. The report intentionally excludes `dot_guide.heading` and every other heading key.

Detailed data: [`ca7b5327-used-missing-keys.csv`](ca7b5327-used-missing-keys.csv)
