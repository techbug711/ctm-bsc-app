const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

(async () => {
  const shop = await db.collection('shops').doc('ctm_melewar').get();
  if (shop.exists) {
    const d = shop.data();
    console.log('=== SHOP ===');
    console.log('shopName:', d.shopName, '| tier:', d.tier);
    console.log('rackLayout:', JSON.stringify(d.rackLayout, null, 2));
  } else {
    console.log('shop ctm_melewar NOT FOUND');
  }

  const snap = await db.collection('shops').doc('ctm_melewar').collection('active_parcels').get();
  const byLoc = {};
  const byAwb = {};
  snap.forEach(doc => {
    const d = doc.data();
    const loc = (d.location || 'UNKNOWN').toString().toUpperCase().trim();
    byLoc[loc] = (byLoc[loc] || 0) + 1;
    byAwb[doc.id] = (byAwb[doc.id] || 0) + 1;
  });
  console.log('\n=== ACTIVE PARCELS BY LOCATION (total ' + snap.size + ') ===');
  Object.entries(byLoc).sort().forEach(([loc, n]) => console.log(loc, '=>', n));
  const dups = Object.entries(byAwb).filter(([k,v]) => v > 1);
  console.log('\nDuplicate AWB docs:', dups.length ? JSON.stringify(dups) : 'none');
})().catch(e => { console.error('ERR', e); process.exit(1); });
