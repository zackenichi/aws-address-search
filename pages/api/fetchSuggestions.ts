// pages/api/fetchSuggestions.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface PlaceResult {
  Text: string;
  PlaceId: string;
}

interface SearchResponse {
  Summary: {
    Text: string;
    MaxResults: number;
    DataSource: string;
  };
  Results: PlaceResult[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { text } = req.body;
  const placesName = 'z-location-index';
  const region = 'ap-southeast-2';
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const url = `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placesName}/search/suggestions?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Text: text,
        MaxResults: 10,
      }),
    });

    if (response.ok) {
      const data: SearchResponse = await response.json();
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Failed to fetch suggestions' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
