import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { niche, city, country, limit } = await req.json();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY manquante' }, { status: 500 });
  }

  const query = `${niche} ${city} ${country}`;
  const url = `https://places.googleapis.com/v1/places:searchText`;

  const results: any[] = [];
  let nextPageToken: string | undefined;

  // Fetch up to 3 pages (20 results each) or until limit reached
  for (let page = 0; page < 3 && results.length < limit; page++) {
    const body: any = {
      textQuery: query,
      maxResultCount: Math.min(20, limit - results.length),
      languageCode: 'fr',
    };
    if (nextPageToken) body.pageToken = nextPageToken;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.internationalPhoneNumber',
          'places.websiteUri',
          'places.rating',
          'places.userRatingCount',
          'places.primaryTypeDisplayName',
          'places.googleMapsUri',
          'nextPageToken',
        ].join(','),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Google Places error: ${err}` }, { status: res.status });
    }

    const data = await res.json();
    if (data.places) results.push(...data.places);
    nextPageToken = data.nextPageToken;
    if (!nextPageToken) break;
  }

  const prospects = results.slice(0, limit).map((p: any) => ({
    name: p.displayName?.text ?? 'Sans nom',
    category: p.primaryTypeDisplayName?.text ?? niche,
    address: p.formattedAddress,
    phone: p.internationalPhoneNumber,
    website: p.websiteUri,
    googleRating: p.rating,
    googleReviewsCount: p.userRatingCount,
    sourceUrl: p.googleMapsUri,
  }));

  return NextResponse.json({ prospects });
}
