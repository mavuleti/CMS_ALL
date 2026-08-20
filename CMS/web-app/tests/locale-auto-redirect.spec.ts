import { expect, test } from '@playwright/test';

test.describe('locale auto-redirect', () => {
  test('redirects /en/ to a matching browser language on first visit and sets the cookie', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    const page = await context.newPage();

    await page.goto(`${baseURL}/en/`);
    await page.waitForURL(`${baseURL}/fr/`);
    expect(page.url()).toBe(`${baseURL}/fr/`);

    const cookies = await context.cookies();
    const preferred = cookies.find((c) => c.name === 'preferred-locale');
    expect(preferred?.value).toBe('fr');

    await context.close();
  });

  test('unsupported browser language stays on English and marks the cookie', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: 'zh-CN' });
    const page = await context.newPage();

    await page.goto(`${baseURL}/en/`);
    await page.waitForTimeout(300);
    expect(page.url()).toBe(`${baseURL}/en/`);

    const cookies = await context.cookies();
    const preferred = cookies.find((c) => c.name === 'preferred-locale');
    expect(preferred?.value).toBe('en');

    await context.close();
  });

  test('existing cookie wins over browser language on return visits', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    await context.addCookies([
      { name: 'preferred-locale', value: 'de', url: baseURL as string }
    ]);
    const page = await context.newPage();

    await page.goto(`${baseURL}/en/`);
    await page.waitForURL(`${baseURL}/de/`);
    expect(page.url()).toBe(`${baseURL}/de/`);

    await context.close();
  });

  test('does not redirect away from an explicitly visited locale path', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: 'fr-FR' });
    await context.addCookies([
      { name: 'preferred-locale', value: 'de', url: baseURL as string }
    ]);
    const page = await context.newPage();

    await page.goto(`${baseURL}/es/`);
    await page.waitForTimeout(300);
    expect(page.url()).toBe(`${baseURL}/es/`);

    await context.close();
  });
});
