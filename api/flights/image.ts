import { get } from '@vercel/blob'

const indexPath = 'flights/index.json'

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return new Response('Not found', { status: 404 })
  let pathname: string | null = null
  try {
    const result = await get(indexPath, { access: 'private', useCache: false })
    if (result?.statusCode === 200 && result.stream) {
      const text = await new Response(result.stream).text()
      const parsed = JSON.parse(text) as {
        flights?: { id: string; screenshotPath: string | null }[]
      }
      pathname = parsed.flights?.find((flight) => flight.id === id)?.screenshotPath ?? null
    }
  } catch {
    pathname = null
  }
  if (!pathname?.startsWith('flights/shots/')) {
    return new Response('Not found', { status: 404 })
  }
  const image = await get(pathname, { access: 'private' })
  if (!image || image.statusCode !== 200 || !image.stream) {
    return new Response('Not found', { status: 404 })
  }
  return new Response(image.stream, {
    headers: {
      'content-type': image.blob.contentType || 'image/jpeg',
      'cache-control': 'private, max-age=3600',
    },
  })
}
