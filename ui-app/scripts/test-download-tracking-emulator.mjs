const host = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
const url = `http://${host}/v1/projects/demo-project/databases/(default)/documents/puzzles`;
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Firestore emulator is unavailable at ${host} (${response.status}). Start firebase emulators first.`);
}
const data = await response.json();
const ids = new Set((data.documents ?? []).map((doc) => doc.name.split('/').pop()));
for (const expected of ['trex-61-dot-to-dot-puzzle', 'brontosaurus-dot-to-dot-puzzle', 'mermaid-dot-to-dot-puzzle']) {
  if (!ids.has(expected)) throw new Error(`Missing seeded emulator puzzle: ${expected}`);
}
console.log(`Firestore emulator smoke test passed with ${ids.size} puzzle documents.`);
