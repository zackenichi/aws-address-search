// pages/api/fetchPlaceDetails.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface PlaceDetailsResponse {
  Place: {
    Label: string;
    Street: string;
    Municipality: string;
    SubRegion: string;
    PostalCode: string;
    Country: string;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { placeId } = req.body;
  const placesName = 'z-location-index';
  const region = 'ap-southeast-2';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!placeId) {
    return res.status(400).json({ error: 'Place ID is required' });
  }

  const url = `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placesName}/places/${placeId}?key=${apiKey}&language=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data: PlaceDetailsResponse = await response.json();
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch place details' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
