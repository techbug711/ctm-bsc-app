const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const collected = db.collection('shops').doc('ctm_melewar').collection('collected_parcels');
  // Get recent collected parcels (last 200 by collectedAt)
  const snap = await collected.orderBy('collectedAt', 'desc').limit(200).get();
  const byWho = {};
  const recent = [];
  snap.forEach(d => {
    const data = d.data();
    const who = data.collectedBy || 'unknown';
    byWho[who] = (byWho[who] || 0) + 1;
    const t = data.collectedAt?.toMillis ? data.collectedAt.toMillis() : data.collectedAt;
    recent.push({ awb: d.id, who, t: t ? new Date(t).toISOString() : 'n/a' });
  });
  console.log('=== collected_parcels: last 200 by collectedBy ===');
  Object.entries(byWho).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
  console.log('\n=== 15 most recent ===');
  recent.slice(0,15).forEach(r => console.log(`  ${r.t} | ${r.who} | ${r.awb}`));
})().catch(e => { console.error('ERR', e); process.exit(1); });
