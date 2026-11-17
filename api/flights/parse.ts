import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const flightSchema = z.object({
  name: z.string().optional(),
  flights: z.array(
    z.object({
      direction: z.enum(['arrival', 'departure']),
      flightNumber: z.string(),
      airline: z.string(),
      from: z.string(),
      to: z.string(),
      departLocal: z.string(),
      arriveLocal: z.string(),
    }),
  ),
})

const prompt = `Read this flight itinerary or boarding-pass screenshot.
Return the passenger first name only if it is clearly visible.
Each visible leg needs direction, flightNumber, airline, from, to, departLocal, and arriveLocal.
A connection inside another country is not the Japan arrival. The arrival is the leg that lands in Japan: HND, NRT, KIX, ITM, NGO, FUK, CTS, or OKA.
direction is "arrival" for that Japan landing and "departure" for the leg that leaves Japan.
If the page says the flight arrives on a later calendar day, arriveLocal uses that arrival date and local time, not the departure date.
from and to are IATA airport codes.
departLocal and arriveLocal are local times as YYYY-MM-DDTHH:mm with no timezone.
Do not invent a return or any leg that is not visible.
Do not put confirmation codes, record locators, ticket numbers, or payment details in any field.
If the image is not a readable flight, return an empty flights array.`

export async function POST(request: Request) {
  const model = process.env.AI_GATEWAY_MODEL || 'google/gemini-2.5-flash'
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Expected an image upload.' }, { status: 400 })
  }
  const file = form.get('image')
  if (!(file instanceof File)) {
    return Response.json({ error: 'Missing image.' }, { status: 400 })
  }
  const type = file.type || 'image/jpeg'
  if (type.includes('heic') || type.includes('heif')) {
    return Response.json(
      { error: 'Convert HEIC to JPEG before upload.' },
      { status: 415 },
    )
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.byteLength < 32 || bytes.byteLength > 8_000_000) {
    return Response.json({ error: 'Could not read that image.' }, { status: 422 })
  }

  try {
    const result = await generateText({
      model,
      output: Output.object({ schema: flightSchema }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: bytes, mediaType: type },
          ],
        },
      ],
    })
    const parsed = result.output
    if (!parsed || parsed.flights.length === 0) {
      return Response.json({ error: 'unreadable' }, { status: 422 })
    }
    return Response.json({
      name: parsed.name,
      flights: parsed.flights.map((flight) => ({
        ...flight,
        flightNumber: flight.flightNumber.replace(/\s+/g, '').toUpperCase(),
        from: flight.from.toUpperCase(),
        to: flight.to.toUpperCase(),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'parse failed'
    const missing =
      /OIDC|AI_GATEWAY|unauthorized|api key|401/i.test(message)
    return Response.json(
      {
        error: missing
          ? 'AI Gateway auth is not available to this deployment.'
          : 'unreadable',
      },
      { status: missing ? 503 : 422 },
    )
  }
}
