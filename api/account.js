// Vercel serverless relay — GasFree account fetch bypass CORS
// /api/account?addr=TXxx → proxies GET to open.gasfree.io server-side

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { addr } = req.query;
  if (!addr) return res.status(400).json({ error: 'Missing addr param' });

  try {
    const r = await fetch(`https://open.gasfree.io/tron/api/v1/address/${encodeURIComponent(addr)}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
