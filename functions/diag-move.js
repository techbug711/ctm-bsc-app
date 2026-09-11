const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  // Find parcels with BULK location
  const snap = await active.where('location', '>=', 'BULK').where('location', '<=', 'BULK\uf8ff').get();
  console.log('=== Parcels with BULK* location (' + snap.size + ') ===');
  const recent = [];
  snap.forEach(d => {
    const data = d.data();
    recent.push({ awb: d.id, loc: data.location, name: data.customerName });
  });
  recent.slice(0, 30).forEach(r => console.log(`  ${r.loc} | ${r.awb} | ${r.name}`));
})().catch(e => { console.error('ERR', e); process.exit(1); });
