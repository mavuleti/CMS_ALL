const host = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
const base = `http://${host}/v1/projects/demo-project/databases/(default)/documents`;

const read = await fetch(`${base}/puzzles/trex-61-dot-to-dot-puzzle`);
if (!read.ok) throw new Error(`Expected public puzzle read to succeed, got ${read.status}`);

const writes = [
  ['puzzles/rules-test', { fields: { totalClickCount: { integerValue: '1' } } }],
  ['users/rules-test', { fields: { marker: { stringValue: 'blocked' } } }],
  ['users/rules-test/downloads/rules-test', { fields: { marker: { stringValue: 'blocked' } } }],
  ['stats/global', { fields: { marker: { stringValue: 'blocked' } } }]
];

for (const [path, body] of writes) {
  const response = await fetch(`${base}/${path}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (response.ok) throw new Error(`Unexpected direct write success for ${path}`);
}

console.log('Firestore rules emulator smoke test passed: reads allowed, direct writes denied.');
