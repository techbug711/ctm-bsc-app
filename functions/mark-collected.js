const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

const AWBS = [
  '680017147595316','680080045235514','680073341125612','680051639415515',
  '680039436325211','680079348615316','680066426965818','680047931925316',
  '680064441265516','680018345855912','680068045955911'
];

(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  const collected = db.collection('shops').doc('ctm_melewar').collection('collected_parcels');
  const now = Date.now();
  let batch = db.batch();
  let ops = 0;
  const done = [];

  for (const awb of AWBS) {
    const a = await active.doc(awb).get();
    if (!a.exists) {
      console.log(`${awb} | already not in active_parcels (skip)`);
      continue;
    }
    const data = a.data();
    data.collectedAt = now;
    data.collectedBy = 'Manual Fix (Yoyi Already Shipped)';
    batch.set(collected.doc(awb), data);
    batch.delete(active.doc(awb));
    ops += 2;
    done.push(awb);
    if (ops >= 490) { await batch.commit(); batch = db.batch(); ops = 0; }
  }
  if (ops > 0) await batch.commit();
  console.log(`\nMarked ${done.length} parcels collected:`);
  done.forEach(a => console.log('  • ' + a));
})().catch(e => { console.error('ERR', e); process.exit(1); });
