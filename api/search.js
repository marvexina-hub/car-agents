export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q, price_max, year_min, token } = req.query;

  if (!q) return res.status(400).json({ error: 'Missing q' });
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const params = new URLSearchParams({ q, category: 'MLA1744', limit: '20', sort: 'price_asc' });
    if (price_max) params.append('price_max', price_max);

    const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?${params}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`ML API error: ${response.status}`);
    const data = await response.json();

    let results = data.results || [];
    if (year_min) {
      const minYear = parseInt(year_min);
      results = results.filter(item => {
        const y = item.attributes?.find(a => a.id === 'VEHICLE_YEAR')?.value_name;
        return y ? parseInt(y) >= minYear : true;
      });
    }
    return res.status(200).json({ results, total: results.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}