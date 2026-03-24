export default async function handler(req, res) {
  const { code, error } = req.query;
  if (error || !code) return res.redirect('/?error=auth_denied');

  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      }),
    });
    const data = await response.json();
    res.redirect(`/?token=${data.access_token}`);
  } catch (e) {
    res.redirect('/?error=server_error');
  }
}