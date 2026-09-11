const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const active = db.collection('shops').doc('ctm_melewar').collection('active_parcels');
  // Find the customer from the screenshot: "adi Bin Noor Azzuddin" (3 parcels)
  const snap = await active.get();
  const groups = {};
  snap.forEach(d => {
    const data = d.data();
    const name = data.customerName ? data.customerName.trim() : '';
    if (!name) return;
    if (!groups[name]) groups[name] = [];
    groups[name].push({ id: d.id, loc: data.location });
  });
  // Print any name containing "Noor Azzuddin" or "Azzuddin" or "adi"
  for (const [name, parcels] of Object.entries(groups)) {
    if (/azzuddin|noor azz|adi bin/i.test(name)) {
      console.log(`\n${name} (${parcels.length} parcels):`);
      parcels.forEach(p => console.log(`   ${p.id} @ ${p.loc}`));
    }
  }
})().catch(e => { console.error('ERR', e); process.exit(1); });
