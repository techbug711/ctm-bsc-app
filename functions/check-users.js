const admin = require('firebase-admin');
const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
(async () => {
  const users = await db.collection('users').get();
  console.log('=== USERS collection (' + users.size + ') ===');
  users.forEach(d => console.log(d.id, '=>', JSON.stringify(d.data())));
  // Also check shop doc for staffProfiles
  const shop = await db.collection('shops').doc('ctm_melewar').get();
  const sd = shop.data();
  console.log('\n=== SHOP staffProfiles ===');
  console.log(JSON.stringify(sd.staffProfiles));
  console.log('\n=== SHOP tier/status/expiry ===');
  console.log('tier:', sd.tier, '| status:', sd.status, '| expiryDate:', sd.expiryDate);
})().catch(e => { console.error('ERR', e); process.exit(1); });
