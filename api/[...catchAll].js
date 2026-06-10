export default async function handler(req, res) {
  const path = req.query.catchAll?.join('/') || ''
  const target = `https://worldcup26.ir/${path}`

  try {
    const response = await fetch(target, { signal: AbortSignal.timeout(10000) })
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (error) {
    console.error('Proxy error:', error.message)
    res.status(500).json({ error: 'Error al conectar con la fuente de datos' })
  }
}
