const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

const AWBS = [
  'SPXMY068923728779','SPXMY061898473249','SPXMY061955716729','SPXMY067665709089',
  'SPXMY060482708669','SPXMY060727291489','SPXMY068398113399','SPXMY063970242619',
  'SPXMY068617050029','SPXMY069717014789','SPXMY069389136809','SPXMY061848598579',
  'SPXMY061706048779','SPXMY061058945019','SPXMY064932178349','SPXMY062811302419',
  'SPXMY066107144799','SPXMY065283286089','SPXMY065595372909','SPXMY064209496179',
  'SPXMY068184064589','SPXMY068251162629','SPXMY063221336139'
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
    if (!a.exists) {
      skipped.push(awb);
      continue;
    }
    const data = a.data();
    data.collectedAt = now;
    data.collectedBy = 'Auto-Collect (SPX Already Collected)';
    batch.set(collected.doc(awb), data);
    batch.delete(active.doc(awb));
    ops += 2;
    done.push(awb);
    if (ops >= 490) { await batch.commit(); batch = db.batch(); ops = 0; }
  }
  if (ops > 0) await batch.commit();
  console.log(`Marked ${done.length} collected:`);
  done.forEach(a => console.log('  • ' + a));
  if (skipped.length) {
    console.log(`\nSkipped (not in active_parcels): ${skipped.length}`);
    skipped.forEach(a => console.log('  • ' + a));
  }
})().catch(e => { console.error('ERR', e); process.exit(1); });
