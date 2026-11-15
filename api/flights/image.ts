import { get } from '@vercel/blob'
import { readStoredFlights } from '../flight-store'

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  const stored = await readStoredFlights()
  const pathname = stored.find((item) => item.id === id)?.screenshotPath
  if (!pathname?.startsWith('flights/shots/')) {
    return new Response('Not found', { status: 404 })
  }
  const result = await get(pathname, { access: 'private' })
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new Response('Not found', { status: 404 })
  }
  return new Response(result.stream, {
    headers: {
      'content-type': result.blob.contentType || 'image/jpeg',
      'cache-control': 'private, max-age=3600',
    },
  })
}
