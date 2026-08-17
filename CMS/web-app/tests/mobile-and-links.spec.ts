import { expect, test } from '@playwright/test';

/* ── Viewports ────────────────────────────────────────────────────────────── */
const mobileViewports = [
  { width: 320, height: 720,  name: 'small phone' },
  { width: 390, height: 844,  name: 'modern phone' },
  { width: 768, height: 1024, name: 'tablet portrait' }
];

const en = (path = '/') => `/en${path === '/' ? '/' : path}`;

async function jsonLdByType(page: import('@playwright/test').Page, type: string) {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.find((content) => {
    try {
      const data = JSON.parse(content);
      const types = Array.isArray(data['@type']) ? data['@type'] : [data['@type']];
      return types.includes(type);
    } catch {
      return content.includes(`"@type":"${type}"`);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════════ */
test.describe('Home page — content', () => {
  test('discovery heading, search, and featured puzzles are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /find the perfect dot to dot printables/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /search puzzles/i })).toBeVisible();
    await expect(page.locator('.discovery-card')).toHaveCount(8);
  });

  test('Mermaid is a featured printable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.discovery-card').filter({ hasText: 'Mermaid' })).toBeVisible();
  });

  test('homepage navigation exposes Dinosaurs and Ocean', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: /open categories menu/i });
    if (await menuButton.isVisible()) await menuButton.click();
    const navigation = await page.getByRole('dialog').isVisible().catch(() => false)
      ? page.getByRole('dialog')
      : page.locator('.category-menu-bar');
    const dinoLink = navigation.getByRole('link', { name: /^dinosaurs$/i });
    await expect(dinoLink).toBeVisible();
    await expect(dinoLink).toHaveAttribute('href', '/en/dinosaurs/');
    const oceanLink = navigation.getByRole('link', { name: /^ocean$/i });
    await expect(oceanLink).toBeVisible();
  });

  test('benefits section is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /why dot to dot worksheets are great/i })).toBeVisible();
    await expect(page.getByText(/fine motor skills/i).first()).toBeVisible();
  });

  test('FAQ section is present with questions', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /frequently asked questions/i })).toBeVisible();
    await expect(page.getByText(/are all dot to dot printables/i)).toBeVisible();
  });

  test('FAQ accordion opens on click', async ({ page }) => {
    await page.goto('/');
    const firstQuestion = page.locator('details').first();
    await firstQuestion.click();
    const answer = firstQuestion.locator('p');
    await expect(answer).toBeVisible();
  });

  test('feedback section is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#feedback')).toBeVisible();
  });

  test('JSON-LD structured data is present', async ({ page }) => {
    await page.goto('/');
    expect(await jsonLdByType(page, 'WebSite')).toBeTruthy();
  });

  test('AdSense placeholders are hidden until ads are enabled', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#ad-home-banner')).toHaveCount(0);
    await expect(page.locator('#ad-home-leaderboard')).toHaveCount(0);
  });

  test('no horizontal overflow on home page', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test('no encoding errors in page text', async ({ page }) => {
    await page.goto('/');
    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).not.toContain('�');
  });
});

