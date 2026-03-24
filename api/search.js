export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, price_max, year_min } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query param: q' });
  }

  try {
    const params = new URLSearchParams({
      q,
      category: 'MLA1744', // Autos y Camionetas - Argentina
      limit: '20',
      sort: 'price_asc',
    });

    // Price filter if provided
    if (price_max) {
      params.append('price_max', price_max);
    }

    const url = `https://api.mercadolibre.com/sites/MLA/search?${params}`;
    const response = await fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; car-agents/1.0)',
    'Accept': 'application/json',
  }
});

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter by year if provided
    let results = data.results || [];
    if (year_min) {
      const minYear = parseInt(year_min);
      results = results.filter(item => {
        const yearAttr = item.attributes?.find(a => a.id === 'VEHICLE_YEAR');
        if (!yearAttr) return true;
        return parseInt(yearAttr.value_name) >= minYear;
      });
    }

    return res.status(200).json({
      results,
      total: results.length,
      paging: data.paging,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
