const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');

(async () => {
  // Use firebase-admin to get a token via the service account
  const admin = require('firebase-admin');
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  const project = sa.project_id;
  // firebase-admin doesn't expose rules API directly; use REST with a manually minted token
  const { GoogleAuth } = require('google-auth-library');
  const auth = new GoogleAuth({ credentials: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const url = `https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token.token}` } });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2).slice(0, 4000));
})().catch(e => console.error('ERR', e.message));