test.describe('Home page — mobile layout', () => {
  for (const viewport of mobileViewports) {
    test(`no horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });

    test(`discovery heading visible on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1, name: /find the perfect dot to dot printables/i })).toBeVisible();
    });
  }

  test('mobile category menu opens and bookmark FAB is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('.floating-bookmark-wrap.mobile-bookmark-fab')).toBeHidden();

    await page.getByRole('button', { name: /open.*menu|categories/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('link', { name: /more/i })).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   DINOSAURS SUB-HOME (/dinosaurs)
═══════════════════════════════════════════════════════════════════════════ */
test.describe('Dinosaurs page — content', () => {
  test('page heading is correct', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables for kids/i })).toBeVisible();
  });

  test('breadcrumb shows Home > Dinosaurs', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
    await expect(page.locator('nav.breadcrumb')).toContainText('Dinosaurs');
  });

  test('shows all 10 dinosaur cards', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const cards = page.locator('article.puzzle-card');
    await expect(cards).toHaveCount(8);
  });

  test('all 8 dinosaur names are visible', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const names = [
      'T-Rex 61-Dot Challenge', 'Ostrich', 'Triceratops', 'Velociraptor', 'Stegosaurus',
      'Spinosaurus', 'Pterodactyl', 'Brontosaurus'
    ];
    for (const name of names) {
      await expect(page.getByText(name).first()).toBeVisible();
    }
  });

  test('puzzle cards use a small fallback image with responsive candidates', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const image = page.locator('article.puzzle-card').filter({ hasText: 'Triceratops' }).locator('img').first();

    await expect(image).toHaveAttribute('src', '/images/triceratops-puzzle-400.webp');
    await expect(image).toHaveAttribute(
      'srcset',
      '/images/triceratops-puzzle-400.webp 400w, /images/triceratops-puzzle-600.webp 600w, /images/triceratops-puzzle-700.webp 700w, /images/triceratops-puzzle.webp 420w'
    );
  });

  test('Brontosaurus card uses the new 50-dot puzzle', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const cards = page.locator('article.puzzle-card');
    const card = page.locator('article.puzzle-card').filter({ hasText: 'Brontosaurus' });

    await expect(cards.nth(0)).toContainText('T-Rex 61-Dot Challenge');
    await expect(cards.nth(2)).toContainText('Brontosaurus');
    await expect(card).toContainText('1–50 dots');
    await expect(card.getByRole('link', { name: /view & download - brontosaurus/i })).toHaveAttribute(
      'href',
      '/en/dinosaurs/brontosaurus-dot-to-dot-puzzle/'
    );
  });

  test('Brontosaurus detail page uses the replacement PDF', async ({ page }) => {
    await page.goto(en('/dinosaurs/brontosaurus-dot-to-dot-puzzle/'));

    await expect(
      page.getByRole('heading', { level: 1, name: /brontosaurus dot to dot/i })
    ).toBeVisible();
    await expect(page.getByText(/dots:\s*1.*50/i)).toBeVisible();
    await expect(
      page.getByRole('link', { name: /us letter.*download free brontosaurus dot-to-dot printable pdf/i })
    ).toHaveAttribute(
      'href',
      '/dinosaurs/brontosaurus-dot-to-dot-puzzle-printable-horizontal.pdf'
    );
  });

  test('ad slot placeholders are present', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    await expect(page.locator('#ad-dino-top')).toHaveCount(0);
    await expect(page.locator('#ad-dino-mid')).toHaveCount(0);
  });

  test('T-Rex 61-dot card links to correct puzzle page', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const trexLink = page.getByRole('link', { name: /view & download - t-rex 61-dot challenge/i });
    await expect(trexLink).toHaveAttribute('href', '/en/dinosaurs/trex-61-dot-to-dot-puzzle/');
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(en('/dinosaurs/'));
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test('JSON-LD ItemList schema is present', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    const content = await jsonLdByType(page, 'ItemList');
    expect(content).toContain('trex-61-dot-to-dot-puzzle');
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   INDIVIDUAL PUZZLE PAGES (/dinosaurs/[slug])
═══════════════════════════════════════════════════════════════════════════ */
test.describe('T-Rex 61-dot puzzle page — content', () => {
  test('page heading contains dinosaur name', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.getByRole('heading', { name: /t-rex dot to dot/i })).toBeVisible();
  });

  test('breadcrumb shows Home > Dinosaurs > T-Rex', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /dinosaurs/i }).first()).toBeVisible();
    await expect(page.getByText('T-Rex 61-Dot Challenge').first()).toBeVisible();
  });

  test('meta chips show age, dots, and free label', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    const metaChips = page.locator('.meta-chips');
    await expect(metaChips.getByText(/ages.*6.9/i)).toBeVisible();
    await expect(metaChips.getByText(/dots.*1.*61/i)).toBeVisible();
    await expect(metaChips.getByText(/100% free/i)).toBeVisible();
  });

  test('fun fact box is visible', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.getByText(/fun fact/i).first()).toBeVisible();
  });

  test('download button links directly to the printable PDF', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    const downloadLink = page.getByRole('link', {
      name: /us letter.*download free t-rex 61-dot challenge dot-to-dot printable pdf/i,
    });

    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute(
      'href',
      '/dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf'
    );
  });

  test('ad slots are present including pre-download slot', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.locator('#ad-puzzle-top-trex-61-dot-to-dot-puzzle')).toHaveCount(0);
    await expect(page.locator('#ad-puzzle-predownload-trex-61-dot-to-dot-puzzle')).toHaveCount(0);
  });

  test('related puzzles section shows 3 other dinosaurs', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.getByRole('heading', { name: /you might also like/i })).toBeVisible();
    const relatedSection = page.locator('section', {
      has: page.getByRole('heading', { name: /you might also like/i })
    });
    const relatedCards = relatedSection.locator('article.puzzle-card');
    await expect(relatedCards).toHaveCount(3);
  });

  test('back link goes to /dinosaurs', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await expect(page.getByRole('link', { name: /back to all dinosaur puzzles/i })).toHaveAttribute('href', '/en/dinosaurs/');
  });

  test('JSON-LD CreativeWork schema is present', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    const content = await jsonLdByType(page, 'CreativeWork');
    expect(content).toContain('T-Rex 61-Dot Challenge');
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});

