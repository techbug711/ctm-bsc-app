const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

const AWBS = [
  '680087247675412','680008346695817','680095341995614','680064045815016',
  '680059537985011','680050233445116'
];

(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  const collected = db.collection('shops').doc('ctm_melewar').collection('collected_parcels');
  const now = Date.now();
  let batch = db.batch();
  let ops = 0;
  const done = [];
  const skipped = [];

  for (const awb of AWBS) {
    const a = await active.doc(awb).get();
    if (!a.exists) { skipped.push(awb); continue; }
    const data = a.data();
    data.collectedAt = now;
    data.collectedBy = 'Auto-Collect (Yoyi Already Shipped)';
    batch.set(collected.doc(awb), data);
    batch.delete(active.doc(awb));
    ops += 2;
    done.push(awb);
    if (ops >= 490) { await batch.commit(); batch = db.batch(); ops = 0; }
  }
  if (ops > 0) await batch.commit();
  console.log(`Marked ${done.length} collected:`);
  done.forEach(a => console.log('  • ' + a));
  if (skipped.length) { console.log(`\nSkipped (not in active_parcels): ${skipped.length}`); skipped.forEach(a => console.log('  • ' + a)); }
})().catch(e => { console.error('ERR', e); process.exit(1); });
