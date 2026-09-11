const sa = require('/home/admin/.openclaw/workspace/serviceAccountKey.json');
const { GoogleAuth } = require('google-auth-library');

(async () => {
  const auth = new GoogleAuth({ credentials: sa, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const project = sa.project_id;
  const name = 'projects/ctm-bsc-98545/rulesets/c27903a5-ea03-4d72-a07a-6a376ed56dba';
  const url = `https://firebaserules.googleapis.com/v1/${name}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token.token}` } });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
})().catch(e => console.error('ERR', e.message));