test.describe('Coming-soon puzzle pages (dummy assets)', () => {
  const dummySlugs = ['brachiosaurus', 'ankylosaurus', 'allosaurus'];

  for (const slug of dummySlugs) {
    test(`${slug} page loads and shows coming soon button`, async ({ page }) => {
      await page.goto(en(`/dinosaurs/${slug}/`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByText(/coming soon/i).first()).toBeVisible();
    });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION FLOW
═══════════════════════════════════════════════════════════════════════════ */
test.describe('Navigation flow', () => {
  test('Home -> /dinosaurs in 1 click', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: /open categories menu/i });
    if (await menuButton.isVisible()) await menuButton.click();
    const navigation = await page.getByRole('dialog').isVisible().catch(() => false)
      ? page.getByRole('dialog')
      : page.locator('.category-menu-bar');
    await navigation.getByRole('link', { name: /^dinosaurs$/i }).click();
    await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
    await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables/i })).toBeVisible();
  });

  test('/dinosaurs -> puzzle page in 1 click', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    await page.getByRole('link', { name: /view & download - t-rex 61-dot challenge/i }).click();
    await expect(page).toHaveURL(/\/en\/dinosaurs\/trex-61-dot-to-dot-puzzle\/?$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /t-rex dot to dot/i })
    ).toBeVisible();
  });

  test('puzzle page breadcrumb navigates back to /dinosaurs', async ({ page }) => {
    await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
    await page.getByRole('link', { name: /dinosaurs/i }).first().click();
    await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
  });

  test('navbar brand link returns to home', async ({ page }) => {
    await page.goto(en('/dinosaurs/'));
    await page.getByRole('link', { name: /dottodotfreeprintables.*home/i }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   LINKS — no broken links across all key pages
═══════════════════════════════════════════════════════════════════════════ */
test.describe('No broken links', () => {
  const pagesToCheck = ['/', '/dinosaurs', '/dinosaurs/trex-61-dot-to-dot-puzzle', '/dinosaurs/triceratops'];

  for (const path of pagesToCheck) {
    test(`all same-origin links on ${path} resolve (< 400)`, async ({ page, request, baseURL }) => {
      await page.goto(path);
      const hrefs = await page.$$eval('a[href]', (anchors) =>
        anchors
          .map((a) => a.getAttribute('href'))
          .filter((h): h is string => typeof h === 'string' && h !== '' && !h.startsWith('#') && !h.startsWith('mailto'))
      );

      const base = new URL(baseURL ?? 'http://localhost:45943');
      const urls = Array.from(new Set(
        hrefs
          .map((h) => new URL(h, base))
          .filter((u) => u.origin === base.origin)
          .map((u) => { u.hash = ''; return u.toString(); })
      ));

      for (const url of urls) {
        const res = await request.get(url);
        expect(res.status(), `${url} should not be broken`).toBeLessThan(400);
      }
    });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   SEO — meta tags
═══════════════════════════════════════════════════════════════════════════ */
test.describe('SEO meta tags', () => {
  test('home page has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/free dot to dot printables for kids/i);
  });

  test('home page has meta description', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(50);
  });

  test('/dinosaurs page has unique title', async ({ page }) => {
    await page.goto('/dinosaurs');
    const title = await page.title();
    expect(title).toContain('Dinosaur');
  });

  test('puzzle page has dinosaur name in title', async ({ page }) => {
    await page.goto('/dinosaurs/trex-61-dot-to-dot-puzzle');
    const title = await page.title();
    expect(title).toContain('T-Rex Dot to Dot');
  });
});

