export default async function handler(request, response) {
  // Allow cross-origin requests
  response.setHeader('Access-Control-Allow-Credentials', true)
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (request.method === 'OPTIONS') {
    response.status(200).end()
    return
  }

  const { url } = request.query

  if (!url) {
    return response.status(400).json({ error: 'Faltou o parâmetro URL' })
  }

  try {
    const fetchResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    })

    if (!fetchResponse.ok) {
      throw new Error(`Proxy target responded with status ${fetchResponse.status}`)
    }

    const html = await fetchResponse.text()
    
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.status(200).send(html)

  } catch (error) {
    console.error('Proxy Error:', error.message)
    response.status(500).json({ error: 'Falha ao buscar a página original via proxy.' })
  }
}
