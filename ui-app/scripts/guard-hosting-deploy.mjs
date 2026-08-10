#!/usr/bin/env node
// Blocks `firebase deploy --only hosting` (and any other invocation of
// hosting deploy) unless it's running inside `npm run prod-deploy`
// (deploy.sh / deploy.ps1). Direct `firebase deploy --only hosting` calls
// skip NEXT_PUBLIC_ENABLE_ANALYTICS=true and the verify:ga-live /
// verify:download-tracking-live checks, which is what let GA silently
// stop firing on the live site.

if (process.env.DEPLOY_VIA_PROD_DEPLOY !== "true") {
  console.error(
    "\nBlocked: hosting deploys must go through `npm run prod-deploy` (or ./deploy.sh / .\\deploy.ps1).\n" +
      "Direct `firebase deploy --only hosting` skips the analytics build flag and the post-deploy verification checks.\n"
  );
  process.exit(1);
}
