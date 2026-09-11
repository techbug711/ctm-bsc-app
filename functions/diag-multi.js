const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  const snap = await active.get();
  // Group by customerName (case-sensitive, like the app)
  const groups = {};
  snap.forEach(d => {
    const data = d.data();
    const name = data.customerName ? data.customerName.trim() : '';
    if (!name) return;
    if (!groups[name]) groups[name] = [];
    groups[name].push({ id: d.id, loc: data.location });
  });
  // Find customers with 3+ parcels, not all in BULK
  console.log('=== Customers with 3+ scattered parcels (would show in MULTI tab) ===');
  let count = 0;
  for (const [name, parcels] of Object.entries(groups)) {
    if (parcels.length >= 3) {
      const allBulk = parcels.every(p => (p.loc||'').startsWith('BULK'));
      if (!allBulk) {
        count++;
        console.log(`\n${name} (${parcels.length} parcels):`);
        parcels.forEach(p => console.log(`   ${p.id} @ ${p.loc}`));
      }
    }
  }
  console.log(`\nTotal groups: ${count}`);
})().catch(e => { console.error('ERR', e); process.exit(1); });
