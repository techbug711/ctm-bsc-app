const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const AWBS = ['680017147595316','680080045235514','680073341125612','680051639415515','680039436325211','680079348615316','680066426965818','680047931925316','680064441265516','680018345855912','680068045955911'];
(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  const collected = db.collection('shops').doc('ctm_melewar').collection('collected_parcels');
  let stillActive = 0;
  for (const awb of AWBS) {
    const a = await active.doc(awb).get();
    const c = await collected.doc(awb).get();
    if (a.exists) { stillActive++; console.log('STILL ACTIVE:', awb); }
    else if (c.exists) console.log('OK collected:', awb);
    else console.log('MISSING BOTH:', awb);
  }
  console.log('\nStill active count:', stillActive);
})().catch(e => { console.error('ERR', e); process.exit(1); });
