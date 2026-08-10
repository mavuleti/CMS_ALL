import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
const localEnv = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ?? localEnv.match(/^NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.+)$/m)?.[1];
for (const key of ['functions', 'firestore', 'hosting']) {
  if (!config[key]) throw new Error(`firebase.json is missing ${key} configuration`);
}
for (const path of [config.functions.source, config.firestore.rules, config.firestore.indexes]) {
  if (!fs.existsSync(path)) throw new Error(`Firebase deploy input does not exist: ${path}`);
}
if (!projectId) {
  console.warn('Firebase deploy structure is valid; production project ID is not configured in this shell.');
} else {
  console.log(`Firebase deploy structure is valid for ${projectId}.`);
}
